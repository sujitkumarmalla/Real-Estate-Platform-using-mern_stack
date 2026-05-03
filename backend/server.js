import express from "express"
import cors from "cors"
import "dotenv/config";
import http from "http"
import { connectDB } from "./config/db.js";
import authRouter from "./router/auth.routes.js";
import userRouter from "./router/user.route.js";

const app=express();
const PORT=5000;


//DB
connectDB()
//middlewares
app.use(cors())
app.use(express.json())

//Routes
app.get("/",(req,res)=>{
    res.send("API WORKING")
})

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
const server=http.createServer(app);

server.listen(PORT,(req,res)=>{
    console.log(`server started on port http://localhost:${PORT}`)
})