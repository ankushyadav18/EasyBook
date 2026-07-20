import React, { useEffect, useState } from "react";
import api from "../lib/api";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import PageBackground from "../components/PageBackground";
import { useNavigate } from "react-router";
import { HeartOff } from "lucide-react";

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getFavorites = async () => {
    try {
      const { data } = await api.get("/favorite");

      if (data.success) {
        setFavorites(data.favorites);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFavorites();
  }, []);

  if (loading) return <Loading />;

  return favorites.length > 0 ? (
    <div className="relative my-28 md:my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <PageBackground />

      <div className="mb-10">
        <h1 className="text-2xl md:text-4xl font-bold">❤️ My Favorites</h1>

        <p className="text-gray-400 mt-2">
          {favorites.length} {favorites.length === 1 ? "Movie" : "Movies"} Saved
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {favorites.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-6">
      <HeartOff className="w-8 md:w-16 h-8 md:h-16 text-red-500" />

      <h1 className="text-2xl md:text-4xl font-bold">No Favorite Movies</h1>

      <p className="mt-4 max-w-md text-gray-400">
        You haven't added any movies to your favorites yet. Start exploring and
        tap the heart icon to save movies.
      </p>

      <button
        onClick={() => navigate("/movies")}
        className="mt-8 rounded-xl bg-red-600 px-8 py-3 font-semibold hover:bg-red-700 transition cursor-pointer"
      >
        Browse Movies
      </button>
    </div>
  );
};

export default Favorite;
