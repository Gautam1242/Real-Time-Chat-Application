import User from "../models/User";
import jwt from "jsonwebtoken"
// creating these middlewares to protect the routes 
export const protectRoute=async(req,res,next)=>{
    try {
        const token=req.headers.token;

        // decode the token
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(200).json({
                success:false,
                message:"User not found"
            })
        };

        req.user=user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}