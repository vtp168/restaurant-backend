import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  invoiceNo: { type: Number, required: true, unique: true },
  orderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // Link orders
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
  subTotal: Number,
  tax: Number,
  discount: Number,
  total: Number,
  paymentMethod: { type: String, enum: ["cash","bank","wallet"] },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  paidAt: { type: Date, default: Date.now }
});
export const invoiceModel = mongoose.model("Invoice", invoiceSchema);