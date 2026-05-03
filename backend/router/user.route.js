import express from "express";
import { getProfile, getPublicprofile, updateProfile } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/upload.middlewares.js";

const userRouter=express.Router();

userRouter.get("/profile",protect,getProfile)
userRouter.put("/profile",protect,upload.single("profilePic"),updateProfile);
userRouter.get("/public/:id",getPublicprofile);


export default userRouter;