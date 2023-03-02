import { asyncHandler } from "../middleware/async.js";
import User from "../models/User.js";
import { ErrorResponse } from "../utils/errorResponse.js";
// import path from "path";

/**
 * @description Register user
 * @method POST /api/v1/auth/register
 * @access Public
 */

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

/**
 * @description Login user
 * @method POST /api/v1/auth/login
 * @access Public
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse(`Please provide an email and password`, 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  const isMatched = await user.matchPassword(password);

  if (!isMatched) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
export const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJWTtoken();

  const option = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    option.secure = true;
  }

  res.status(statusCode).cookie("token", token, option).json({
    success: true,
    token,
  });
};

/**
 * @description Get current logged in user
 * @method GET /api/v1/auth/login
 * @access Private
 */
export const getMeLogIn = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});
