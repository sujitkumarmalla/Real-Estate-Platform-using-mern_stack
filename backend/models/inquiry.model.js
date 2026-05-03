import mongoose from "mongoose";
import property from "./property.model";


const inquirySchema=new mongoose.Schema({
    property:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Property",
        required:true
    },
    buyer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
     buyer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    message:{
      type:String,
      required:true  
    },
    isRead:{
        type:Boolean,
        default:false
    }
},{timestamps:true});


const Inquiry=mongoose.model("Inquiry",inquirySchema);

export default Inquiry;