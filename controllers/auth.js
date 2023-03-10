import { asyncHandler } from "../middleware/async.js";
import User from "../models/User.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
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

/**
 * @description Get current logged in user
 * @method GET /api/v1/auth/login
 * @access Private
 */
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse(`password is incorrect', 401`));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

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

/**
 * @description Logout the user
 * @method GET /api/v1/auth/logout
 * @access Private
 */
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @description Update user details
 * @method PUT /api/v1/auth/updatedetails
 * @access Private
 */
export const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * @description forgot password and send email to reset password
 * @method GET /api/v1/auth/forgot-password
 * @access Public
 */
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse(`No user with given email`, 404));
  }

  // reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // create reset url
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) 
  has requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({
      success: true,
      data: "Email sent",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse(`Email could not be sent`, 500));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * @description Reset Password
 * @method GET /api/v1/auth/reset-password/:resetToken
 * @access Public
 */
export const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

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
