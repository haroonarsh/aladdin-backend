import express from "express";
import { AddToCart } from "../controller/cart.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post("/add", authMiddleware, AddToCart);

export default route;