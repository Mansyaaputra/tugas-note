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

// Use cors middleware with options
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://frontend-notes-putra-dot-g-09-450802.uc.r.appspot.com"
    // Hapus backend domain dari sini
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false // Set to false for public API
}));

app.use(express.json());
app.use(cookieParser());

// Debug endpoint to check env (REMOVE after debugging)
app.get("/debug/env", (req, res) => {
  res.json({
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD ? "SET" : "NOT SET",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ? "SET" : "NOT SET",
    NODE_ENV: process.env.NODE_ENV
  });
});

// Routes
app.use(ApiRoute);

// Basic health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Improved error handling (move after routes)
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
  
  // Handle specific errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      status: 'error',
      message: err.errors[0].message
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      status: 'error',
      message: 'Username or email already exists'
    });
  }

  // Generic error response
  res.status(err.status || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Initialize database tables
const initDatabase = async () => {
  try {
    console.log("Connecting to DB:", {
      DB_HOST: process.env.DB_HOST,
      DB_NAME: process.env.DB_NAME,
      DB_USERNAME: process.env.DB_USERNAME
    });
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