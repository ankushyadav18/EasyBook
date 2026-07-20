import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import MovieCard from "./MovieCard";

const TrendingSection = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getTrendingMovies = async () => {
    try {
      const { data } = await api.get("/movie/trending");

      if (data.success) {
        setMovies(data.movies);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrendingMovies();
  }, []);

  return (
    <section className="section-container">
      {/* Header */}
      <div className="section-header">
        <div>
          <span className="inline-flex px-4 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-widest uppercase">
            Trending
          </span>

          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-2">
            Trending Now
          </h2>

          <p className="mt-3 text-gray-400 max-w-xl leading-7">
            See what's capturing everyone's attention right now.
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

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[2/3] rounded-xl bg-white/10"></div>

              <div className="h-5 w-3/4 bg-white/10 rounded mt-4"></div>

              <div className="h-4 w-1/2 bg-white/10 rounded mt-2"></div>
            </div>
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-700 rounded-2xl">
          <h3 className="text-xl font-semibold">No Trending Movies</h3>

          <p className="text-gray-400 mt-2">
            Trending movies will appear here soon.
          </p>
        </div>
      ) : (
        
          <div className="movie-carousel">
            {movies.map((movie) => (
              <div>
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  badgeText="🔥 Trending"
                  badgeColor="bg-red-600 shadow-lg shadow-red-500/40"
                />
              </div>
            ))}
          </div>
      )}
    </section>
  );
};

export default TrendingSection;
