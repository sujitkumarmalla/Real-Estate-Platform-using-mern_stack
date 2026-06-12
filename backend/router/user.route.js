import express from "express";
import {
  getProfile,
  updateProfile,
} from "../controllers/user.controller.js";
import {
  addWishlist,
  getWishlist,
  removeWishlist,
} from "../controllers/wishlist.controller.js";

import { protect } from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/upload.middlewares.js";

const router = express.Router();

// profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("profilePic"), updateProfile);

// add to wishlist
router.post("/:propertyId", protect, addWishlist);

// get wishlist
router.get("/", protect, getWishlist);

// remove from wishlist
router.delete("/:propertyId", protect, removeWishlist);

export default router;