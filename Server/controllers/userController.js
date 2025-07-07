import User from "../models/User.js";

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

    const newUser = new User({
      email,
      fullName,
      password,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Account created successfully",
      user: {
        fullName: fullName,
        email: email,
        password: password,
      },
    });
  } catch (error) {
    console.log(error);
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
