import express from "express";
import { getMenus, createMenu, updateMenu, deleteMenu,getMenusById,uploadSingleFile } from "../controllers/menu.controller.js";
import { protect, managerOnly } from "../middlewares/auth.js";
import { authenticate } from "../middlewares/index.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/", authenticate, getMenus);
router.get("/:id", authenticate, getMenusById);

//router.post("/", protect, managerOnly, createMenu);
router.post("/", authenticate, upload,createMenu);
router.put("/:id", authenticate, updateMenu);
router.delete("/:id", authenticate, deleteMenu);

router.post("/upload", authenticate, upload,uploadSingleFile);

export default router;
