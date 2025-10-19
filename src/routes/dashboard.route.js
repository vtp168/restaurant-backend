import express from 'express'
import { getDashboardSummary } from '../controllers/dashboard.controller.js'
import { authenticate } from "../middlewares/index.js";
const router = express.Router()

// Protect this route with authentication
router.get('/', authenticate, getDashboardSummary)

export default router
