import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

export default router;