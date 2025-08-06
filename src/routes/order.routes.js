import express from "express";
import { createOrder, fetchAdminOrders, fetchAllOrders, fetchOrderedProducts, updateOrderStatus } from "../controller/order.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post("/create", authMiddleware, createOrder);
route.put("/update-status", authMiddleware, updateOrderStatus);
route.get("/fetch-all", authMiddleware, fetchAllOrders);
route.get("/fetch-ordered-products", authMiddleware, fetchOrderedProducts);
route.get("/fetch-admin-orders", authMiddleware, fetchAdminOrders);

export default route;