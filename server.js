import dotenv from "dotenv";
dotenv.config({
  path: "./config/config.env",
});
import express from "express";
import bootcamps from "./routes/bootcamps.js";
import courses from "./routes/courses.js";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import colors from "colors";
import { errorHandler } from "./middleware/error.js";
import fileUpload from "express-fileupload";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File upload
app.use(fileUpload());

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

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
