import express from "express";
import { getInvoices, getInvoiceById, printInvoice} from "../controllers/invoice.controller.js";
//import { protect } from "../middlewares/auth.js";
import { authenticate } from "../middlewares/index.js";

const router = express.Router();

router.get("/", authenticate, getInvoices);

router.get("/:id", authenticate, getInvoiceById);
router.get("/print/:invoiceId", authenticate, printInvoice);

export default router;