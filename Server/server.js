import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import router from "./routes/userRoute.js";

// create express app and http server
const app = express();
const server = http.createServer(app); // socket io supports this http server

// middleware setup
app.use(express.json({ limit: ["4mb"] }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send("Server is live");
});

// connect to mongo db
await connectDB();

const PORT = process.env.PORT || 5000;

app.use("/user", router);

server.listen(PORT, () => {
  console.log("Server is running on PORT : " + PORT);
});
