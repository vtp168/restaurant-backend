import express from "express";
import { getOrders, createOrder, updateOrder } from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, getOrders);
router.post("/", protect, createOrder);
router.put("/:id", protect, updateOrder);

export default router;
