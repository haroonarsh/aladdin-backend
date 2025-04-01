import { LoginUser, LogoutUser, RegisterUser } from "../controller/user.controller.js";
import express from "express";

const route = express.Router();

route.post("/signup", RegisterUser);
route.get("/login", LoginUser);
route.post("/logout", LogoutUser);

export default route;