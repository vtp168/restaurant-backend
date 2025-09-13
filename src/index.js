import 'dotenv/config';
// import express from 'express';
 import bodyParser from 'body-parser';
 import { dbConnect } from './database/db.js';
 import { authenticate } from './middlewares/index.js';
// import { authenticate, CacheInterceptor, cacheMiddleware, handleError, invalidateCache, limiter } from './middlewares/index.js';
 import morgan from 'morgan'; //see all reguests in console
// import redisClient from './redis/index.js';


import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import menuRoutes from "./routes/menu.route.js";
import orderRoutes from "./routes/order.route.js";
import tableRoutes from "./routes/table.route.js";
import userRoutes from "./routes/user.route.js";
import cartRoutes from "./routes/cart.route.js";
import categoryRoutes from "./routes/category.route.js";




// await redisClient.connect().catch((err) => {
//     console.log(err)
// })

const app = express();
app.use(cors())
// POST & PATCH & PUT
app.use(bodyParser.json())
app.use(morgan('combined'))
//app.use(dotenv.config())



await dbConnect().catch((err) => {
    console.log(err)
})

app.get("/", (req, res) => res.send("Restaurant API is running..."));

app.use("/api/auth", authRoutes);
app.use("/api/menu",authenticate, menuRoutes);
app.use("/api/orders",authenticate, orderRoutes);
app.use("/api/tables",authenticate,tableRoutes);
app.use("/api/users",authenticate, userRoutes);
app.use("/api/carts",authenticate, cartRoutes);
app.use("/api/categories",authenticate, categoryRoutes);

//const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log(`🚀 Server running on port 3000`));



// app.get('/', (req, res) => {
//     return res.status(200).json({ 'status': "Server is running" })
// })

// app.use('/api/users',
//     limiter(60 * 1000, 30), // 1 minute, 30 requests
//     //authenticate,
//     cacheMiddleware,
//     CacheInterceptor(60 * 10),
//     invalidateCache,
//     userRoute);
// app.use('/api/teachers',
//     limiter(60 * 1000, 60), // 1 minute, 60ß requests
//     authenticate,
//     cacheMiddleware,
//     CacheInterceptor(60 * 10),
//     invalidateCache,
//     teacherRoute);
// app.use('/api/stocks',
//     limiter(60 * 1000, 30), // 1 minute, 30 requests
//     authenticate,
//     cacheMiddleware,
//     CacheInterceptor(60 * 10),
//     invalidateCache,
//     stockRoute);
// app.use('/api/courses',
//     limiter(60 * 1000, 30), // 1 minute, 30 requests
//     //authenticate,
//     cacheMiddleware,
//     CacheInterceptor(60 * 10),
//     invalidateCache,
//     courseRoute);

// app.use('/api/files', fileRoute);

// // Auth
// app.use('/api/auth',
//     limiter(60 * 60 * 1000, 3), // 1 hour, 3 requests
//     authRoute);

// app.use(handleError)

// app.listen(3000, () => {
//     console.log('Server runing on port 3000');
// })