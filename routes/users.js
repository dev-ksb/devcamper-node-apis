import { Router } from "express";
import {
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  createUser,
} from "../controllers/users.js";
import { advancedResults } from "../middleware/advancedResults.js";
import { authorize, protect } from "../middleware/auth.js";
import User from "../models/User.js";

const router = Router({ mergeParams: true });

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default router;
