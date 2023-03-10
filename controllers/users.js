import { asyncHandler } from "../middleware/async.js";
import User from "../models/User.js";

/**
 * @description GET all user
 * @method GET /api/v1/auth/users
 * @access Public
 */
export const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @description GET single user
 * @method GET /api/v1/auth/users/:id
 * @access Public
 */
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({ success: true, data: user });
});

/**
 * @description Create user
 * @method POST /api/v1/auth/users
 * @access Private/Admin
 */
export const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({ success: true, data: user });
});

/**
 * @description Update user
 * @method POST /api/v1/auth/users/:id
 * @access Private/Admin
 */
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

/**
 * @description Delete user
 * @method POST /api/v1/auth/users/:id
 * @access Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});
