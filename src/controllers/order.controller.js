import { orderModel } from "../models/order.model.js";
import asyncHandler from 'express-async-handler';

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
  return res.status(201).json(order);

});

export const updateOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(order);
});

export const deleteOrder = asyncHandler(async (req, res) => {
  await orderModel.findByIdAndDelete(req.params.id);
  res.status(204).end();
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
  const orders = await orderModel.find({ tableId }).populate('tableId').populate({  path:'createdBy',
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


