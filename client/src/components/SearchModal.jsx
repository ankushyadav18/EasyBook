import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import api from "../lib/api";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";

const SearchModal = ({ onClose }) => {
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await api.get("/movie");

        if (data.success) {
          setMovies(data.movies);
          setFilteredMovies(data.movies);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const results = movies.filter((movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredMovies(results);
  }, [search, movies]);

  useEffect(() => {
    inputRef.current?.focus();

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-md flex items-start justify-center pt-24 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-3xl bg-[#111827] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Search Movies</h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6">
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-gray-700 px-5 py-4">
            <Search className="text-primary w-6 h-6" />

            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by movie name..."
              className="flex-1 bg-transparent outline-none text-lg placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Results */}
        {/* Results */}
        <div className="max-h-[420px] overflow-y-auto px-6 pb-6">
          {loading ? (
            <p className="text-center text-gray-400 py-10">Loading movies...</p>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">🎬</p>
              <h3 className="text-lg font-semibold">No movies found</h3>
              <p className="text-gray-400 text-sm">
                Try searching with another name
              </p>
            </div>
          ) : (
            filteredMovies.slice(0, 8).map((movie) => (
              <div
                key={movie._id}
                onClick={() => {
                  navigate(`/movies/${movie._id}`);
                  onClose();
                }}
                className="flex gap-4 items-center p-3 rounded-xl hover:bg-white/10 cursor-pointer transition"
              >
                {/* Poster */}
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : "/fallback.jpg"
                  }
                  alt={movie.title}
                  className="w-14 h-20 object-cover rounded-md"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-white line-clamp-1">
                    {movie.title}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {movie.genres?.slice(0, 2).join(" • ")} •{" "}
                    {timeFormat(movie.runtime || 0)}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 text-sm text-gray-300">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  {(movie.rating || 0).toFixed(1)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
