import express from "express";
import {
  addMovie,
  getMovies,
  getMovieById,
  getRelatedMovies,
  getTrendingMovies,
  getNowPlayingMovies,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/upload.js"; // ✅ THIS WAS MISSING

const router = express.Router();

// GET routes
router.get("/", getMovies);
router.get("/now-playing", getNowPlayingMovies);
router.get("/related/:id", getRelatedMovies);
router.get("/trending", getTrendingMovies);
router.get("/:id", getMovieById);

// POST (Admin only)
router.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "backdrop", maxCount: 1 },
  ]),
  addMovie,
);

// UPDATE (Admin only)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "backdrop", maxCount: 1 },
  ]),
  updateMovie,
);

// DELETE (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteMovie);

export default router;
