import express from "express";
import {
  checkAuth,
  loginUser,
  signupUser,
  updateProfile,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.put("/update-profile",protectRoute, updateProfile);
router.get("/check",protectRoute,checkAuth);


export default router;
