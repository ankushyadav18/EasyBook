import Show from "../models/Show.js";

// Add Show
export const addShow = async (req, res) => {
  try {
    const show = await Show.create(req.body);

    res.status(201).json({
      success: true,
      message: "Show added successfully",
      show,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Shows
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({
      isActive: true,
    })
      .populate("movie")
      .sort({ showDate: 1 })
      .lean();

    res.status(200).json({
      success: true,
      shows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Shows By Movie
export const getShowsByMovie = async (req, res) => {
  try {
    const shows = await Show.find({
      movie: req.params.movieId,
      isActive: true,
    })
      .populate("movie")
      .sort({ showDate: 1 })
      .lean();

    const groupedShows = {};

    shows.forEach((show) => {
      const date = new Date(show.showDate).toISOString().split("T")[0];

      if (!groupedShows[date]) {
        groupedShows[date] = [];
      }

      groupedShows[date].push({
        _id: show._id,
        time: show.showTime,
        theatreName: show.theatreName,
        screen: show.screen,
        ticketPrice: show.ticketPrice,
        bookedSeats: show.bookedSeats,
      });
    });

    res.status(200).json({
      success: true,
      shows: groupedShows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Show
export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate("movie");

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    res.status(200).json({
      success: true,
      show,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Show
export const updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("movie");

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Show updated successfully",
      show,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Show
export const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Show deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
