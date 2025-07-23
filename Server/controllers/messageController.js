
import User from "../models/User.js"
import Message from "../models/Message.js"
import cloudinary from "../lib/cloudinary.js";
import { io,userSocketMap } from "../server.js";
// get all users except the logged in user 
export const getUsersForSidebar=async(req,res)=>{
    try {
        const userId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:userId}}).select("-password");

        // count no of messages not seen 
        const unseenMessages={}
        const promises=filteredUsers.map(async(user)=>{
            const messages=await Message.find({
                senderId:user._id,
                receiverId:userId,
                seen:false
            })

            if(messages.length>0){
                unseenMessages[user._id]=messages.length;
            }
        });
        await Promise.all(promises);
        res.status(200).json({
            success:true,
            users:filteredUsers,
            unseenMessages
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// Get all messages for selected user
export const getMessages=async(req,res)=>{
    try {
        // selected user id
        const {id:selectedUserId}=req.params;
        // login user id
        const myID=req.user._id;
        // get all the messages between the two users
        const messages=await Message.find({
            $or:[
                {senderId:myID,receiverId:selectedUserId},
                {senderId:selectedUserId,receiverId:myID},
            ]
        });
        // marking the seen property as read
        await Message.updateMany({senderId:selectedUserId,receiverId:myID},{seen:true});

        res.status(200).json({
            success:true,
            messages
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// api to mark messages as seen using messages id
export const markMessageAsSeen=async(req,res)=>{
    try {
        const {id}=req.params;
        await Message.findByIdAndUpdate(id,{seen:true});
        res.status(200).json({
            success:true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// api to send message to selected user 
export const sendMessage=async(req,res)=>{
    try {
        const {selectedUserId}=req.params.id;
        const userId=req.user._id;
        const {text,image}=req.body;

        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=await Message.create({
            senderId:userId,
            receiverId:selectedUserId,
            text,
            image:imageUrl
        });

        // emit the new message to the receiver's socket
        const receiverSocketId=userSocketMap[selectedUserId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        res.status(200).json({
            success:true,
            message:newMessage
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}