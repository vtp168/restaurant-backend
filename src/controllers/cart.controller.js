import {cartModel} from "../models/cart.model.js";
import asyncHandler from 'express-async-handler';
import { orderModel } from "../models/order.model.js";

export const addCart = asyncHandler(async (req, res) => {
  //const { menuItemId, size, quantity } = req.body.items;
  
  //console.log(tableId);

  try {
    const tableId = req.params.tableId;
    const { items } = req.body;
    if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "tableId និង items គឺត្រូវតែមាន" });
    }
    //console.log(items);

    const cart = new cartModel({
      tableId,
      status: "active",
      isActive: true
    });

    cart.items = items; // add menu the cart by customer
  
    //console.log(cart.items);

    const newCart = await cart.save(); // add menu the cart by customer
    return res.status(201).json({
      message: "Cart created successfully",
      cart: newCart,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export const getCartByTableId = asyncHandler(async (req, res) => {
  const { tableId } = req.params;
  //console.log(tableId);
  const cart = await cartModel.findOne({ tableId, status: "active" })
  .populate({
        path: "items.menuItemId",
        select: "name name_kh image available"
  })
  .populate({
        path: "tableId", // ✅ populate table
        select: "name capacity"
  });
  res.json(cart || { items: [] });
});

//checkout cart to order
export const checkoutCart= asyncHandler(async (req, res) => {
  const { tableId } = req.params;
  const cart = await cartModel.findOne({ tableId, status: "active" });
  if (!cart) return res.status(400).json({ error: "Cart not found" });

  cart.status = "checkedout";
  await cart.save();

  let newItems = cart.items.map(i => ({
    menuItemId: i.menuItemId,
    size: i.size,
    quantity: i.quantity,
    price: i.price
  }));

  // Get last orderNo
  const lastOrder = await orderModel.findOne().sort({ orderNo: -1 });
  const lastOrderNo = lastOrder ? lastOrder.orderNo : 0;
  
  // Check if there's an existing unpaid order for the table

  let order = await orderModel.findOne({ tableId, status: { $ne: "paid" } });
  if (order) {
    // append items
    order.items.push(...newItems);
    await order.save();
  } else {
    // new order
    order = await orderModel.create({
      orderNo: lastOrderNo + 1,
      tableId,
      items: newItems,
      createdBy: req.user._id, // from authMiddleware
    });
}

  // Here you could create an Order record for kitchen/chef
  res.json({ message: "Checkout successful", order: order });
});

// 🛒 Add item to existing Cart
export const addItemToCart = asyncHandler(async (req, res) => {
  try {
    const { cartId } = req.params;
    const { menuItem, size, quantity, price } = req.body;

    if (!menuItem || !price) {
      return res.status(400).json({ message: "menuItem និង price ត្រូវតែមាន" });
    }

    const cart = await cartModel.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items.push({ menuItem, size, quantity, price });
    const updatedCart = await cart.save();

    return res.status(200).json({
      message: "Item added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error adding item:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🛒 Remove item from Cart
export const removeItemFromCart = asyncHandler(async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    console.log(cartId, itemId);

    const cart = await cartModel.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

     // Find index of item in cart
    const itemIndex = cart.items.findIndex(i => i._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    // Remove item from array
    cart.items.splice(itemIndex, 1);
    const updatedCart = await cart.save();

    return res.status(200).json({
      message: "Item removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error removing item:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🛒 Update item quantity in Cart
export const updateItemQuantity = asyncHandler(async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than zero" });
    }

    const cart = await cartModel.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    const updatedCart = await cart.save();

    return res.status(200).json({
      message: "Item quantity updated",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error updating item quantity:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🛒 Clear all items from Cart
export const clearCart = asyncHandler(async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await cartModel.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    const updatedCart = await cart.save();

    return res.status(200).json({
      message: "Cart cleared",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});
// 🛒 Get all carts (for admin)
export const getAllCarts = asyncHandler(async (req, res) => {
 try {
    //return "Fetching all carts...";
    const carts = await cartModel.find()
      .populate({
        path: "items.menuItemId",
        select: "name name_kh image available"
      })
      .populate({
        path: "tableId", // ✅ populate table
        select: "name capacity"
      })
      .sort({ createdAt: -1 }); // newest first

    return res.json(carts);
  } catch (error) {
    console.error("Error fetching carts:", error);
    return res.status(500).json({ message: error.message });
  }
});

// 🛒 Get cart by ID (for admin)
export const getCartById = asyncHandler(async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await cartModel.findById(cartId)
      .populate({
        path: "items.menuItemId",
        select: "name name_kh image available"
      })
      .populate({
        path: "tableId", // ✅ populate table
        select: "name capacity"
      });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    return res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}); 

export const deleteCart = asyncHandler(async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await cartModel.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    await cart.deleteOne();

    return res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});
