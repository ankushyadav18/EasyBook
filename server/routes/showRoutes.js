import express from "express";
import {
  addShow,
  getShows,
  getShowsByMovie,
  getShowById,
  updateShow,
  deleteShow,
} from "../controllers/showController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const showRouter = express.Router();

// Admin only
showRouter.post("/add", authMiddleware, adminMiddleware, addShow);

// Public
showRouter.get("/", getShows);
showRouter.get("/single/:id", getShowById);

showRouter.get("/:movieId", getShowsByMovie);

// Admin only
showRouter.put("/:id", authMiddleware, adminMiddleware, updateShow);

showRouter.delete("/:id", authMiddleware, adminMiddleware, deleteShow);

export default showRouter;
