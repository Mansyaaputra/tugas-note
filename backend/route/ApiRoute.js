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

// Auth routes
router.post("/register", createUser);
router.post("/login", loginHandler);

// Protected note routes
router.route("/notes")
  .get(verifyToken, getNotes)
  .post(verifyToken, createNote);

router.route("/notes/:id")
  .get(verifyToken, getNoteById)
  .put(verifyToken, updateNote)
  .delete(verifyToken, deleteNote);

// Protected user routes
router.route("/users")
  .get(verifyToken, getUsers);

router.route("/users/:id")
  .get(verifyToken, getUserById)
  .put(verifyToken, updateUser)
  .delete(verifyToken, deleteUser);

router.post("/logout", verifyToken, logout);

export default router;
