import express from 'express';
import { createUser, deleteUserById, getAllUser, getUserById, updateUserById } from '../controllers/user.controller.js';
import { handleValidation } from '../middlewares/index.js';
import { createUserValidator } from '../validators/user.validator.js';
const userRoute = express.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 * /
 * 
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Invalid credentials
 * 
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Invalid credentials
 * 
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Invalid credentials
 * 
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 *               role:
 *                 type: string
 *                 example: staff
 *     responses:
 *       201:
 *         description: User created successfully
 *       401:
 *         description: Invalid credentials
 */
userRoute.get('/', getAllUser)
userRoute.get('/:id', getUserById)
userRoute.delete('/:id', deleteUserById)
userRoute.post('/',createUserValidator,handleValidation,createUser)
/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Updates user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                type: string
 *                example: Bun Rithy
 *               username:
 *                 type: string
 *                 example: bun
 *               password:
 *                 type: string
 *                 example: 12345678
 *               role:
 *                 type: string
 *                 example: waiter
 *     responses:
 *       201:
 *         description: User update successfully
 *       401:
 *         description: Invalid credentials
 */
userRoute.patch('/:id', updateUserById)

export default userRoute;