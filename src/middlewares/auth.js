import jwt from "jsonwebtoken";
import {userModel} from "../models/user.model.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const managerOnly = (req, res, next) => {
  if (req.user?.role !== "manager") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
