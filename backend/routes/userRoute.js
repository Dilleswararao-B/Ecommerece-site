import express from "express";
import { loginUser, registerUser, refreshToken, adminLogin } from "../controllers/userController.js";

const userRouter = express.Router();


userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.post("/refresh", refreshToken);
userRouter.post("/adminLogin", adminLogin);

export default userRouter;