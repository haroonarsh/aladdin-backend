import { GetUser, LoginUser, LogoutUser, RegisterUser, UpdateImage, UpdateUser } from "../controller/user.controller.js";
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const route = express.Router();

route.post("/signup", RegisterUser);
route.post("/login", LoginUser);
route.post("/logout", LogoutUser);
// route.get("/check", authMiddleware, CheckUser);
route.get("/getUser", authMiddleware, GetUser); // Protect this route with the middleware
route.put("/updateUser", authMiddleware, UpdateUser);
route.put("/updateImage", authMiddleware, upload.single("ProfileImage"), UpdateImage); // Protect this route with the middleware

export default route;