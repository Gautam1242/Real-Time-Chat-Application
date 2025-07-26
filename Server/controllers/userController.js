import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// api for login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(200).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// api for sign up
export const signupUser = async (req, res) => {
  try {
    const { email, fullName, password,bio } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({
        message: "Email alredy exists",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
      bio
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(200).json({
      success: true,
      message: "Account created successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// api for updating the profile
export const updateProfile = async (req, res) => {
  try {
    const { fullName, profilePic, bio } = req.body;
    console.log(req);
    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser=await User.findByIdAndUpdate(userId,{fullName,bio},{new:true})
    }
    else{
      const upload=await cloudinary.uploader.upload(profilePic);

      updatedUser=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,fullName,bio},{new:true})
    }

    res.status(200).json({
      success:true,
      message:"Profile updated successfully",
      user:updatedUser
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// controller to check user is authenticated
export const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};
