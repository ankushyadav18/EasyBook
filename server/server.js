import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./configs/db.js";

import authRouter from "./routes/authRoutes.js";
import movieRouter from "./routes/movieRoutes.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import favoriteRouter from "./routes/favoriteRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
await connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EasyBook API is Running 🚀",
  });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/movie", movieRouter);
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/favorite", favoriteRouter);
app.use("/api/review", reviewRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});