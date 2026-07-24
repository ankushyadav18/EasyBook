import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import {
  CheckIcon,
  StarIcon,
  XIcon,
  Building2,
  CalendarClock,
} from "lucide-react";
import { Kconverter } from "../../lib/kConverter";
import toast from "react-hot-toast";
import api from "../../lib/api";

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState([]);
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [theatreName, setTheatreName] = useState("");
  const [screen, setScreen] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch dummy movies
  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await api.get("/movie/now-playing");

      if (data.success) {
        setNowPlayingMovies(data.movies);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load movies");
    }
  };
  const filteredMovies = nowPlayingMovies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  // Add new time
  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    setDateTimeSelection((prev) => [...prev, dateTimeInput]);
    setDateTimeInput("");
  };

  // Remove a selected time
  const handleRemoveTime = (timeToRemove) => {
    setDateTimeSelection((prev) => prev.filter((t) => t !== timeToRemove));
  };

  const handleAddShow = async () => {
    if (!selectedMovie) {
      return toast.error("Please select a movie");
    }

    if (!theatreName || !screen) {
      return toast.error("Please enter theatre and screen");
    }

    if (!showPrice) {
      return toast.error("Please enter show price");
    }

    if (dateTimeSelection.length === 0) {
      return toast.error("Please add at least one show time");
    }

    try {
      for (const dateTime of dateTimeSelection) {
        const date = new Date(dateTime);

        await api.post("/show/add", {
          movie: selectedMovie,
          theatreName,
          screen,
          showDate: date,
          showTime: date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          ticketPrice: Number(showPrice),
        });
      }

      toast.success("Show(s) added successfully");

      setSelectedMovie(null);
      setDateTimeSelection([]);
      setDateTimeInput("");
      setShowPrice("");
      setTheatreName("");
      setScreen("");

      navigate("/admin/list-shows");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add show");
    }
  };

  return (
    <>
      <div className="mb-8">
        <Title text1="Add" text2="Shows" />

        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Schedule movie shows and manage theatre timings.
        </p>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-xl px-4 py-3 outline-none focus:border-primary transition"
        />
      </div>

      {/* Movies List */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
        <div className="mb-2 md:mb-6">
          <h2 className="text-lg font-semibold">Select Movie</h2>

          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Choose a movie that is currently playing.
          </p>
        </div>

        {/* movie cards here */}
        <div className="pb-4">
          <div className="movie-carousel">
            {filteredMovies.map((movie) => (
              <div
                key={movie._id}
                className={`group relative min-w-[180px] w-34 md:w-44 flex-shrink-0 bg-primary/10 border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedMovie === movie._id
                    ? "border-primary ring-2 ring-primary scale-105 shadow-lg shadow-primary/20"
                    : "border-primary/20 hover:border-primary/50 hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/10"
                }`}
                onClick={() =>
                  setSelectedMovie(
                    selectedMovie === movie._id ? null : movie._id,
                  )
                }
              >
                <div className="relative rounded-lg overflow-hidden shadow-md">
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="w-full h-52 sm:h-60 md:h-64 object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="text-[11px] sm:text-sm flex items-center justify-between p-2 bg-black/70 absolute bottom-0 w-full">
                    <p className="flex items-center gap-1 text-gray-900 dark:text-gray-300">
                      <StarIcon className="w-4 h-4 text-primary fill-primary" />
                      {movie.vote_average.toFixed(1)}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {Kconverter(movie.vote_count)} votes
                    </p>
                  </div>
                </div>

                {selectedMovie === movie._id && (
                  <div className="absolute top-2 right-2 bg-primary h-6 w-6 flex items-center justify-center rounded">
                    <CheckIcon
                      className="text-gray-900 dark:text-white w-4 h-4"
                      strokeWidth={2.5}
                    />
                  </div>
                )}

                <div className="p-3">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                    {movie.title}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {movie.release_date}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Theatre Details
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure where the movie will be shown.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Theatre Name
              </label>

              <input
                type="text"
                value={theatreName}
                onChange={(e) => setTheatreName(e.target.value)}
                placeholder="PVR Noida"
                className="w-full bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-xl p-3 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Screen</label>

              <input
                type="text"
                value={screen}
                onChange={(e) => setScreen(e.target.value)}
                placeholder="Screen 1"
                className="w-full bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-xl p-3 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-primary" />
              Show Schedule
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose one or multiple show timings.
            </p>
          </div>

          {/* Show Price */}
          <div className="mt-8">
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Show Price
            </label>
            <div className="flex items-center w-full bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-xl px-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">{currency}</p>
              <input
                min={0}
                type="number"
                value={showPrice}
                onChange={(e) => setShowPrice(e.target.value)}
                placeholder="Enter show price"
                className="flex-1 bg-transparent text-gray-900 dark:text-white py-3 outline-none"
              />
            </div>
          </div>

          {/* Date & Time Selector */}
          <div className="mt-8">
            <label className="block text-sm font-medium mb-3">
              Select Date & Time
            </label>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="datetime-local"
                value={dateTimeInput}
                onChange={(e) => setDateTimeInput(e.target.value)}
                className="flex-1 bg-gray-100 dark:bg-black/20 border border-primary/20 rounded-xl p-3 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              />

              <button
                type="button"
                onClick={handleDateTimeAdd}
                className="bg-primary hover:bg-primary/90 text-gray-900 dark:text-white px-8 py-3 rounded-xl font-semibold transition cursor-pointer"
              >
                Add Time
              </button>
            </div>
          </div>

          {/* Selected Times */}
          {dateTimeSelection.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">
                Selected Show Times
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                Click the × icon to remove a scheduled show time.
              </p>

              <div className="flex flex-wrap gap-3">
                {dateTimeSelection.map((time) => (
                  <div
                    key={time}
                    className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3"
                  >
                    <span className="text-sm text-gray-900 dark:text-white">{time}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveTime(time)}
                      className="text-red-400 hover:text-red-500 transition cursor-pointer"
                    >
                      <XIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleAddShow}
        className="w-full bg-primary hover:bg-primary/90 text-gray-900 dark:text-white py-3 rounded-xl font-semibold transition cursor-pointer mt-8 shadow-lg hover:shadow-primary/30"
      >
        Add Show
      </button>
    </>
  );
};

export default AddShows;
