import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";

const FeaturedSection = ({ movies, loading }) => {
  const navigate = useNavigate();
  const nowShowingMovies = movies
    .filter((movie) => movie.status === "now_showing")
    .slice(0, 10);

  return (
    <section className="section-container">
      <div className="section-header">
        <div>
          <span className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-widest uppercase mb-3">
            Now Showing
          </span>

          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-2">
            In Theatres
          </h2>

          <p className="text-gray-400 mt-3 max-w-xl leading-7">
            Discover the latest blockbuster movies currently playing near you.
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

      {/* STATES */}
      {loading ? (
        <p className="text-center text-gray-400">Loading movies...</p>
      ) : nowShowingMovies.length === 0 ? (
        <p className="text-center text-gray-400">
          No movies are currently showing.
        </p>
      ) : (
        <div className="movie-carousel">
          {nowShowingMovies.map((movie) => (
            <div key={movie._id} className="flex-shrink-0 snap-start">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;
