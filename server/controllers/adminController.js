import User from "../models/User.js";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";

// Dashboard Stats
export const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalShows = await Show.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const recentBookings = await Booking.find()
      .populate("user", "name")
      .populate("movie", "title poster_path")
      .sort({ createdAt: -1 })
      .limit(5);

    const topMovies = await Booking.aggregate([
      {
        $group: {
          _id: "$movie",

          bookings: {
            $sum: 1,
          },

          revenue: {
            $sum: "$totalAmount",
          },
        },
      },

      {
        $sort: {
          bookings: -1,
        },
      },

      {
        $limit: 5,
      },

      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movie",
        },
      },

      {
        $unwind: "$movie",
      },
    ]);

    const revenue = await Booking.aggregate([
      {
        $match: {
          bookingStatus: "booked",
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalMovies,
        totalShows,
        totalBookings,
        totalRevenue: revenue[0]?.totalRevenue || 0,
        recentBookings,
        topMovies,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Revenue Chart
export const getRevenueChart = async (req, res) => {
  try {
    const { period = "30days" } = req.query;

    let startDate = new Date();

    if (period === "7days") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "30days") {
      startDate.setDate(startDate.getDate() - 30);
    } else if (period === "1year") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const revenueData = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: {
            $gte: startDate,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: period === "1year" ? "%Y-%m" : "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          revenue: {
            $sum: "$totalAmount",
          },

          bookings: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      revenueData,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to get revenue chart",
    });
  }
};
