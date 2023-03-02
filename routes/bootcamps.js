import { Router } from "express";
import bootcamps from "../controllers/bootcamps.js";
import coursesRouter from "./courses.js";

import { advancedResults } from "../middleware/advancedResults.js";
import Bootcamp from "../models/Bootcamp.js";
import { authorize, protect } from "../middleware/auth.js";

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
  bootcampPhotoUpload,
} = bootcamps;

const router = Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", coursesRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

export default router;
