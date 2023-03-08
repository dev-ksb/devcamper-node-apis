import { Router } from "express";
import {
  forgotPassword,
  getMeLogIn,
  login,
  register,
  resetPassword,
  updateDetails,
  updatePassword,
} from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";

// import Bootcamp from "../models/Bootcamp.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMeLogIn);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

export default router;
