import express, { Router } from "express";
import { getCategories, createCategory, getCategoryById, deleteCategory, updateCategory } from "../controllers/category.controller.js";

const router = express.Router();


// Get all categories
/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management
 *
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all categories
 *       401:
 *         description: Invalid credentials
 */ 
router.get("/", getCategories);

// Create a new category
/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
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
 *                 example: Beverages
 *               name_kh:
 *                 type: string
 *                 example: ភេសជ្ជៈ
 *               description:
 *                 type: string
 *                 example: Drinks and refreshments
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/", createCategory);

// Get a category by ID
/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Category details
 *       401:
 *         description: Invalid credentials
 */
router.get("/:id", getCategoryById);

// Update a category by ID
/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category by ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Category Name
 *               name_kh:
 *                 type: string
 *                 example: ភេសជ្ជៈ
 *               description:
 *                 type: string
 *                 example: Updated description of the category
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       401:
 *         description: Invalid credentials
 */
router.put("/:id", updateCategory);

// Delete a category by ID
/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Invalid credentials
 */
router.delete("/:id", deleteCategory);

export default router;