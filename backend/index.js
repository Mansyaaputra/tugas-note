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

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://frontend-notes-putra-dot-g-09-450802.uc.r.appspot.com",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "3600");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

// Custom error handler middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: err.errors[0].message
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      message: 'Username or email already exists'
    });
  }

  res.status(500).json({
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Routes
app.use(ApiRoute);

// Basic health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
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