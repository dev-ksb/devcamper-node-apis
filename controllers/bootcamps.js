import { asyncHandler } from "../middleware/async.js";
import Bootcamp from "../models/Bootcamp.js";
import { ErrorResponse } from "../utils/errorResponse.js";

/**
 * @description Get all bootcamps
 * @method GET /api/v1/bootcamps
 * @access Public
 */
const getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, data: bootcamps, count: bootcamps.length });
});

/**
 * @description Get bootcamp
 * @method GET /api/v1/bootcamps/:id
 * @access Public
 */
const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @description Create bootcamp
 * @method POST /api/v1/bootcamps
 * @access Private
 */
const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

/**
 * @description Update bootcamp
 * @method PUT /api/v1/bootcamps/:id
 * @access Private
 */
const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @description Update bootcamp
 * @method DELETE /api/v1/bootcamps/:id
 * @access Private
 */
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true });
});

export default {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
