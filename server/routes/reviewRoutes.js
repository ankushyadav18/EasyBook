import express from "express";
import {
  addReview,
  getMovieReviews,
} from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Add Review
router.post("/", authMiddleware, addReview);

// Get Reviews of a Movie
router.get("/:movieId", getMovieReviews);

export default router;