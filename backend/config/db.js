import mongoose from "mongoose";


export const connectDB=async()=>{
    try {
        await mongoose.connect("mongodb+srv://sujitmalla000_db_user:ps91lirlTpoeKjOi@cluster0.hv8gtcw.mongodb.net/RealState");
        console.log("DB connected successfully");
    } catch (error) {
        console.error("DB connection error:", error.message);
    }
}