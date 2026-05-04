import express from "express";
import { addproperty, deleteProperty, getAllProperties, getMyProperty, getPropertiesDetails, getPropertyCounts, getSellerDashboard, updateProperty, updatePropertyStatus } from "../controllers/property.controller.js";
import {protect,authorize} from "../middlewares/auth.middlewares.js"
import upload from "../middlewares/upload.middlewares.js";
const propertyRouter=express.Router();

propertyRouter.get("/",getAllProperties)

//protect thr routes only seller can do these work

propertyRouter.post("/",protect,authorize("seller"),upload.array("images",10),addproperty);
propertyRouter.get("/my",protect,authorize("seller"),getMyProperty);
propertyRouter.put("/:id",protect,authorize("seller"),upload.array("images",10),updateProperty);




propertyRouter.delete("/:id",protect,authorize("seller"),deleteProperty);
propertyRouter.patch("/:id/status",protect,authorize("seller"),updatePropertyStatus);


propertyRouter.get("/counts",getPropertyCounts);
propertyRouter.get("/:id",getPropertiesDetails);

propertyRouter.get("/seller/dashboard",protect,authorize("seller"),getSellerDashboard)


export default propertyRouter;