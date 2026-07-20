import User from "../models/User.js";

// Add or Remove Favorite
export const toggleFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isFavorite = user.favorites.includes(movieId);

    if (isFavorite) {
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== movieId
      );
    } else {
      user.favorites.push(movieId);
    }

    await user.save();

    res.json({
      success: true,
      favorites: user.favorites,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Favorite Movies
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");

    res.json({
      success: true,
      favorites: user.favorites,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};