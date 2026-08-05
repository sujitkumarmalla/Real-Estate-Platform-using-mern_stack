import express from "express";

import {authorize, protect} from "../middlewares/auth.middlewares.js"
import { blockUser, deleteProperty, deleteUser, getAllInquires, getAllProperties, getAllUsers, getDashboardSets, getPendingSeller,approveSeller, getAllChats, deleteChat } from "../controllers/admin.controller.js";

const adminRouter=express.Router();


adminRouter.use(protect,authorize("admin"))



adminRouter.get("/users",getAllUsers);
adminRouter.patch("/users/:id/block",blockUser)



adminRouter.delete("/users/:id",deleteUser)
adminRouter.get("/properties",getAllProperties)


adminRouter.delete("/properties/:id",deleteProperty);
adminRouter.get("/inquires",getAllInquires)
adminRouter.get("/stats",getDashboardSets);


adminRouter.get("/pending-sellers",getPendingSeller);
adminRouter.patch("/approve-seller/:id",approveSeller)

adminRouter.get("/chats", getAllChats);
adminRouter.delete("/chats/:id", deleteChat);



export default adminRouter;