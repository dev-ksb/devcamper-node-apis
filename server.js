import dotenv from "dotenv";
dotenv.config({
  path: "./config/config.env",
});
import express from "express";
import bootcamps from "./routes/bootcamps.js";
import courses from "./routes/courses.js";
import auth from "./routes/auth.js";
import users from "./routes/users.js";
import reviews from "./routes/reviews.js";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import colors from "colors";
import { errorHandler } from "./middleware/error.js";
import fileUpload from "express-fileupload";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());

// Cookie parser
app.use(cookieParser());

// static folder path
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File upload
app.use(fileUpload());

// Sanitize Data
app.use(mongoSanitize());

// security headers
app.use(helmet());

// prevent XSS
app.use(xss());

// Rate limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// hpp
app.use(hpp());

// Enable cors
app.use(cors());

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on PORT: ${PORT}`.yellow
      .bold
  );

  connectDB();
});

process.on("unhandledRejection", (error, promise) => {
  console.log(`Error: ${error.message}`.red);

  server.close(() => process.exit(1));
});
