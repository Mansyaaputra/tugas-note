import express from "express";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
  getNoteById,
} from "../controller/NoteController.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginHandler,
  logout,
} from "../controller/UserController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controller/RefreshToken.js";

const router = express.Router();

// Basic error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Auth routes - simplified
router.post("/register", asyncHandler(createUser));
router.post("/login", asyncHandler(loginHandler));
router.post("/logout", verifyToken, asyncHandler(logout));
router.get("/token", asyncHandler(refreshToken)); // Add refresh token route

// Note routes - simplified
router.get("/notes", verifyToken, asyncHandler(getNotes));
router.post("/notes", verifyToken, asyncHandler(createNote));
router.get("/notes/:id", verifyToken, asyncHandler(getNoteById));
router.put("/notes/:id", verifyToken, asyncHandler(updateNote));
router.delete("/notes/:id", verifyToken, asyncHandler(deleteNote));

// User routes - simplified
router.get("/users", verifyToken, asyncHandler(getUsers));
router.get("/users/:id", verifyToken, asyncHandler(getUserById));
router.put("/users/:id", verifyToken, asyncHandler(updateUser));
router.delete("/users/:id", verifyToken, asyncHandler(deleteUser));

export default router;
