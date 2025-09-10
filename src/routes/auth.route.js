import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { protect, managerOnly } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", protect, managerOnly, register); // only manager can add users
router.post("/login", login);

export default router;
