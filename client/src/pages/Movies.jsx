import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import api from "../lib/api";
import { Flame, Clapperboard, CalendarClock, Film } from "lucide-react";
import PageBackground from "../components/PageBackground";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreGenres, setShowMoreGenres] = useState(false);

  const getMovies = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/movie");

      console.log("API RESPONSE:", data);

      if (data && Array.isArray(data.movies)) {
        setMovies(data.movies);
      } else {
        setError("Invalid API response");
      }
    } catch (error) {
      console.log("Error fetching movies:", error);
      setError("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  const genres = [
    "All",
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Romance",
    "Sci-Fi",
    "Thriller",
  ];

  const categories = [
    {
      name: "All",
      icon: Film,
    },
    {
      name: "Trending",
      icon: Flame,
    },
    {
      name: "Now Showing",
      icon: Clapperboard,
    },
    {
      name: "Coming Soon",
      icon: CalendarClock,
    },
  ];

  const filteredMovies = movies.filter((movie) => {
    const matchSearch = movie.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchGenre =
      filter === "All" ||
      movie.genres?.some(
        (genre) => (genre.name || genre).toLowerCase() === filter.toLowerCase(),
      );

    let matchCategory = true;

    if (category === "Trending") {
      matchCategory = movie.isTrending;
    }

    if (category === "Now Showing") {
      matchCategory = movie.status === "now_showing";
    }

    if (category === "Coming Soon") {
      matchCategory = movie.status === "coming_soon";
    }

    return matchSearch && matchGenre && matchCategory;
  });

  useEffect(() => {
    getMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-96 rounded-3xl bg-white/10"></div>

              <div className="h-6 w-2/3 rounded bg-white/10 mt-4"></div>

              <div className="h-4 w-1/2 rounded bg-white/10 mt-3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-semibold text-red-500">{error}</h1>
      </div>
    );
  }

  return (
    <>
      <PageBackground />
      <div className="relative pt-20 md:pt-36 pb-10 md:pb-24 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-40 overflow-hidden min-h-screen">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold">
            🎬 Collection
          </span>

          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Explore Movies
          </h1>

          <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-400 leading-6 sm:leading-7">
            Browse the latest blockbusters, trending titles, and upcoming
            releases. Find your next favorite movie and book your tickets
            instantly.
          </p>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 mb-8 md:mb-10">
          {/* Mobile */}
          <div className="flex flex-wrap gap-2 sm:hidden">
            {categories
              .slice(0, showMoreCategories ? categories.length : 2)
              .map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => setCategory(name)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-full transition ${
                    category === name
                      ? "bg-primary text-white"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <Icon size={16} />
                  {name}
                </button>
              ))}

            <button
              onClick={() => setShowMoreCategories(!showMoreCategories)}
              className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10"
            >
              {showMoreCategories ? "Less ▲" : "More ▾"}
            </button>
          </div>

          {/* Desktop */}
          <div className="hidden sm:flex flex-wrap gap-3">
            {categories.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => setCategory(name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  category === name
                    ? "bg-primary text-white scale-105 shadow-xl shadow-primary/40"
                    : "bg-white/5 border border-white/10 hover:border-primary hover:bg-primary/10"
                }`}
              >
                <Icon size={18} />
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between mb-10">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full lg:w-96 px-3 sm:px-5 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-primary transition"
          />

          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {/* Mobile */}
            <div className="flex flex-wrap gap-2 sm:hidden">
              {genres
                .slice(0, showMoreGenres ? genres.length : 2)
                .map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setFilter(genre)}
                    className={`px-4 py-2 text-sm rounded-full transition ${
                      filter === genre
                        ? "bg-primary text-white"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    {genre}
                  </button>
                ))}

              <button
                onClick={() => setShowMoreGenres(!showMoreGenres)}
                className="px-4 py-2 text-sm rounded-full bg-white/5 border border-white/10 hover:border-primary transition"
              >
                {showMoreGenres ? "Less ▲" : "More ▾"}
              </button>
            </div>

            {/* Desktop */}
            <div className="hidden sm:flex flex-wrap gap-3">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setFilter(genre)}
                  className={`px-5 py-2 rounded-full transition ${
                    filter === genre
                      ? "bg-primary text-white"
                      : "bg-white/5 border border-white/10 hover:border-primary"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold">Movies</h2>

          <p className="text-gray-400">{filteredMovies.length} Movies Found</p>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl">
            <h2 className="text-2xl font-semibold">No Movies Found</h2>

            <p className="text-sm sm:text-base text-gray-400">
              Movies will appear here once they're available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Movies;
