import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ApiRoute from "./route/ApiRoute.js";
import dotenv from "dotenv";
import { initUserModel } from "./model/UserModel.js";
import { initNoteModel } from "./model/NoteModel.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// CORS Headers Middleware - before other middleware
app.use((req, res, next) => {
  // Get origin from request header
  const origin = req.headers.origin;

  // Allow specific origins
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Basic middleware
app.use(express.json());
app.use(cookieParser());

// Enable CORS for all requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle OPTIONS method
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Simple routes
app.use(ApiRoute);

// Basic health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

// Initialize database tables
const initDatabase = async () => {
  try {
    await initUserModel();
    await initNoteModel();
    console.log("Database synchronized");
  } catch (error) {
    console.error("Database sync error:", error);
    process.exit(1);
  }
};

// Initialize DB before starting server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});