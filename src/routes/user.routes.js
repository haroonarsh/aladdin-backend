import { GetUser, LoginUser, LogoutUser, RegisterUser, UpdateUser } from "../controller/user.controller.js";
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post("/signup", RegisterUser);
route.post("/login", LoginUser);
route.post("/logout", LogoutUser);
// route.get("/check", authMiddleware, CheckUser);
route.get("/getUser", authMiddleware, GetUser); // Protect this route with the middleware
route.put("/updateUser", authMiddleware, UpdateUser);

export default route;