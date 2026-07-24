import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const HeroSection = ({ movies, loading }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const movie = movies[currentIndex];

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
        setFade(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  const backgroundImage = movie?.backdrop_path
    ? movie.backdrop_path.startsWith("http")
      ? movie.backdrop_path
      : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/backgroundImage.png";

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gray-900 animate-pulse">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" /> */}
        {/* Left Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-black/65 to-transparent"></div>

        {/* Top + Bottom Blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#080808]"></div>

        <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-16 lg:px-36">
          <div className="w-28 h-8 bg-gray-700 rounded-full mb-6"></div>

          <div className="w-96 h-16 bg-gray-700 rounded mb-4"></div>

          <div className="w-72 h-5 bg-gray-700 rounded mb-8"></div>

          <div className="w-[500px] h-20 bg-gray-700 rounded mb-8"></div>

          <div className="w-40 h-12 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-[85vh] md:min-h-screen bg-cover bg-center md:bg-center transition-all duration-700 ease-in-out"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center top",
      }}
    >
      {/* Dark Gradient Overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div> */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20"></div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-black/10"></div>

      {/* Hero Content */}

      <div
        className={`relative z-10 flex flex-col items-start justify-end md:justify-center min-h-[85vh] md:min-h-screen px-5 sm:px-6 md:px-16 lg:px-36 pb-20 md:pb-0 transition-opacity duration-500 ${
          fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Everything else stays exactly the same */}

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/40 px-4 py-2 rounded-full backdrop-blur-xl">
            <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-300">
              {(movie?.vote_average || 0).toFixed(1)}
            </span>
          </div>

          <span className="text-gray-900 dark:text-gray-300 text-sm">
            IMDb Rating
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-none max-w-3xl tracking-tight drop-shadow-xl">
          {movie?.title || "Loading..."}
        </h1>

        <div className="flex items-center gap-2 flex-wrap mt-4">
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl text-sm">
            {Array.isArray(movie?.genres)
              ? movie.genres
                  .map((genre) =>
                    typeof genre === "string" ? genre : genre.name,
                  )
                  .join(" • ")
              : "Movie"}
          </span>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl">
            <CalendarIcon className="w-4.5 h-4.5" />
            {movie?.release_date
              ? new Date(movie.release_date).getFullYear()
              : "N/A"}
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl">
            <ClockIcon className="w-4.5 h-4.5" />
            {movie?.runtime
              ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
              : "N/A"}
          </div>
        </div>

        <p className="max-w-xl mt-4 text-gray-300 leading-6 text-sm sm:text-base md:text-lg line-clamp-3 md:line-clamp-4">
          {movie?.overview || "No description available."}
        </p>

        <button
          onClick={() => navigate("/movies")}
          className="mt-6 flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full bg-primary hover:bg-primary-dull hover:scale-[1.03]hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 shadow-lg shadow-primary/40 font-semibold"
        >
          Explore Movies
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      <button
        onClick={() => {
          if (!movies.length) return;

          setCurrentIndex((prev) =>
            prev === 0 ? movies.length - 1 : prev - 1,
          );
        }}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-primary hover:scale-105 duration-300 transition"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={() => {
          if (!movies.length) return;

          setCurrentIndex((prev) => (prev + 1) % movies.length);
        }}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-primary hover:scale-105 duration-300 transition"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setFade(false);

              setTimeout(() => {
                setCurrentIndex(index);
                setFade(true);
              }, 200);
            }}
            className={`h-3 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "w-8 bg-primary shadow-lg shadow-primary/50"
                : "w-3 bg-white/30 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
