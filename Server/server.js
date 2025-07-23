import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import router from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoute.js";
import { Server } from "socket.io";

// create express app and http server
const app = express();
const server = http.createServer(app); // socket io supports this http server


// initialize socket.io server
export const io=new Server(server,{
  cors:{origin:"*"}
})

// Store online users
export const userSocketMap={}; // {userId:socketId}

// Socket.io connection handler
io.on("connection",(socket)=>{
  const userId=socket.handshake.query.userId;
  console.log("User Connected",userId);

  if(userId) userSocketMap[userId]=socket.id;

  // Emit online users to all connected clients
  io.emit("getOnlineUsers",Object.keys(userSocketMap));

  socket.on("disconnect",()=>{
    console.log("User Disconnecetd",userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
  })
})

// middleware setup
app.use(express.json({ limit: ["4mb"] }));
app.use(cors());
app.use("/api/status", (req, res) => {
  res.send("Server is live");
});

// user end points
app.use("/api/auth", router);
app.use("/api/messages",messageRouter)

// connect to mongo db
await connectDB();
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server is running on PORT : " + PORT);
});
