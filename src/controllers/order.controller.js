import { orderModel } from "../models/order.model.js";
import { invoiceModel} from "../models/invoice.model.js";
import asyncHandler from 'express-async-handler';
import { tableModel } from "../models/table.model.js";
import { categoryModel } from "../models/category.model.js";
import { menuModel } from "../models/menu.model.js";


export const getOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel.find().populate('tableId').
  populate({path:'createdBy',
     select: '_id username fullname'
  }).populate({
    path: "items.menuItemId",
    select: "name name_kh"
  });
  res.status(200).json(orders);
});

export const createOrder = asyncHandler(async (req, res) => {
  const tableId = req.params.tableId;
  const { items } = req.body;
    if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "tableId និង items គឺត្រូវតែមាន" });
  }

  // Get last orderNo
  const lastOrder = await orderModel.findOne().sort({ orderNo: -1 });
  const lastOrderNo = lastOrder ? lastOrder.orderNo : 0;
  
  let order = await orderModel.findOne({ tableId, status: "pending" });
  if(order){
    order.items.push(...items);
    await order.save();
  }
  else{
    order = await orderModel.create({
      orderNo: lastOrderNo + 1,
      tableId,
      items: items,
      createdBy: req.user._id, // from authMiddleware
    });
  }
  tableModel.findById(tableId).then(table => {
    if (table && table.status === "free") {
      table.status = "occupied";
      table.save();
    }
  }).catch(err => {
    console.error("Error updating table status:", err);
  });
  return res.status(201).json(order);

});

export const updateOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(order);
});

export const deleteOrder = asyncHandler(async (req, res) => {
  await orderModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Order deleted" });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.status(200).json(order);
});

export const getOrdersByTableId = asyncHandler(async (req, res) => {
  const tableId = req.params.tableId;
  const orders = await orderModel.find({ tableId,status:"pending" }).populate('tableId').populate({  path:'createdBy',
  select: '_id username fullname'
}).populate({   path: "items.menuItemId",
  select: "name name_kh"
});
  res.status(200).json(orders);
});

export const changeOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "preparing", "served", "paid"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }
  const order = await orderModel.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.status(200).json(order);
});

export const clearOrdersByTableId = asyncHandler(async (req, res) => {
  const tableId = req.params.tableId;
  await orderModel.deleteMany({ tableId });
  res.status(204).end();
});

export const getActiveOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel.find({ isActive: true }).populate('tableId').populate({  path:'createdBy',
  select: '_id username fullname'
}).populate({   path: "items.menuItemId",
  select: "name name_kh"
});
  res.status(200).json(orders);
});

export const toggleOrderActiveStatus = asyncHandler(async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  order.isActive = !order.isActive;
  await order.save();
  res.status(200).json(order);
});

export const getOrdersByStatus = asyncHandler(async (req, res) => {
  const status = req.params.status;
  const validStatuses = ["pending", "preparing", "served", "paid"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }
  const orders = await orderModel.find({ status }).populate('tableId').populate({  path:'createdBy',
  select: '_id username fullname'
}).populate({   path: "items.menuItemId",
  select: "name name_kh"
});
  res.status(200).json(orders);
});

export const deleteOrderByItemId = asyncHandler(async (req, res) => {
  const { orderId, itemId } = req.params;
  const order = await orderModel.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  order.items = order.items.filter(item => item._id.toString() !== itemId);
  await order.save();
  res.status(200).json(order);
});

// Auto increment helper (basic)
async function getNextOrderNo() {
  const lastOrder = await orderModel.findOne().sort({ orderNo: -1 });
  return lastOrder ? lastOrder.orderNo + 1 : 1;
}

async function getNextInvoiceNo() {
  const lastInvoice = await invoiceModel.findOne().sort({ invoiceNo: -1 });
  return lastInvoice ? lastInvoice.invoiceNo + 1 : 1;
}

//checkout order to Invoice
export const checkoutOrder = asyncHandler(async (req, res) => {
  const { paymentMethod } = req.body;
  const orderId = req.params.orderId;
  const validPaymentMethods = ["cash", "bank", "wallet"];
  if (!validPaymentMethods.includes(paymentMethod)) {
    return res.status(400).json({ message: "Invalid payment method" });
  }

  const order = await orderModel.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  if (order.status === "paid") {
    return res.status(400).json({ message: "Order is already paid" });
  }

  const tableId = order.tableId;
  const items = order.items;
  // Update order status to paid
  order.status = "paid";
  await order.save();
  // 1. Update table status to free
  await tableModel.findByIdAndUpdate(tableId, { status: "free" });

  // 2. Calculate totals
  const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subTotal * 0.1; // 10% VAT example
  const discount = 0; // default
  const total = subTotal + tax - discount;

  // 3. Create Invoice
  const invoiceNo = await getNextInvoiceNo();
  const invoice = await invoiceModel.create({
    invoiceNo,
    orderIds: [order._id],
    tableId,
    subTotal,
    tax,
    discount,
    total,
    paymentMethod,
    paidBy: req.user._id, // from authMiddleware
    paidAt: new Date()
  });

  res.json({
    message: "Checkout successful",
    invoice
  });
});


// Get POS Data
export const getPOSData = asyncHandler(async (req, res) => {
  // Get all active tables
  const tables = await tableModel.find({ status: "free" }).select("name status capacity");

  // Get categories + menus
  const categories = await categoryModel.find().lean();
  const menus = await menuModel.find()
    .populate("category", "name name_kh parent")
    .lean();

  // Group menu by category
  const groupedMenus = categories.map((cat) => ({
    categoryId: cat._id,
    categoryName: cat.name,
    categoryNameKh: cat.name_kh,
    menus: menus
      .filter((m) => m.category && m.category._id.toString() === cat._id.toString())
      .map((m) => ({
        id: m._id,
        name: m.name,
        name_kh: m.name_kh,
        price: m.price,
        sizes: m.sizes,
        image: m.image || null,
      })),
  }));

  res.status(200).json({
    tables,
    categories: groupedMenus,
  });
});

export const chageItemQuantity = asyncHandler(async (req, res) => {
  const { orderId, itemId } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than zero" });
  }

  const order = await orderModel.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const item = order.items.id(itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found in order" });
  }

  item.quantity = quantity;
  await order.save();

  res.status(200).json(order);
});

export const addItemByOrderId = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { items } = req.body;
  //console.log("Adding items:", items, "to order:", orderId);

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Items are required" });
  }

  const order = await orderModel.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.items.push(...items);
  await order.save();

  res.status(200).json(order);
});

// Additional methods can be added as needed  


