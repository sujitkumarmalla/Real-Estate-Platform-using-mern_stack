import express from "express";
import Chat from "../models/chat.model.js"
import User from "../models/user_model.js";
import {protect} from "../middlewares/auth.middlewares.js"


const chatRouter=express.Router();

chatRouter.use(protect);

chatRouter.post("/start",async(req,res)=>{
    try {
        const {propertyId,sellerId,buyerId:providedBuyerId}=req.body;
        let buyerId,finalSellerId;
        if(req.user.role==="seller"){
            buyerId=providedBuyerId;
            finalSellerId=req.user._id;
        }else{
            buyerId=req.user._id;
            finalSellerId=sellerId;
        }

        if (!buyerId || !finalSellerId) {
            return res.status(400).json({
                message: "Missing buyer or seller Id"
            })
        }

        // Check if seller is trying to chat with themselves
        if (buyerId.toString() === finalSellerId.toString()) {
            return res.status(400).json({
                message: "You cannot start a chat with yourself"
            });
        }

        //check exsting chat
        let chat = await Chat.findOne({
            property: propertyId,
            buyer: buyerId,
            seller: finalSellerId
        })
        if (!chat) {
            chat = await Chat.create({
                property: propertyId,
                buyer: buyerId,
                seller: finalSellerId,
                message: []
            })
        }
        chat = await Chat.findById(chat._id)
            .populate("buyer", "name email profilePic")
            .populate("seller", "name email profilePic")
            .populate("property", "title price images");
        res.json(chat)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})


//to send message
chatRouter.post("/send",async(req,res)=>{
    try {
        const {chatId,text,image}=req.body;
        const userId=req.user.id;

        const chat=await Chat.findById(chatId);
        if(!chat) return res.status(404).json({
            message:"Chat not found"
        });
        if(chat.buyer.toString()!==userId && chat.seller.toString()!==userId){
            return res.status(403).json({
                message:"Not authorized to send message in this chat"
            })
        }

        if (req.user.role === "seller") {
            const senderUser = await User.findById(userId);
            if (!senderUser) {
                return res.status(404).json({ message: "Sender profile not found" });
            }
            if (senderUser.credits === undefined || senderUser.credits === null) {
                senderUser.credits = 100;
            }
            if (senderUser.credits <= 0) {
                return res.status(403).json({
                    success: false,
                    message: "Insufficient credits. Please upgrade your account to send messages."
                });
            }
            senderUser.credits -= 1;
            await senderUser.save();
        }

        const io = req.app.get("socketio");
        const onlineUsers = req.app.get("onlineUsers") || new Map();
        const recipientId = chat.buyer.toString() === userId ? chat.seller.toString() : chat.buyer.toString();

        let status = "sent";
        if (io) {
            const roomSockets = io.sockets.adapter.rooms.get(chatId);
            const isRecipientInRoom = roomSockets && Array.from(roomSockets).some(sId => {
                const s = io.sockets.sockets.get(sId);
                return s && s.userId === recipientId;
            });

            if (isRecipientInRoom) {
                status = "read";
            } else if (onlineUsers.has(recipientId)) {
                status = "delivered";
            }
        }

        const newMessage={
            sender:userId,
            text,
            image,
            status,
            createdAt:new Date()
        };
        chat.message.push(newMessage)
        await chat.save();

        const saveMessage=chat.message[chat.message.length-1];
        res.json({chat,newMessage:saveMessage})
    } catch (error) {
          res.status(500).json({
        error:error.message,
        message:"Error sending message"
      })  
    }
});


chatRouter.get("/user", async (req, res) => {
    try {
        const userId = req.user.id;
        const chats = await Chat.find({
            $or: [{ buyer: userId }, { seller: userId }]
        })
            .populate("buyer", "name email profilePic")
            .populate("seller", "name email profilePic")
            .populate("property", "title price images")
            .sort({ updatedAt: -1 });
            
        res.json(chats);
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Error fetching chats"
        })
    }
});

//to get chat message
chatRouter.get("/:chatId", async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId)
            .populate("buyer", "name email profilePic")
            .populate("seller", "name email profilePic")
            .populate("property", "title price images")
            .populate("message.sender", "name profilePic");

        if (!chat) return res.status(404).json({ message: "Chat not found" })

        const userId = req.user.id.toString();
        if (chat.buyer._id.toString() !== userId && chat.seller._id.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized"
            })
        }

        // Identify the chat partner
        const partner = chat.buyer._id.toString() === userId ? chat.seller : chat.buyer;

        res.json({
            ...chat._doc,
            partner
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Error fetching chat message"
        })
    }
})


//to delte entire chat

chatRouter.delete("/:chatId",async(req,res)=>{
    try {
        const userId=req.user._id;
        const chat=await Chat.findById(req.params.chatId);

        if(chat.buyer.toString() !== userId.toString() && chat.seller.toString() !== userId.toString() ){
            return res.status(403).json({
                message:"not authorized"
            })
        }
        await Chat.findByIdAndDelete(req.params.chatId)
        res.json({
            message:"Chat deleted succesfully"
        })
    } catch (error) {
         res.status(500).json({
        error:error.message,
        message:"Error fetching chat message"
      })  
    }
})

//to delete a specific message
chatRouter.delete("/:chatId/message/:messageId",async(req,res)=>{
    try {
         const userId=req.user._id;
        const chat=await Chat.findById(req.params.chatId);

        if(chat.buyer.toString() !== userId.toString() && chat.seller.toString() !== userId.toString() ){
            return res.status(403).json({
                message:"not authorized"
            })
        }
        const message=chat.message.id(req.params.messageId);
        if(!message) return res.status(404).json({
            message:"message not found"

        })
        if(message.sender.toString()!==userId.toString()){
              return res.status(403).json({
                message:"not authorized to delete this message"
            })
        }
        chat.message.pull(req.params.messageId);
        await chat.save();
        res.json({message:"message deleted succesfully"})
    } catch (error) {
          res.status(500).json({
        error:error.message,
        message:"Error fetching chat message"
      })  
    }
})
export default chatRouter;