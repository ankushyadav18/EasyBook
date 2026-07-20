import express from "express";
import {
  bookTicket,
  getMyBookings,
  cancelBooking,
  getAllBookings,
} from "../controllers/bookingController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/book", authMiddleware, bookTicket);
router.get("/all", authMiddleware, adminMiddleware, getAllBookings);
router.get("/my", authMiddleware, getMyBookings);
router.delete("/:id", authMiddleware, cancelBooking);

export default router;
