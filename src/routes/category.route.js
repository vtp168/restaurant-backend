import express, { Router } from "express";
import { getCategories, createCategory, getCategoryById, deleteCategory, updateCategory } from "../controllers/category.controller.js";

const router = express.Router();

// Get all categories
router.get("/", getCategories);

// Create a new category
router.post("/", createCategory);

// Get a category by ID
router.get("/:id", getCategoryById);

// Update a category by ID
router.put("/:id", updateCategory);

// Delete a category by ID
router.delete("/:id", deleteCategory);

export default router;