import express from "express";
import {
  loginUser,
  signupUser,
  updateProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.put("/update", updateProfile);

export default router;
