import express from "express";
import upload from "../middleware/upload.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  deleteAccount,
  changePassword,
  updateBookingPreferences,
  getAllUsers,
  deleteUser,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", authMiddleware, getCurrentUser);
router.put("/update", authMiddleware, upload.single("image"), updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.put("/booking-preferences", authMiddleware, updateBookingPreferences);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);
router.delete("/delete-account", authMiddleware, deleteAccount);

export default router;
