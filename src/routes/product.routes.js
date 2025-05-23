import express from "express";
import { GetProducts, AddProduct, UpdateProduct, DeleteProduct } from "../controller/product.controller.js";

const route = express.Router();

route.get("/", GetProducts);
route.post("/", AddProduct);

route.put("/:id", UpdateProduct);
route.delete("/:id", DeleteProduct);

export default route;