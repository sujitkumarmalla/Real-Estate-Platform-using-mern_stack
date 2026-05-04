import Wishlist from "../models/whishlist.model.js";
import mongoose from "mongoose";


// ✅ ADD TO WISHLIST
export const addWishlist = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const existing = await Wishlist.findOne({
      user: req.user._id,
      property: propertyId,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Already in wishlist",
      });
    }

    await Wishlist.create({
      user: req.user._id,
      property: propertyId,
    });

    return res.status(201).json({
      success: true,
      message: "Added to wishlist",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ GET WISHLIST
export const getWishlist = async (req, res) => {
  try {
    const data = await Wishlist.find({
      user: req.user._id,
    }).populate("property");

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ REMOVE FROM WISHLIST
export const removeWishlist = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const deleted = await Wishlist.findOneAndDelete({
      user: req.user._id,
      property: propertyId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Removed from wishlist",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};