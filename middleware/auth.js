import JWT from "jsonwebtoken";
import User from "../models/User.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "./async.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  if (!token) {
    return next(new ErrorResponse(`Not authorize to access this route`, 401));
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new ErrorResponse(`Not authorize to access this route`, 401));
  }
});

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorize`, 403)
      );
    }
    next();
  };
};
