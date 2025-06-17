import express from "express";
import { AddToCart, DeleteCart, GetCart } from "../controller/cart.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post("/add", authMiddleware, AddToCart);
route.get("/get", authMiddleware, GetCart);
route.delete("/remove/:id", authMiddleware, DeleteCart);

export default route;