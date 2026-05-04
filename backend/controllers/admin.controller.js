import User from "../models/user_model.js";
import Property from "../models/property.model.js";
import Inquiry from "../models/inquiry.model.js";

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
            messsage:error.message
        })
    }
}

//Block users
export const blockUser=async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        user.isBlocked=!user.isBlocked;
        res.json({
            success:true,
            message:user.isBlocked?"User Blocked":"User unblocked";
            isBlocked:user.isBlocked
        })
    } catch (error) {
        res.status(500).json({
            messsage:error.message
        })
    }
}


//to delete a perticular user
export const deleteUser=async(req,res)=>{
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({
            success:true,
            message:"User deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            messsage:error.message
        })
    }
}


//view all properties
export const getAllProperties=async(req,res)=>{
    try {
        const properties=await Property.find().populatr("seller","name email")

        res.status(200).json({
            success:true,
            count:properties.length,
            properties
        })
    } catch (error) {
        res.status(500).json({
            messsage:error.message
        })
    }
}

//to delete a perticular properties

export const deleteProperty=async(req,res)=>{
    try {
        await Property.findByIdAndDelete(req.params.id);
        res.json({
            success:true,
            message:"Property deleted succesfully"
        })
    } catch (error) {
        
    }
}