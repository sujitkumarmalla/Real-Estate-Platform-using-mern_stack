import express from "express";
import { forgotPassword, getMe, login, register, resetPassword, verifyEmail, verifyLoginOtp } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/upload.middlewares.js";

const authRouter=express.Router();

authRouter.post("/register",upload.single("profilePic"),register);
authRouter.post("/login",login)
authRouter.post("/verify-login-otp",verifyLoginOtp)


authRouter.get("/me",protect,getMe);
authRouter.post("/verify-email",verifyEmail)


authRouter.post("/forgot-password",forgotPassword);
authRouter.post("/reset-password/:token",resetPassword);


export default authRouter;