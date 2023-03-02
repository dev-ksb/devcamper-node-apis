import { Router } from "express";
import {
  addCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
} from "../controllers/courses.js";
import { advancedResults } from "../middleware/advancedResults.js";
import { authorize, protect } from "../middleware/auth.js";
import Course from "../models/Course.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, authorize("publisher", "admin"), addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

export default router;
