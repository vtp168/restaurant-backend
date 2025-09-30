import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { protect, managerOnly } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", protect, managerOnly, register); // only manager can add users
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: bun
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

export default router;
