import express from "express";
import {
  addWishlist,
  getWishlist,
  removeWishlist,
} from "../controllers/wishlist.controller.js";

import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// add to wishlist
router.post("/:propertyId", protect, addWishlist);

// get wishlist
router.get("/", protect, getWishlist);

// remove from wishlist
router.delete("/:propertyId", protect, removeWishlist);

export default router;