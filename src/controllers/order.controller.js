import { orderModel } from "../models/order.model.js";
import asyncHandler from 'express-async-handler';

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel.find().populate("table items.menuId createdBy");
  res.json(orders);
});

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(order);
});

export const updateOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(order);
});
