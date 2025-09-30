import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  size: { type: String, default: null },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  orderNo: { type: Number, required: true, unique: true }, // auto increment
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
  items: [orderItemSchema],
  status: { 
    type: String, 
    enum: ["pending", "preparing", "served", "paid"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true }
});

export const orderModel = mongoose.model("Order", orderSchema);