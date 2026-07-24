import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { PlayCircleIcon } from "lucide-react";
import YouTube from "react-youtube";

const TrailersSection = () => {
  const [trailers, setTrailers] = useState([]);
  const [currentTrailer, setCurrentTrailer] = useState(null);

  useEffect(() => {
    const getTrailers = async () => {
      try {
        const res = await api.get("/movie");

        const moviesWithTrailers = res.data.movies.filter(
          (movie) => movie.trailer,
        );

        setTrailers(moviesWithTrailers);

        if (moviesWithTrailers.length > 0) {
          setCurrentTrailer(moviesWithTrailers[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getTrailers();
  }, []);

  return (
    <section className="section-container">
      {/* Heading */}
      <div className="mb-4 md:mb-6">
        <span className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-widest uppercase mb-3">
          Trailers
        </span>

        <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-gray-400 tracking-tight mt-2">
          Watch Latest Trailers
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-xl leading-7">
          Experience the excitement before booking your next movie.
        </p>
      </div>

      {/* Main Trailer */}
      {currentTrailer && (
        <div className="relative overflow-hidden rounded-3xl border border-gray-600 dark:border-white/10 backdrop-blur-xl bg-white/5 shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
          <div className="aspect-video">
            <YouTube
              videoId={currentTrailer.trailer}
              className="w-full h-full"
              iframeClassName="w-full h-full"
              opts={{
                width: "100%",
                height: "100%",
                playerVars: {
                  autoplay: 0,
                  controls: 1,
                  rel: 0,
                  modestbranding: 1,
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Trailer Thumbnails */}
      <div className="movie-carousel">
        {trailers.map((movie) => (
          <div
            key={movie._id}
            onClick={() => setCurrentTrailer(movie)}
            className={`flex-shrink-0 w-36 md:w-52 relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 group ${
              currentTrailer?._id === movie._id
                ? "ring-2 ring-primary shadow-lg shadow-primary/40 scale-[1.03]"
                : "hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20"
            }`}
          >
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="w-full h-36 md:h-60 object-cover brightness-75 group-hover:brightness-100 transition"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent group-hover:bg-black/10 transition" />

            <PlayCircleIcon className="absolute inset-0 m-auto w-14 h-14 text-gray-900 dark:text-white group-hover:text-primary group-hover:scale-110 transition" />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
              <p className="font-semibold truncate">{movie.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrailersSection;
