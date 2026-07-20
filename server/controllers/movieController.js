import Movie from "../models/Movie.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// =====================
// Add Movie
// =====================
export const addMovie = async (req, res) => {
  try {
    let posterUrl = "";
    let backdropUrl = "";

    // Upload Poster
    if (req.files?.poster?.[0]) {
      posterUrl = await uploadToCloudinary(
        req.files.poster[0].buffer,
        "easybook/posters",
      );
    }

    // Upload Backdrop
    if (req.files?.backdrop?.[0]) {
      backdropUrl = await uploadToCloudinary(
        req.files.backdrop[0].buffer,
        "easybook/backdrops",
      );
    }

    if (req.body.genres) {
      req.body.genres = JSON.parse(req.body.genres);
    }

    if (req.body.casts) {
      req.body.casts = JSON.parse(req.body.casts);
    }

    const movieData = {
      ...req.body,
    };

    if (posterUrl) {
      movieData.poster_path = posterUrl;
    }

    if (backdropUrl) {
      movieData.backdrop_path = backdropUrl;
    }
    console.log("Before create:", movieData);

const movie = await Movie.create(movieData);

console.log("After create:", movie);

    res.status(201).json({
      success: true,
      message: "Movie added successfully",
      movie,
    });
  } catch (error) {
    console.error("Add Movie Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================
// Get All Movies
// =====================
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================
// Get Now Playing Movies
// =====================
export const getNowPlayingMovies = async (req, res) => {
  try {
    const movies = await Movie.find({
      status: "now_showing",
      isActive: true,
    });

    res.status(200).json({
      success: true,
      movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================
// Get Movie By ID
// =====================
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================
// Update Movie
// =====================
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Upload new poster
    if (req.files?.poster?.[0]) {
      movie.poster_path = await uploadToCloudinary(
        req.files.poster[0].buffer,
        "easybook/posters",
      );
    }

    // Upload new backdrop
    if (req.files?.backdrop?.[0]) {
      movie.backdrop_path = await uploadToCloudinary(
        req.files.backdrop[0].buffer,
        "easybook/backdrops",
      );
    }

    // Parse arrays
    if (req.body.genres) {
      req.body.genres = JSON.parse(req.body.genres);
    }

    if (req.body.casts) {
      req.body.casts = JSON.parse(req.body.casts);
    }

    // Update all remaining fields
    Object.assign(movie, req.body);

    await movie.save();

    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      movie,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================
// Delete Movie
// =====================
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================
// Related Movies
// =====================
export const getRelatedMovies = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const genreNames = movie.genres.map((genre) => genre.name);

    const relatedMovies = await Movie.find({
      _id: { $ne: movie._id },
      status: "now_showing",
      isActive: true,
      "genres.name": { $in: genreNames },
    }).limit(4);

    res.status(200).json({
      success: true,
      movies: relatedMovies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================
// Trending Movies
// =====================
export const getTrendingMovies = async (req, res) => {
  try {
    const movies = await Movie.aggregate([
      {
        $match: {
          status: "now_showing",
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "movie",
          as: "bookings",
        },
      },
      {
        $addFields: {
          bookingCount: {
            $size: {
              $filter: {
                input: "$bookings",
                as: "booking",
                cond: {
                  $and: [
                    { $eq: ["$$booking.paymentStatus", "paid"] },
                    { $eq: ["$$booking.bookingStatus", "booked"] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $match: {
          bookingCount: { $gt: 0 },
        },
      },
      {
        $project: {
          bookings: 0,
        },
      },
      {
        $sort: {
          bookingCount: -1,
        },
      },
      {
        $limit: 6,
      },
    ]);

    res.json({
      success: true,
      movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
