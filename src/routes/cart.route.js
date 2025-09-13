import express, { Router } from "express";
import { addCart,getCartByTableId,checkoutCart,getAllCarts,removeItemFromCart,getCartById,deleteCart,clearCart } from "../controllers/cart.controller.js";


const router = express.Router();

// Add item to cart
router.post("/:tableId/add",addCart);

// Get cart by tableId
router.get("/table/:tableId",getCartByTableId);

// get cart by Id
router.get("/:cartId",getCartById);

// Checkout cart to order
router.post("/:tableId/checkout",checkoutCart);

router.get("/",getAllCarts);

router.delete("/:cartId/items/:itemId",removeItemFromCart);

router.delete("/:cartId",deleteCart);

export default router;
