import express, { Router } from "express";
import { addCart,getCartByTableId,checkoutCart,getAllCarts,removeItemFromCart,getCartById,deleteCart,clearCart } from "../controllers/cart.controller.js";


const router = express.Router();

/**
 * 
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management and checkout
 *
 * 
 * @swagger
 * /api/carts/{tableId}/add:
 *   post:
 *     summary: Add item to cart for a specific table
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the table
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *                 example: 64a7f0c2e4b0c5a1d2f3g4h5
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 * 
 * /api/carts/table/{tableId}:
 *   get:
 *     summary: Get cart by table ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the table
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */

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
