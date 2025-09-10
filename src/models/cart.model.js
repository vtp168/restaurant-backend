import mongoose from "mongoose";
const cartItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  size: { type: String, default: null }, // optional
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true } // snapshot of price at time of add
});

const cartSchema = new mongoose.Schema({
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true  }, // identify table/QR
  items: [cartItemSchema],
  status: { type: String, enum: ["active", "checkedout"], default: "active" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const cartModel = mongoose.model("Cart", cartSchema);