import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  toggleFavorite,
  getFavorites,
} from "../controllers/favoriteController.js";

const router = express.Router();

router.post("/toggle", authMiddleware, toggleFavorite);
router.get("/", authMiddleware, getFavorites);

export default router;