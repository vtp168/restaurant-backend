import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
  label: { type: String, enum: ["Small","Medium","Large"], required: true, default: "Medium" },
  price: { type: Number, required: true }
});

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  name_kh: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["food", "drink", "other"], 
    required: true 
  },
  subcategory: {
    type: String,
    enum: [
      "stew", "roast", "food-other","fast-food", // for food
      "beer", "non-alcohol", "wine", // for drink
      null
    ],
    default: null
  },
  description: String,
   // ✅ fallback price if no sizes
  price: { type: Number, default: null },
  // ✅ sizes (optional)
  sizes: { type: [sizeSchema], default: [] },
  image: String,
  available: { type: Boolean, default: true }
});

// ✅ Custom validation
menuSchema.pre("validate", function (next) {
  if ((!this.price && this.sizes.length === 0) || (this.price && this.sizes.length > 0)) {
    return next(
      new Error("MenuItem must have either a price OR sizes, but not both.")
    );
  }
  next();
});

export const menuModel= mongoose.model("Menu", menuSchema);
