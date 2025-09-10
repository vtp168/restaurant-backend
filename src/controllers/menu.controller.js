import { menuModel } from "../models/menu.model.js";
import asyncHandler from 'express-async-handler';

export const getMenus = asyncHandler(async (req, res) => {
  const menus = await menuModel.find();
  res.json(menus);
});

export const getMenusById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid menu ID" });
  }
  const menu = await menuModel.findById(id);
  if (!menu) {
    return res.status(404).json({ message: "Menu not found" });
  }
  res.json(menu);
});

export const createMenu = asyncHandler(async (req, res) => {
  const menu = await menuModel.create(req.body);
  res.json(menu);
});

export const updateMenu = asyncHandler(async (req, res) => {
  const menu = await menuModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(menu);
});

export const deleteMenu = asyncHandler(async (req, res) => {
  await Menu.findByIdAndDelete(req.params.id);
  res.json({ message: "Menu deleted" });
});
