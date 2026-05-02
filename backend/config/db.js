import mongoose from "mongoose";


export const connectDB=async()=>{
    mongoose.connect("mongodb+srv://sujitmalla000_db_user:ps91lirlTpoeKjOi@cluster0.hv8gtcw.mongodb.net/RealState").then(()=>{
        console.log("DB connected")
    })
}