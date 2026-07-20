import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

// Book Ticket
export const bookTicket = async (req, res) => {
  try {
    const { showId, seats, totalAmount } = req.body;

    // Find Show
    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    // Check booked seats
    const alreadyBooked = seats.some((seat) => show.bookedSeats.includes(seat));

    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: "One or more seats are already booked",
      });
    }

    // Create Booking
    // Create Booking
    const booking = await Booking.create({
      user: req.user._id,
      movie: show.movie,
      show: showId,
      seats,
      totalAmount,
      bookingStatus: "pending",
    });

    // Mark seats as booked
    show.bookedSeats.push(...seats);
    await show.save();

    res.status(201).json({
      success: true,
      message: "Ticket booked successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Bookings
export const getMyBookings = async (req, res) => {
  try {
    const EXPIRY_MINUTES = 15;

    const expiryTime = new Date(Date.now() - EXPIRY_MINUTES * 60 * 1000);

    // Find pending bookings older than 15 minutes
    const expiredBookings = await Booking.find({
      user: req.user._id,
      paymentStatus: "pending",
      bookingStatus: "pending",
      createdAt: {
        $lt: expiryTime,
      },
    });

    // Cancel them automatically
    for (const booking of expiredBookings) {
      booking.bookingStatus = "cancelled";
      await booking.save();
    }

    // Fetch only active bookings
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("movie")
      .populate("show")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel Booking
export const cancelBooking = async (req, res) => {
  try {
    // Find booking that belongs to logged-in user
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Prevent cancelling twice
    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    // Update booking status
    booking.bookingStatus = "cancelled";
    await booking.save();

    // Release booked seats
    const show = await Show.findById(booking.show);

    if (show) {
      show.bookedSeats = show.bookedSeats.filter(
        (seat) => !booking.seats.includes(seat),
      );

      await show.save();
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Bookings (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("movie", "title")
      .populate("show")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
