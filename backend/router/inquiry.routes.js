import express from "express"
import { authorize, protect } from "../middlewares/auth.middlewares.js";
import { getMyInquiries, getSellerInquiries, markAsRead, sendInquiry } from "../controllers/inquiry.controller.js";


const inquiryRouters=express.Router();


inquiryRouters.post("/",protect,authorize("buyer", "seller", "admin"),sendInquiry);
inquiryRouters.get("/my",protect,getMyInquiries);
inquiryRouters.get("/seller",protect,authorize("seller"),getSellerInquiries);
inquiryRouters.patch("/:id/read",protect,markAsRead)

export default inquiryRouters;