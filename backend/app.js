import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";

const app = express();

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});

// Load environment variables
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "backend/config/config.env" });
}

// Connect to database
connectDatabase();

// Middleware to handle JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Setup CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true, // Allow cookies and headers
  })
);

// Import all routes
import courseRoutes from "./routes/course.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/students.js";
import teacherRoutes from "./routes/teachers.js";
import gradeRoutes from "./routes/grade.js";

// Use routes
app.use("/api/v1", courseRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", studentRoutes);
app.use("/api/v1", teacherRoutes);
app.use("/api/v1", gradeRoutes);

// Using error middleware
app.use(errorMiddleware);

// Start server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
