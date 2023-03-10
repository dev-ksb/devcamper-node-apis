import { asyncHandler } from "../middleware/async.js";
import Bootcamp from "../models/Bootcamp.js";
import Review from "../models/Review.js";
import { ErrorResponse } from "../utils/errorResponse.js";

/**
 * @description Get reviews
 * @method GET /api/v1/reviews | /api/v1/bootcamps/:bootcampId/reviews
 * @access Public
 */
export const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/**
 * @description Get review
 * @method GET /api/v1/reviews/:id
 * @access Public
 */
export const getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review) {
    return next(ErrorResponse(`No review with id of ${id}`, 404));
  }

  res.status(200).json({
    success: true,
  });
});

/**
 * @description Add Review
 * @method POST /api/v1/bootcamps/:bootcampId/reviews
 * @access Private
 */
export const addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`),
      404
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

/**
 * @description Update Review
 * @method POST /api/v1/reviews/:id
 * @access Private
 */
export const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(ErrorResponse(`No review with id of ${req.params.id}`, 404));
  }

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update review ${review._id}`,
        401
      )
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

/**
 * @description Delete Review
 * @method DELETE /api/v1/reviews/:id
 * @access Private
 */
export const deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(ErrorResponse(`No review with id of ${req.params.id}`, 404));
  }

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete review ${review._id}`,
        401
      )
    );
  }

  await Review.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
