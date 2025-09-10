import express from "express";
import { getTables, createTable, updateTable, getTableById, deleteTable } from "../controllers/table.controller.js";
//import { protect, managerOnly } from "../middlewares/auth.js";

const router = express.Router();

router.get("/",getTables);
router.post("/",createTable);
router.get("/:id",getTableById);
router.delete("/:id",deleteTable);
router.put("/:id",updateTable);

export default router;
