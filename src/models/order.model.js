import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
  size: { type: String, default: null },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  tableId: { type: String, required: true },
  items: [orderItemSchema],
  status: { 
    type: String, 
    enum: ["pending", "preparing", "served", "paid"], 
    default: "pending" 
  },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

export const orderModel = mongoose.model("Order", orderSchema);