import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalname:{
    type: String,
    required: true
  },
  path:{
    type: String,
    required: true
  },
  mimetype:{
    type: String,
    required: true
  },
  encoding: {
    type: String,
    required: true
  },
  // Dynamic reference (Option 1: File → Related)
  relatedType: {
    type: String,
    enum: ["Menu", "User", "Banner", "Other"],
    default: "Other"
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "relatedType",
    default: null
  },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, 
{ timestamps: true });

fileSchema.plugin(mongoosePaginate)

export const fileModel = mongoose.model("File", fileSchema);
