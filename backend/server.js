import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";

import authRouter from "./router/auth.routes.js";
import userRouter from "./router/user.route.js";
import propertyRouter from "./router/property.route.js";
import inquiryRouters from "./router/inquiry.routes.js";
import wishlistRouter from "./router/wishlist.route.js";
import chatRouter from "./router/chat.route.js";
import contactRouter from "./router/contact.route.js";
import adminRouter from "./router/admin.route.js";
import Chat from "./models/chat.model.js";
import paymentRouter from "./router/payment.route.js";
import newsletterRouter from "./router/newsletter.route.js";

const app = express();
const PORT = 5000;

// Database
connectDB();

// Allowed frontend URLs
const allowedOrigins = [
   "http://localhost:5173",
   "http://localhost:5174",
];
if (process.env.FRONTEND_URL) {
   allowedOrigins.push(process.env.FRONTEND_URL);
}

// Middlewares
app.use(cors({
   origin: function(origin, callback) {
      console.log("CORS Request Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true);
      } else {
         callback(new Error("Not allowed by CORS"));
      }
   },
   credentials: true
}));

app.post("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

// Routes
app.get("/", (req, res) => {
   res.send("Backend API Running");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/property", propertyRouter);
app.use("/api/inquiry", inquiryRouters);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/newsletter", newsletterRouter);

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
   cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true
   }
});

const onlineUsers = new Map(); // userId string -> socket.id string
app.set("socketio", io);
app.set("onlineUsers", onlineUsers);

// Socket connection
io.on("connection", (socket) => {
   console.log("User Connected:", socket.id);

   // Register User
   socket.on("registerUser", async (userId) => {
      if (!userId) return;
      socket.userId = userId.toString();
      onlineUsers.set(userId.toString(), socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
      
      // Mark pending "sent" messages as "delivered" since user just went online
      try {
         const chats = await Chat.find({
            $or: [{ buyer: userId }, { seller: userId }]
         });
         for (let chat of chats) {
            let updated = false;
            chat.message.forEach(msg => {
               if (msg.sender.toString() !== userId.toString() && msg.status === "sent") {
                  msg.status = "delivered";
                  updated = true;
               }
            });
            if (updated) {
               await chat.save();
               // Notify the sender that messages were delivered
               io.to(chat._id.toString()).emit("messagesDelivered", { chatId: chat._id });
            }
         }
      } catch (err) {
         console.error("Error marking messages as delivered on registerUser:", err);
      }
   });

   // Join chat room
   socket.on("joinChat", async ({ chatId, userId }) => {
      if (!chatId || !userId) return;
      socket.join(chatId);
      socket.userId = userId.toString();
      socket.currentChatId = chatId;
      console.log(`User ${userId} joined room ${chatId}`);

      // Mark messages from the other user as "read"
      try {
         const chat = await Chat.findById(chatId);
         if (chat) {
            let updated = false;
            chat.message.forEach(msg => {
               if (msg.sender.toString() !== userId.toString() && msg.status !== "read") {
                  msg.status = "read";
                  updated = true;
               }
            });
            if (updated) {
               await chat.save();
               io.to(chatId).emit("messagesRead", { chatId });
            }
         }
      } catch (err) {
         console.error("Error marking messages as read on joinChat:", err);
      }
   });

   // Leave chat room
   socket.on("leaveChat", ({ chatId }) => {
      if (chatId) {
         socket.leave(chatId);
         socket.currentChatId = null;
         console.log(`User left room ${chatId}`);
      }
   });

   // Send message (via Socket.io event if needed, or to broadcast updates)
   socket.on("sendMessage", (data) => {
      // data: { chatId, newMessage: { ... } }
      io.to(data.chatId).emit("receiveMessage", data);
   });

   // Mark messages as read explicitly
   socket.on("markAsRead", async ({ chatId, userId }) => {
      if (!chatId || !userId) return;
      try {
         const chat = await Chat.findById(chatId);
         if (chat) {
            let updated = false;
            chat.message.forEach(msg => {
               if (msg.sender.toString() !== userId.toString() && msg.status !== "read") {
                  msg.status = "read";
                  updated = true;
               }
            });
            if (updated) {
               await chat.save();
               io.to(chatId).emit("messagesRead", { chatId });
            }
         }
      } catch (err) {
         console.error("Error marking messages as read on markAsRead:", err);
      }
   });

   // Disconnect
   socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
      if (socket.userId) {
         onlineUsers.delete(socket.userId);
      }
   });
});

// Start server
server.listen(PORT, () => {
   console.log(`Server started on http://localhost:${PORT}`);
});