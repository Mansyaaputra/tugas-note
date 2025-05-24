import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ApiRoute from "./route/ApiRoute.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware order is important
app.use(express.json());
app.use(cookieParser());

// CORS Configuration - Allow all origins
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  })
);

// Pre-flight requests
app.options("*", cors());

// Mount routes WITHOUT /api prefix
app.use(ApiRoute);

// Basic health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});