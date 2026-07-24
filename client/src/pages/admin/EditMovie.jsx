import React, { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePlus, Film, Clapperboard } from "lucide-react";

const EditMovie = () => {
  const { id } = useParams();
  console.log(id);
  const [loading, setLoading] = useState(false);

  const [poster, setPoster] = useState(null);
  const [backdrop, setBackdrop] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    release_date: "",
    runtime: "",
    vote_average: "",
    tagline: "",
    trailer: "",
    original_language: "en",
    status: "now_showing",
    genres: "",
    casts: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getMovie = async () => {
    try {
      const { data } = await api.get(`/movie/${id}`);

      if (data.success) {
        const movie = data.movie;

        setFormData({
          title: movie.title || "",
          overview: movie.overview || "",
          release_date:
            movie.release_date?.split("T")[0] || movie.release_date || "",
          runtime: movie.runtime || "",
          vote_average: movie.vote_average || "",
          tagline: movie.tagline || "",
          trailer: movie.trailer || "",
          original_language: movie.original_language || "en",
          status: movie.status || "now_showing",
          genres: movie.genres?.map((g) => g.name).join(", ") || "",
          casts: movie.casts?.map((c) => c.name).join(", ") || "",
        });

        setPoster(movie.poster_path);
        setBackdrop(movie.backdrop_path);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load movie");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.overview ||
      !formData.release_date ||
      !formData.runtime ||
      !formData.vote_average ||
      !formData.tagline ||
      !formData.trailer ||
      !formData.genres
    ) {
      return toast.error("Please fill all required fields.");
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("overview", formData.overview);
      data.append("release_date", formData.release_date);
      data.append("runtime", formData.runtime);
      data.append("vote_average", formData.vote_average);
      data.append("tagline", formData.tagline);
      data.append("trailer", formData.trailer);
      data.append("original_language", formData.original_language);
      data.append("status", formData.status);

      // Convert comma-separated text into arrays
      data.append(
        "genres",
        JSON.stringify(
          formData.genres.split(",").map((g) => ({ name: g.trim() })),
        ),
      );

      data.append(
        "casts",
        JSON.stringify(
          formData.casts.split(",").map((c) => ({ name: c.trim() })),
        ),
      );

      if (poster && typeof poster !== "string") {
        data.append("poster", poster);
      }

      if (backdrop && typeof backdrop !== "string") {
        data.append("backdrop", backdrop);
      }

      const res = await api.put(`/movie/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
      navigate("/admin/list-movies");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update movie");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovie();
  }, []);

  return (
    <>
      <div className="mb-8">
        <Title text1="Edit" text2="Movie" />

        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Update movie information and keep your catalog up to date.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-4xl space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Poster */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <ImagePlus className="w-5 h-5 text-primary" />
              Poster Image
            </h2>

            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-primary/30 rounded-xl h-64 flex flex-col items-center justify-center hover:border-primary transition">
                {poster ? (
                  <img
                    src={
                      typeof poster === "string"
                        ? poster
                        : URL.createObjectURL(poster)
                    }
                    alt="Poster Preview"
                    className="h-full rounded-lg object-cover"
                  />
                ) : (
                  <>
                    <ImagePlus className="w-14 h-14 text-primary mb-3" />
                    <p className="font-medium">Click to upload poster</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      PNG, JPG or WEBP
                    </p>
                  </>
                )}
              </div>

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => setPoster(e.target.files[0])}
              />
            </label>
          </div>

          {/* Backdrop */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <ImagePlus className="w-5 h-5 text-primary" />
              Backdrop Image
            </h2>

            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-primary/30 rounded-xl h-64 flex flex-col items-center justify-center hover:border-primary transition">
                {backdrop ? (
                  <img
                    src={
                      typeof backdrop === "string"
                        ? backdrop
                        : URL.createObjectURL(backdrop)
                    }
                    alt="Backdrop Preview"
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  <>
                    <ImagePlus className="w-14 h-14 text-primary mb-3" />
                    <p className="font-medium">Click to upload backdrop</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Recommended 16:9 image
                    </p>
                  </>
                )}
              </div>

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => setBackdrop(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Clapperboard className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Movie Information</h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Basic details that customers will see.
            </p>
          </div>

          {/* Movie Title */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Movie Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter movie title"
              className="w-full border border-primary/20 rounded-lg p-3 bg-gray-100 dark:bg-black/20 focus:border-primary outline-none transition"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block mb-2 text-sm font-medium">Tagline</label>

            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Movie tagline"
              className="w-full bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-xl p-3 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
            />
          </div>

          {/* Trailer */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Trailer Video ID
            </label>

            <input
              type="text"
              name="trailer"
              value={formData.trailer}
              onChange={handleChange}
              placeholder="Example: mqqft2x_Aa4"
              className="w-full bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-xl p-3 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
            />

            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Paste only the YouTube Video ID, not the full URL.
            </p>
          </div>

          {/* Overview */}
          {/* Overview */}
          <div>
            <label className="block mb-2 text-sm font-medium">Overview</label>

            <textarea
              rows={5}
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              placeholder="Movie description"
              className="w-full bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-xl p-3 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition resize-none"
            />
          </div>

          {/* Movie Details */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-6">
            <div className="flex items-center gap-2 mb-6">
              <Film className="w-5 h-5 text-primary" />

              <div>
                <h2 className="text-lg font-semibold">Movie Details</h2>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Technical information about the movie.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Release Date</label>

                <input
                  type="date"
                  name="release_date"
                  value={formData.release_date}
                  onChange={handleChange}
                  className="w-full bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-xl p-3 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-2">Runtime (minutes)</label>

                <input
                  type="number"
                  name="runtime"
                  value={formData.runtime}
                  onChange={handleChange}
                  className="w-full bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-xl p-3 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-2">Rating</label>

                <input
                  type="number"
                  step="0.1"
                  name="vote_average"
                  value={formData.vote_average}
                  onChange={handleChange}
                  className="w-full bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-xl p-3 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-2">Language</label>

                <input
                  type="text"
                  name="original_language"
                  value={formData.original_language}
                  onChange={handleChange}
                  className="w-full bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-xl p-3 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2">Movie Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-xl p-3 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition cursor-pointer"
                >
                  <option className="text-black" value="now_showing">
                    Now Showing
                  </option>

                  <option className="text-black" value="coming_soon">
                    Coming Soon
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className="block mb-2">Genres (comma separated)</label>

            <input
              type="text"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              placeholder="Action, Adventure, Sci-Fi"
              className="w-full bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-xl p-3 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
            />
          </div>
        </div>
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed text-gray-900 dark:text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/20 cursor-pointer"
          >
            {loading ? "Updating Movie..." : "Update Movie"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/list-movies")}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-900 dark:text-white py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default EditMovie;
