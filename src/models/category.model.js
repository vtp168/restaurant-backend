import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  name_kh: { type: String, required: true, trim: true },
    // ✅ self-referencing for subcategories
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null }
  // parent = null → main category
  // parent = categoryId → subcategory
}, { timestamps: true });

export const categoryModel= mongoose.model("Category", categorySchema);


