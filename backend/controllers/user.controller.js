import User from "../models/user_model.js";
import { uploadToCloudinary } from "../utils/uploadoCloudnary.js";


//get profile
export const getProfile=async(req,res)=>{
    try {

        const user=await User.findById(req.user._id).select("-password");
        res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
};


//to get public profile

export const getPublicprofile=async(req,res)=>{
    try {
       const user=await User.findById(req.params.id).select("name profilePic role createdAt") ;
       if(!user){
         res.status(404).json({
            success:false,
            message:"user not found"
        })
       }
       res.status(200).json({
        success:true,
        user
       })
    } catch (error) {
       res.status(500).json({
            success:false,
            message:error.message
        })  
    }
}

//update a profile

export const updateProfile=async(req,res)=>{
    try {
        const {name,phone,address,removeProfilePic}=req.body;
        const user=await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
        //image handeling
        if(req.file){
            const result=await uploadToCloudinary(req.file.buffer,"profiles");
            user.profilePic=result.secure_url;

        }else if(removeProfilePic==="true"){
            user.profilePic=null;
        }
        if(name !==undefined) user.name=name;
        if(phone!==undefined) user.phone=phone;
        if(address!==undefined) user.address=address;

        const updatedUser=await user.save();
        res.json({
            success:true,
            user,
            message:"Profile photo updated "
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        }) 
    }
}