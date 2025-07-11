import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
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

    if (user.password !== password) {
      return res.status(200).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const signupUser = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({
        message: "Email alredy exists",
        success: false,
      });
    }

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);

    const newUser = await User.create({
      email,
      fullName,
      password:hashedPassword,
    });

    await newUser.save();

    const token=generateToken(newUser._id);

    res.status(200).json({
      success: true,
      message: "Account created successfully",
      user: newUser,
      token
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, profilePic, bio } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    const newUser = new User({
      fullName,
      profilePic,
      bio,
      password: user.password,
      email: user.email,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
