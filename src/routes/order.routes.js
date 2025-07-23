import express from "express";
import { createOrder, updateOrderStatus } from "../controller/order.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post("/create", authMiddleware, createOrder);
route.put("/update-status", authMiddleware, updateOrderStatus);

export default route;