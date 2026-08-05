import User from "../models/user_model.js";
import Property from "../models/property.model.js";
import Inquiry from "../models/inquiry.model.js";
import cloudinary from "../config/cloudinary.js";
import Chat from "../models/chat.model.js";

export const getAllUsers=async(req,res)=>{
    try {
        const users=await User.find().select("-password");
        res.json({
            success:true,
            count:users.length,
            users
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//Block users
export const blockUser=async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(403).json({ success: false, message: "Administrators cannot be blocked" });
        }
        user.isBlocked=!user.isBlocked;
        await user.save();
        res.json({
            success:true,
            message:user.isBlocked?"User Blocked":"User unblocked",
            isBlocked:user.isBlocked
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


//to delete a perticular user
export const deleteUser=async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(403).json({ success: false, message: "Administrators cannot be deleted" });
        }
        await User.findByIdAndDelete(req.params.id)
        res.json({
            success:true,
            message:"User deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


//view all properties
export const getAllProperties=async(req,res)=>{
    try {
        const properties=await Property.find().populate("seller","name email")

        res.status(200).json({
            success:true,
            count:properties.length,
            properties
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//to delete a perticular properties

export const deleteProperty=async(req,res)=>{
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        // Delete images from Cloudinary
        for (let imageUrl of property.images) {
            try {
                const publicId = imageUrl.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy("properties/" + publicId);
            } catch (err) {
                console.error("Cloudinary delete error:", err);
            }
        }

        await property.deleteOne();
        res.json({
            success:true,
            message:"Property deleted succesfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


// to view all inquires
export const getAllInquires=async(req,res)=>{
    try {
        const inquiries=await Inquiry.find()
        .populate("buyer","name email")
        .populate("seller","name email")
        .populate("property","title price")
        .sort({createdAt:-1})
        res.json({
            count:inquiries.length,
            inquiries
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


//to get dashboard analtycs

export const getDashboardSets=async(req,res)=>{
    try {
        const totalUser=await User.countDocuments();
        const totalProperties=await Property.countDocuments();

        const totalInquiries = await Inquiry.countDocuments();
        const activeListing = await Property.countDocuments({ status: "sale" });
        const soldProperties = await Property.countDocuments({ status: "sold" });
        const pendingSellers = await User.countDocuments({ role: "seller", isApproved: false });
        res.json({
            success:true,
            stats:{
                totalUsers: totalUser,
                totalProperties,
                totalInquiries,
                activeListing,
                soldProperties,
                pendingSellers
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//togetpending seller
export const getPendingSeller=async(req,res)=>{
    try {
        const pendingSeller=await User.find({
            role:"seller",
            isApproved:false
        }).select("-password")


        res.json({
            success:true,
            count:pendingSeller.length,
            pendingSeller
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
    //now to approve a perticular seller


    export const approveSeller = async (req, res) => {
    try {

        const seller = await User.findById(req.params.id);

        if (!seller || seller.role !== "seller") {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        seller.isApproved = true;

        await seller.save();

        res.json({
            success: true,
            message: "Seller approved successfully",
            seller
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get all chats for admin monitoring
export const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find()
            .populate("buyer", "name email profilePic")
            .populate("seller", "name email profilePic")
            .populate("property", "title price images")
            .sort({ updatedAt: -1 });

        res.json({
            success: true,
            count: chats.length,
            chats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a chat conversation
export const deleteChat = async (req, res) => {
    try {
        const chat = await Chat.findByIdAndDelete(req.params.id);
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }
        res.json({
            success: true,
            message: "Chat conversation deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
