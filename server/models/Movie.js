import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: String,
    overview: String,

    poster_path: String,
    backdrop_path: String,

    release_date: String,

    original_language: String,

    tagline: String,

    status: {
      type: String,
      enum: ["now_showing", "coming_soon"],
      default: "now_showing",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    trailer: {
      type: String,
      default: "",
    },

    genres: {
      type: [Object],
      default: [],
    },

    casts: {
      type: [Object],
      default: [],
    },

    vote_average: Number,
    vote_count: Number,

    runtime: Number,
  },
  { timestamps: true },
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
