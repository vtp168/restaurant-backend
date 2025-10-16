import mongoose from "mongoose";
import bcrypt from "bcrypt";
import mongoosePaginate from 'mongoose-paginate-v2';


const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["manager", "waiter", "chef","admin"], default: "waiter" },
  isActive: { type: Boolean, default: true }
},
 { timestamps: true });

// // hash password before save
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.plugin(mongoosePaginate);

export const userModel = mongoose.model("User", userSchema);

