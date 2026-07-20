import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";

const ComingSoon = ({ movies, loading }) => {
  const navigate = useNavigate();

  const comingSoonMovies = movies.filter(
    (movie) => movie.status === "coming_soon",
  );

  return (
    <section className="section-container">
      {/* Header */}
      <div className="section-header">
        <div>
          <span className="inline-flex items-center px-4 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold tracking-widest uppercase mb-3">
            Coming Soon
          </span>

          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-2">
            Upcoming Releases
          </h2>

          <p className="text-gray-400 mt-3 max-w-xl leading-7">
            Be the first to discover and book tickets for the biggest upcoming
            movies.
          </p>
        </div>

        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center gap-2 px-3 md:px-5 py-1 md:py-2 rounded-full border border-white/10 bg-white/5 hover:bg-primary transition cursor-pointer"
        >
          View All
          <ArrowRight className="w-3 md:w-5 h-3 md:h-5 transition group-hover:translate-x-1" />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-400">Loading movies...</p>
      ) : comingSoonMovies.length === 0 ? (
        <p className="text-center text-gray-400">
          No upcoming movies available.
        </p>
      ) : (
        <div className="movie-carousel">
          {comingSoonMovies.map((movie) => (
            <div key={movie._id} className="flex-shrink-0 snap-start">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ComingSoon;
