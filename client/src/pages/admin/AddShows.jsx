import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { CheckIcon, StarIcon, XIcon } from "lucide-react";
import { dummyShowsData } from "../../assets/assets";
import { Kconverter } from "../../lib/kConverter";

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState([]);
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");

  // Fetch dummy movies
  const fetchNowPlayingMovies = async () => {
    setNowPlayingMovies(dummyShowsData);
  };

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

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />

      <p className="mt-10 text-lg font-medium text-white">Now Playing Movies</p>

      {/* Movies List */}
      <div className="pb-4">
        <div className="flex flex-wrap gap-4 mt-4">
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              className={`relative w-40 cursor-pointer transition duration-300 hover:-translate-y-1 ${
                selectedMovie === movie.id ? "ring-2 ring-primary rounded-lg" : ""
              }`}
              onClick={() => setSelectedMovie(movie.id)}
            >
              <div className="relative rounded-lg overflow-hidden shadow-md">
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  className="w-full h-60 object-cover brightness-90"
                />
                <div className="text-sm flex items-center justify-between p-2 bg-black/70 absolute bottom-0 w-full">
                  <p className="flex items-center gap-1 text-gray-300">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="text-gray-400">{Kconverter(movie.vote_count)} votes</p>
                </div>
              </div>

              {selectedMovie === movie.id && (
                <div className="absolute top-2 right-2 bg-primary h-6 w-6 flex items-center justify-center rounded">
                  <CheckIcon className="text-white w-4 h-4" strokeWidth={2.5} />
                </div>
              )}

              <p className="font-medium truncate text-white mt-2">{movie.title}</p>
              <p className="text-gray-400 text-sm">{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Show Price */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2 text-white">Show Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-gray-400 text-sm">{currency}</p>
          <input
            min={0}
            type="number"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter show price"
            className="outline-none bg-transparent text-white"
          />
        </div>
      </div>

      {/* Date & Time Selector */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2 text-white">
          Select Date and Time
        </label>

        <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="outline-none rounded-md bg-transparent text-white"
          />
          <button
            onClick={handleDateTimeAdd}
            className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer"
          >
            Add Time
          </button>
        </div>
      </div>

      {/* Selected Times */}
      {dateTimeSelection.length > 0 && (
        <div className="mt-6 text-white">
          <h2 className="mb-2 font-semibold text-lg">Selected Times</h2>
          <div className="flex flex-wrap gap-2">
            {dateTimeSelection.map((time) => (
              <div
                key={time}
                className="border border-primary px-2 py-1 flex items-center rounded"
              >
                <span>{time}</span>
                <XIcon
                  onClick={() => handleRemoveTime(time)}
                  width={15}
                  className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer">
        Add Show
      </button>
    </>
  ) : (
    <Loading />
  );
};

export default AddShows;
