import express from "express";
import { getOrders, createOrder, updateOrder,deleteOrderByItemId,getOrderById,checkoutOrder } from "../controllers/order.controller.js";
//import { protect } from "../middlewares/auth.js";
import { authenticate } from "../middlewares/index.js";

const router = express.Router();

/**
 * 
 * @swagger
 * tags:
 *   name: Order
 *   description: Order management
 *
 * 
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Invalid credentials
 */
router.get("/", authenticate, getOrders);

/**
 * @swagger
 * /api/orders/{tableId}:
 *   post:
 *     summary: Create a new order for a specific table
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
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
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menuId:
 *                       type: string
 *                       example: 64a7f0c2e4b0c5d6f8e4a1b2
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               status:
 *                 type: string
 *                 example: pending
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/:tableId", authenticate, createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   patch:
 *     summary: Update an order by ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menuId:
 *                       type: string
 *                       example: 64a7f0c2e4b0c5d6f8e4a1b2
 *                     quantity:
 *                       type: integer
 *                       example: 3
 *               status:
 *                 type: string
 *                 example: completed
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", authenticate, updateOrder);
/**
 * @swagger
 * /api/orders/{orderId}/item/{itemId}:
 *   patch:
 *     summary: Delete an item from an order by item ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to be deleted from the order
 *     responses:
 *       200:
 *         description: Item deleted from order successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Order or item not found
 *       500:
 *         description: Server error
 */
router.patch("/:orderId/item/:itemId", authenticate, deleteOrderByItemId);
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Order details
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Order not found
 */
router.get("/:id", authenticate, getOrderById);

router.post("/:orderId/checkout", authenticate, checkoutOrder);


export default router;
