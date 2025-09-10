import express from "express";
import { getMenus, createMenu, updateMenu, deleteMenu,getMenusById } from "../controllers/menu.controller.js";
import { protect, managerOnly } from "../middlewares/auth.js";
import { authenticate } from "../middlewares/index.js";

const router = express.Router();

router.get("/", authenticate, getMenus);
router.get("/:id", authenticate, getMenusById);

//router.post("/", protect, managerOnly, createMenu);
router.post("/",authenticate,createMenu);
router.put("/:id", authenticate, updateMenu);
router.delete("/:id", authenticate, deleteMenu);

export default router;
