import express from "express"
import { authorize, protect } from "../middlewares/auth.middlewares.js";
import { getSellerInquiries, markAsRead, sendInquiry } from "../controllers/inquiry.controller.js";


const inquiryRouters=express.Router();


inquiryRouters.post("/",protect,authorize("buyer"),sendInquiry);
inquiryRouters.get("/seller",protect,authorize("seller"),getSellerInquiries);
inquiryRouters.patch("/:id/read",protect,markAsRead)

export default inquiryRouters;