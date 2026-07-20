import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

// ======================
// Add Review
// ======================
export const addReview = async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;
    // Check if user has booked this movie
    const booking = await Booking.findOne({
      user: req.user._id,
      movie: movieId,
      bookingStatus: "booked",
    });

    if (!booking) {
      return res.status(403).json({
        success: false,
        message: "You can review only movies you have booked.",
      });
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      user: req.user._id,
      movie: movieId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this movie",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      movie: movieId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Get Reviews
// ======================
export const getMovieReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      movie: req.params.movieId,
    })
      .populate("user", "name image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
