import express from "express";
import {
  getDashboard,
  getRevenueChart,
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getDashboard
);
router.get("/revenue-chart", authMiddleware, adminMiddleware, getRevenueChart);

export default router;