import { CalendarDays, StarIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";

const MovieCard = ({
  movie,
  badgeText = "Now Showing",
  badgeColor = "bg-green-500",
}) => {
  const navigate = useNavigate();

  const imagePath = movie.poster_path || movie.backdrop_path;

  const getImage = (path) => {
    if (!path) return "/fallback.jpg";

    if (path.startsWith("http")) return path;

    return `https://image.tmdb.org/t/p/original/${path}`;
  };
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  return (
    <div
      onClick={() => navigate(`/movies/${movie._id}`)}
      className="group shrink-0 snap-start w-40 md:w-64 overflow-hidden cursor-pointer bg-white dark:bg-primary/10 border border-black dark:border-primary/20 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-primary/60 hover:shadow-[0_8px_20px_rgba(229,9,20,0.10)]"
    >
      {/* Poster */}
      <div className="relative overflow-hidden rounded-t-3xl">
        <img
          src={getImage(imagePath)}
          alt={movie.title}
          className="h-34 md:h-64 w-full object-cover transition duration-700 group-hover:scale-110"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Rating */}
        {movie.status === "now_showing" && (
          <div className="absolute top-2 right-2 md:top-4 md:right-4 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-xl border border-gray-600 dark:border-white/10 px-2 py-1 md:px-3">
            <StarIcon className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs md:text-sm font-semibold">
              {Number(movie.vote_average ?? movie.rating ?? 0).toFixed(1)}
            </span>
          </div>
        )}

        {/* Status */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4">
          <span
            className={`px-2 py-1 md:px-3 rounded-full text-xs font-semibold ${
              movie.status === "coming_soon"
                ? "bg-yellow-500 text-black"
                : `${badgeColor} text-gray-900 dark:text-white`
            }`}
          >
            {movie.status === "coming_soon" ? "Coming Soon" : badgeText}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-5 space-y-2 md:space-y-4">
        <h2 className="text-base md:text-lg font-bold text-black dark:text-white truncate">{movie.title}</h2>


        <div className="flex items-center gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-400">
          <span>📅 {year}</span>
          <span>⏱ {timeFormat(movie.runtime)}</span>
        </div>

        {/* Genres */}
        <div className="flex gap-2 mt-3 md:mt-4 overflow-hidden">
          {movie.genres?.slice(0, 2).map((genre, index) => (
            <span
              key={index}
              className="px-2 py-1 md:px-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium whitespace-nowrap"
            >
              {genre.name || genre}
            </span>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-3 md:mt-4 flex items-center justify-between">
          {movie.status === "coming_soon" ? (
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <CalendarDays className="w-4 h-4" />

              {movie.release_date
                ? new Date(movie.release_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Coming Soon"}
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/movies/${movie._id}#dateSelect`);
              }}
              className="w-full rounded-xl bg-primary py-2 md:py-3 text-sm md:text-base font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/40 cursor-pointer"
            >
              Buy Ticket
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
