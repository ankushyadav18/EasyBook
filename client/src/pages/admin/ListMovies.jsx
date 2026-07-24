import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ListMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form, setForm] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const getMovies = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/movie");

      if (data.success) {
        setMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteMovie = async () => {
    try {
      const { data } = await api.delete(`/movie/${movieToDelete}`);

      if (data.success) {
        toast.success("Movie deleted successfully");

        setMovies((prev) => prev.filter((m) => m._id !== movieToDelete));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete movie");
    } finally {
      setShowConfirm(false);
      setMovieToDelete(null);
    }
  };

  const startEdit = (movie) => {
    setEditingMovie(movie._id);
    setForm(movie);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateMovie = async () => {
    try {
      const payload = {
        title: form.title,
        runtime: form.runtime,
        original_language: form.original_language,
      };

      const { data } = await api.put(`/movie/${editingMovie}`, payload);

      if (data.success) {
        toast.success("Movie updated successfully");

        setMovies((prev) =>
          prev.map((m) => (m._id === editingMovie ? data.movie : m)),
        );

        setEditingMovie(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-8">
        <Title text1="List" text2="Movies" />

        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage, edit and remove movies available on your EasyBook platform.
        </p>
      </div>

      <div className="flex justify-between items-center mt-4 mb-6">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
        />
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111827] border border-red-500/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center">
                <span className="text-3xl">🗑️</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center">Delete Movie?</h2>

            <p className="text-gray-600 dark:text-gray-400 text-center mt-3 leading-relaxed">
              This action will permanently remove this movie from EasyBook.
              <br />
              This cannot be undone.
            </p>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteMovie}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editingMovie && (
        <div className="bg-black/40 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">Edit Movie</h2>

          <input
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            placeholder="Title"
          />

          <input
            name="runtime"
            value={form.runtime || ""}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            placeholder="Runtime"
          />

          <input
            name="original_language"
            value={form.original_language || ""}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
            placeholder="Language"
          />

          <div className="flex gap-3">
            <button
              onClick={updateMovie}
              className="bg-green-500 text-gray-900 dark:text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setEditingMovie(null)}
              className="bg-gray-500 text-gray-900 dark:text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {movies
          .filter((movie) =>
            movie.title.toLowerCase().includes(search.toLowerCase()),
          )
          .map((movie) => (
            <div
              key={movie._id}
              className="bg-primary/10 border border-primary/20 rounded-2xl overflow-hidden hover:border-primary/50 hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="overflow-hidden">
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold line-clamp-1">
                  {movie.title}
                </h2>

                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="bg-primary/20 px-3 py-1 rounded-full">
                    🌐 {movie.original_language?.toUpperCase()}
                  </span>

                  <span className="bg-gray-100 dark:bg-black/20 px-3 py-1 rounded-full">
                    ⏱ {movie.runtime} min
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                    ⭐ {movie.vote_average || "N/A"}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      movie.status === "coming_soon"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {movie.status === "coming_soon"
                      ? "Coming Soon"
                      : "Now Showing"}
                  </span>
                </div>

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => navigate(`/admin/edit-movie/${movie._id}`)}
                    className="flex-1 bg-primary hover:bg-primary/50 text-gray-900 dark:text-white py-2.5 rounded-xl transition font-medium cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setMovieToDelete(movie._id);
                      setShowConfirm(true);
                    }}
                    className="flex-1 bg-red-500/90 hover:bg-red-600 text-gray-900 dark:text-white py-2.5 rounded-xl transition font-medium cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListMovies;
