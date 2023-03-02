import { Router } from "express";
import { getMeLogIn, login, register } from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";

// import Bootcamp from "../models/Bootcamp.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMeLogIn);

export default router;
