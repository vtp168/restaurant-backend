import express from "express";
import { getTables, createTable, updateTable, getTableById, deleteTable,getTablesByStatus } from "../controllers/table.controller.js";
//import { protect, managerOnly } from "../middlewares/auth.js";

const router = express.Router();
/**
 * 
 * @swagger
 * tags:
 *   name: Table
 *   description: Table management
 * @swagger
 * /api/tables:
 *   get:
 *     summary: Get all tables
 *     tags: [Table]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tables
 *       401:
 *         description: Invalid credentials
 */
router.get("/",getTables);
/**
 * @swagger
 * /api/tables:
 *   post:
 *     summary: Create a new table
 *     tags: [Table]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: T1
 *               capacity:
 *                 type: string
 *                 example: 10
 *               status:
 *                 type: string
 *                 example: free
 *     responses:
 *       201:
 *         description: Table created successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/",createTable);
/**
 * @swagger
 * /api/tables/{id}:
 *   get:
 *     summary: Get table by ID
 *     tags: [Table]
 *      security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the table
 *     responses:
 *       200:
 *         description: Table retrieved successfully
 *       404:
 *         description: Table not found
 *       500:
 *         description: Server error
 */
router.get("/:id",getTableById);
/**
 * @swagger
 * /api/tables/{id}:
 *   put:
 *     summary: Update table by ID
 *     tags: [Table]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *                 example: T1
 *               capacity:
 *                 type: string
 *                 example: "10"
 *               status:
 *                 type: string
 *                 example: free
 *     responses:
 *       200:
 *         description: Table updated successfully
 *       404:
 *         description: Table not found
 *       500:
 *         description: Server error
 */
router.put("/:id",updateTable);
/**
 * @swagger
 * /api/tables/{id}:
 *   delete:
 *    summary: Delete table by ID
 *     tags: [Table]
 *     security:
 *       - bearerAuth: []
 *  parameters:
 *   - in: path
 *  name: id
 *  required: true
 *  schema:
 *   type: string
 *  description: ID of the table
 * responses:
 *  200:
 *   description: Table deleted successfully
 *  404:
 *   description: Table not found
 *  500:
 *   description: Server error
 */
router.delete("/:id",deleteTable);

/**
 * 
 * @swagger
 * tags:
 *   name: Table
 *   description: Table management
 * @swagger
 * /api/tables/status/free:
 *   get:
 *     summary: Get all free tables
 *     tags: [Table]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tables
 *       401:
 *         description: Invalid credentials
 */

router.get("/status/:status",getTablesByStatus);

export default router;
