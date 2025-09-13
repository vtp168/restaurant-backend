import asyncHandler from 'express-async-handler'
import {categoryModel} from "../models/category.model.js";

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryModel.find();
  res.json(categories);
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryModel.create(req.body);
  res.json(category);
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryModel.findById(req.params.id);
  res.json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(category);
});

