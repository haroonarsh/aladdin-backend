import express from "express";
import { GetProducts, AddProduct, UpdateProduct, DeleteProduct, GetProduct, GetProductsById } from "../controller/product.controller.js";
import upload from "../middlewares/upload.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import admin from "../middlewares/admin.middleware.js";

const route = express.Router();

route.get("/", GetProducts);
route.get("/products", authMiddleware, admin, GetProductsById);
route.post("/", authMiddleware, admin, upload.single("ProductImage"), AddProduct);

route.get("/:id", GetProduct);
route.put("/:id", authMiddleware, admin, upload.single("ProductImage"), UpdateProduct);
route.delete("/:id", authMiddleware, admin, DeleteProduct);

export default route;