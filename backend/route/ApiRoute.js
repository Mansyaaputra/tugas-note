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

const router = express.Router();

// Note routes
router.get("/notes", verifyToken, getNotes);
router.get("/notes/:id", verifyToken, getNoteById);
router.post("/create-notes", verifyToken, createNote);
router.put("/update-notes/:id", verifyToken, updateNote);
router.delete("/delete-notes/:id", verifyToken, deleteNote);

// User routes
router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.post("/create-users", createUser);
router.put("/update-users/:id", verifyToken, updateUser);
router.delete("/delete-users/:id", verifyToken, deleteUser);
router.post("/login", loginHandler);
router.post("/logout", verifyToken, logout);

export default router;
