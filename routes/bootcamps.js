import { Router } from "express";
import bootcamps from "../controllers/bootcamps.js";
import coursesRouter from "./courses.js";

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

router.route("/:id/photo").put(bootcampPhotoUpload);

router.route("/").get(getBootcamps).post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

export default router;
