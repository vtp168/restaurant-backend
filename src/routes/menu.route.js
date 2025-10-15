import express from "express";
import { getMenus, createMenu, updateMenu, deleteMenu,getMenusById,uploadSingleFile,getMenusByCategory
    ,getAvailableMenus
 } from "../controllers/menu.controller.js";
import { protect, managerOnly } from "../middlewares/auth.js";
import { authenticate } from "../middlewares/index.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Menu management
 *
 * 
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get all menus
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all menus
 *       401:
 *         description: Invalid credentials
 */
router.get("/", authenticate, getMenus);
/**
 * @swagger
 * /api/menu/{id}:
 *   get:
 *     summary: Get menu by ID
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the menu
 *     responses:
 *       200:
 *         description: Menu details
 *       401:
 *         description: Invalid credentials
 */
router.get("/:id", authenticate, getMenusById);

//router.post("/", protect, managerOnly, createMenu);
/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Create a new menu
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Burger
 *               description:
 *                 type: string
 *                 example: Delicious beef burger with cheese
 *               price:
 *                 type: number
 *                 example: 5.99
 *               categoryId:
 *                 type: string
 *                 example: 64a7f0c2e4b0c5a1d2f3g4h5
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Menu created successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/", authenticate, upload,createMenu);
/**
 * @swagger
 * /api/menu/{id}:
 *   put:
 *     summary: Update a menu by ID
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *    parameters:
 *     - in: path
 *   name: id
 *   required: true
 *  schema:
 *   type: string
 *  description: ID of the menu
 *   requestBody:
 *   required: true
 *  content:
 *   application/json:
 *      schema:
 *      type: object    
 *     properties:  
 *      name:
 *       type: string
 *     example: Updated Burger
 *   description:
 *   type: string
 *      example: Updated description
 *      price:
 *      type: number
 *   example: 6.99
 *    categoryId:
 *   type: string
 * example: 64a7f0c2e4b0c5a1d2f3g4h5
 *    responses:
 *     200:
 *   description: Menu updated successfully
 *   401:
 * description: Invalid credentials
 * 
 */
router.put("/:id", authenticate,upload, updateMenu);
/**
 * @swagger
 * /api/menu/{id}:
 *   delete:
 *     summary: Delete a menu by ID
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the menu
 *     responses:
 *       200:
 *         description: Menu deleted successfully
 *       401:
 *         description: Invalid credentials
 */
router.delete("/:id", authenticate, deleteMenu); // delete menuq by id

/**
 * @swagger
 * /api/menu/category/{categoryId}:
 *  get:
 *   summary: Get menus by category ID 
 *  tags: [Menu]
 *  parameters:
 *   - in: path
 *   name: categoryId
 *  required: true
 *  schema:
 *   type: string
 *  description: ID of the category
 * responses:
 *   200:
 *  description: List of menus in the specified category
 *  401:
 *  description: Invalid credentials
 * 
 */
router.get("/category/:categoryId", authenticate, getMenusByCategory);
/**
 * @swagger
 * /api/menu/available/true:
 *   get:
 *     summary: Get all available menus
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: List of all available menus
 *       401:
 *         description: Invalid credentials
 */
router.get("/available/true", authenticate, getAvailableMenus);


router.post("/upload", authenticate, upload,uploadSingleFile);


export default router;
