import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../lib/api";
import {
  Heart,
  PlayCircleIcon,
  StarIcon,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";
import Loading from "../components/Loading";
import MovieCard from "../components/MovieCard";
import YouTube from "react-youtube";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import PageBackground from "../components/PageBackground";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);
  const [relatedMovies, setRelatedMovies] = useState([]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  const ratingText = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const getShow = async () => {
    try {
      const movieResponse = await api.get(`/movie/${id}`);
      const showResponse = await api.get(`/show/${id}`);

      setShow({
        movie: movieResponse.data.movie,
        dateTime: showResponse.data.shows,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const { data } = await api.post("/favorite/toggle", {
        movieId: id,
      });

      if (data.success) {
        setIsFavorite((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRecommendedMovies = async () => {
    try {
      setLoadingRecommended(true);

      const { data } = await api.get("/movie");

      if (data.success) {
        setRecommendedMovies(
          data.movies
            .filter(
              (movie) => movie._id !== id && movie.status === "now_showing",
            )
            .slice(0, 4),
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingRecommended(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const { data } = await api.get("/favorite");

      if (data.success) {
        setIsFavorite(data.favorites.some((movie) => movie._id === id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getReviews = async () => {
    try {
      const { data } = await api.get(`/review/${id}`);

      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitReview = async () => {
    if (!comment.trim()) {
      toast.error("Please write a review.");
      return;
    }
    try {
      const { data } = await api.post("/review", {
        movieId: id,
        rating,
        comment,
      });

      if (data.success) {
        toast.success(data.message);

        setComment("");
        setRating(5);

        getReviews();
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  const getRelatedMovies = async () => {
    try {
      const { data } = await api.get(`/movie/related/${id}`);

      if (data.success) {
        setRelatedMovies(data.movies);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#dateSelect") {
      setTimeout(() => {
        document
          .getElementById("dateSelect")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [location]);

  useEffect(() => {
    getShow();
    getRecommendedMovies();
    checkFavorite();
    getReviews();
    getRelatedMovies();
  }, [id]);

  return show ? (
    <div>
      {/* Hero Banner */}
      <div
        className="relative min-h-[100vh] md:min-h-[88vh] bg-cover bg-center flex items-end"
        style={{
          backgroundImage: `url(${show.movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/50"></div>
        <div className="fixed top-24 left-4 md:top-32 md:left-16 lg:left-40 z-40">
          <button
            onClick={() => navigate("/movies")}
            className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-2xl border border-white/10 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 shadow-lg cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full px-4 sm:px-6 md:px-16 lg:px-40 pb-10 md:pb-16">
          <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto items-end">
            <img
              src={show.movie.poster_path}
              alt={show.movie.title}
              className="mx-auto md:mx-0 h-80 w-56 sm:h-96 sm:w-64 md:h-[430px] md:w-72 rounded-3xl object-cover border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] transition duration-500 hover:scale-[1.02]"
            />

            <div className="relative flex flex-col gap-5">
              

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl tracking-tight">
                {show.movie.title}
              </h1>

              <p className="text-gray-300 mt-4 max-w-3xl text-sm sm:text-base md:text-lg leading-7">
                {show.movie.overview}
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-white/10 backdrop-blur-xl border border-white/10">
                  <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{show.movie.vote_average.toFixed(1)}</span>
                </div>

                <div className="px-3 py-1.5 text-sm rounded-full bg-white/10 backdrop-blur-xl border border-white/10">
                  {show.movie.release_date?.split("-")[0]}
                </div>

                <div className="px-3 py-1.5 text-sm rounded-full bg-white/10 backdrop-blur-xl border border-white/10">
                  {timeFormat(show.movie.runtime)}
                </div>

                {show.movie.genres?.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-sm rounded-full bg-primary/15 border border-primary/30 text-primary"
                  >
                    {genre.name || genre}
                  </span>
                ))}
                <p className="text-primary font-medium uppercase">
                  {show.movie.original_language}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-6">
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center justify-center gap-3 w-full sm:w-auto px-7 py-3 rounded-full border border-white/10 bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                >
                  <PlayCircleIcon className="w-5 h-5" />
                  Watch Trailer
                </button>
                {showTrailer && show.movie.trailer && (
                  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
                    <div className="relative w-full max-w-4xl aspect-video">
                      <button
                        onClick={() => setShowTrailer(false)}
                        className="absolute -top-10 right-0 text-white text-2xl"
                      >
                        ✕
                      </button>

                      <YouTube
                        videoId={show.movie.trailer}
                        className="w-full h-full"
                        iframeClassName="w-full h-full rounded-lg"
                        opts={{
                          width: "100%",
                          height: "100%",
                          playerVars: {
                            autoplay: 1,
                            controls: 1,
                            modestbranding: 1,
                            rel: 0,
                            origin: window.location.origin,
                          },
                        }}
                      />
                    </div>
                  </div>
                )}

                {show.movie.status === "coming_soon" ? (
                  <button
                    disabled
                    className="px-10 py-3 text-sm bg-gray-600 text-white rounded-md cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      document
                        .getElementById("dateSelect")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full sm:w-auto px-10 py-3 rounded-full bg-primary hover:bg-primary-dull hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 font-semibold hover:-translate-y-0.5 cursor-pointer"
                  >
                    Buy Tickets
                  </button>
                )}

                <button
                  onClick={toggleFavorite}
                  className="w-12 h-12 mx-auto sm:mx-0 flex items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur-xl hover:bg-red-500/20 hover:border-red-500 transition-all duration-300 cursor-pointer"
                >
                  <Heart
                    className={`w-5 h-5 transition-all duration-300 ${
                      isFavorite
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-white hover:text-red-400"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageBackground />

      {/* Remaining Content */}
      <div className="px-6 md:px-16 lg:px-40">
        <div className="mt-10 md:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left">
            Movie Information
          </h2>

          <div className="grid grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
            <div className="rounded-2xl xl:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-3 sm:p-4 xl:p-6 hover:bg-white/10 hover:-translate-y-2 hover:border-primary/40 transition-all duration-300 shadow-lg">
              <div className=" bg-yellow-500/20 w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 rounded-xl xl:rounded-2xl flex items-center justify-center text-base sm:text-lg xl:text-2xl">
                ⭐
              </div>

              <p className="mt-3 text-[10px] sm:text-xs xl:text-sm text-gray-400">
                Rating
              </p>

              <h2 className="text-sm sm:text-lg xl:text-3xl font-bold mt-1 break-words">
                {show.movie.vote_average.toFixed(1)}
              </h2>

              <span className="text-[9px] sm:text-[10px] xl:text-xs text-gray-500">
                IMDb Score
              </span>
            </div>

            <div className="rounded-2xl xl:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-3 sm:p-4 xl:p-6 hover:bg-white/10 hover:-translate-y-2 hover:border-primary/40 transition-all duration-300 shadow-lg">
              <div className=" bg-pink-500/20 w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 rounded-xl xl:rounded-2xl flex items-center justify-center text-base sm:text-lg xl:text-2xl">
                🎭
              </div>

              <p className="mt-3 text-[10px] sm:text-xs xl:text-sm text-gray-400">
                Genre
              </p>

              <h2 className="text-sm sm:text-lg xl:text-3xl font-bold mt-1 break-words">
                {show.movie.genres?.[0]?.name || show.movie.genres?.[0]}
              </h2>

              <span className="text-[9px] sm:text-[10px] xl:text-xs text-gray-500">
                Movie Category
              </span>
            </div>

            <div className="rounded-2xl xl:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-3 sm:p-4 xl:p-6 hover:bg-white/10 hover:-translate-y-2 hover:border-primary/40 transition-all duration-300 shadow-lg">
              <div className=" bg-blue-500/20 w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 rounded-xl xl:rounded-2xl flex items-center justify-center text-base sm:text-lg xl:text-2xl">
                🌍
              </div>

              <p className="mt-3 text-[10px] sm:text-xs xl:text-sm text-gray-400">
                Language
              </p>

              <h2 className="text-sm sm:text-lg xl:text-3xl font-bold mt-1 break-words">
                {show.movie.original_language}
              </h2>

              <span className="text-[9px] sm:text-[10px] xl:text-xs text-gray-500">
                Original Audio
              </span>
            </div>

            <div className="rounded-2xl xl:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-3 sm:p-4 xl:p-6 hover:bg-white/10 hover:-translate-y-2 hover:border-primary/40 transition-all duration-300 shadow-lg">
              <div className=" bg-green-500/20 w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 rounded-xl xl:rounded-2xl flex items-center justify-center text-base sm:text-lg xl:text-2xl">
                📅
              </div>

              <p className="mt-3 text-[10px] sm:text-xs xl:text-sm text-gray-400">
                Release
              </p>

              <h2 className="text-sm sm:text-lg xl:text-3xl font-bold mt-1 break-words">
                {show.movie.release_date}
              </h2>

              <span className="text-[9px] sm:text-[10px] xl:text-xs text-gray-500">
                Release Date
              </span>
            </div>

            <div className="rounded-2xl xl:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-3 sm:p-4 xl:p-6 hover:bg-white/10 hover:-translate-y-2 hover:border-primary/40 transition-all duration-300 shadow-lg">
              <div className="bg-orange-500/20 w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 rounded-xl xl:rounded-2xl flex items-center justify-center text-base sm:text-lg xl:text-2xl">
                ⏱
              </div>

              <p className="mt-3 text-[10px] sm:text-xs xl:text-sm text-gray-400">
                Runtime
              </p>

              <h2 className="text-sm sm:text-lg xl:text-3xl font-bold mt-1 break-words">
                {timeFormat(show.movie.runtime)}
              </h2>

              <span className="text-[9px] sm:text-[10px] xl:text-xs text-gray-500">
                Duration
              </span>
            </div>

            <div className="rounded-2xl xl:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-3 sm:p-4 xl:p-6 hover:bg-white/10 hover:-translate-y-2 hover:border-primary/40 transition-all duration-300 shadow-lg">
              <div className="w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 rounded-xl xl:rounded-2xl flex items-center justify-center text-base sm:text-lg xl:text-2xl bg-primary/20">
                🎬
              </div>

              <p className="mt-3 text-[10px] sm:text-xs xl:text-sm text-gray-400">
                Status
              </p>

              <h2 className="text-sm sm:text-lg xl:text-3xl font-bold mt-1 break-words">
                {show.movie.status.replace("_", " ")}
              </h2>

              <span className="text-[9px] sm:text-[10px] xl:text-xs text-gray-500">
                Availability
              </span>
            </div>
          </div>
        </div>

        {show.movie.status === "now_showing" && (
          <DateSelect dateTime={show.dateTime} id={id} />
        )}
        {show.movie.status === "now_showing" && (
          <div className="mt-8 md:mt-20">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6 md:p-8 mb-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
                <div>
                  <p className="text-gray-400 mb-2">Community Rating</p>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <StarIcon className="w-10 h-10 sm:w-12 sm:h-12 fill-yellow-400 text-yellow-400 shrink-0" />

                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl text-gray-400">
                        {averageRating}
                        <span className="text-2xl text-gray-400"> / 5</span>
                      </h2>

                      <p className="text-gray-400 mt-1">
                        Based on {reviews.length}{" "}
                        {reviews.length === 1 ? "review" : "reviews"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto">
                  <div className="text-center px-4 sm:px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-gray-400 text-sm">Reviews</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {reviews.length}
                    </h3>
                  </div>

                  <div className="text-center px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-gray-400 text-sm">Rating</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                      {averageRating}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>

            {/* Add Review */}
            <div className="text-center px-4 sm:px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Share Your Experience
                </h2>

                <p className="text-gray-400 mt-2">
                  Tell others what you liked or disliked about this movie.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    onClick={() => {
                      setRating(star);
                    }}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 cursor-pointer transition-all duration-200 ease-in-out ${
                      star <= (hover || rating)
                        ? "fill-yellow-400 text-yellow-400 scale-110"
                        : "text-gray-500"
                    }`}
                  />
                ))}

                <span className="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-3 text-sm sm:text-base text-yellow-400 font-semibold">
                  {hover || rating} ⭐ - {ratingText[hover || rating]}
                </span>
              </div>

              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full h-32 sm:h-36 rounded-2xl border border-white/10 bg-black/20 px-4 sm:px-5 py-3 sm:py-4 resize-none outline-none focus:border-primary transition"
              />

              <button
                onClick={submitReview}
                className="mt-6 w-full sm:w-auto px-8 py-3 rounded-xl bg-primary hover:bg-primary-dull font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                Submit Review
              </button>
            </div>

            {/* Reviews List */}
            <div className="rounded-3xl mt-4 border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
              {reviews.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="text-5xl mb-4">💬</div>

                  <h3 className="text-2xl font-semibold">No Reviews Yet</h3>

                  <p className="text-gray-400 mt-2">
                    Be the first one to review this movie.
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="px-5 sm:px-7 py-6 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-lg sm:text-xl font-bold shadow-lg shrink-0">
                          {review.user?.name?.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-lg font-semibold truncate">
                            {review.user?.name}
                          </h3>

                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mt-4 text-sm sm:text-[15px] text-gray-300 leading-7 sm:leading-8">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="mt-8 md:mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-5 mb-8 sm:mb-10">
            <div>
              <p className="text-primary text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">
                Discover
              </p>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">
                Recommended For You
              </h2>

              <p className="text-sm sm:text-base text-gray-400 mt-3 max-w-xl leading-6 sm:leading-7">
                Based on your current movie, here are some titles you might
                enjoy next.
              </p>
            </div>

            <button
              onClick={() => navigate("/movies")}
              className="group flex items-center text-primary cursor-pointer"
            >
              <ArrowRight className="w-6 h-6 transition group-hover:translate-x-1" />
            </button>
          </div>

          {loadingRecommended ? (
            <div className="flex justify-center py-10">
              <p className="text-gray-400 animate-pulse">Loading movies...</p>
            </div>
          ) : (
            <div className="movie-carousel">
              {recommendedMovies.map((movie) => (
                <div className="flex-shrink-0 snap-start w-[170px] sm:w-[250px]">
                  <MovieCard key={movie._id} movie={movie} />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <div className="mt-8 md:mt-20">
            <div className="mb-8 sm:mb-10">
              <p className="text-primary text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">
                More Movies
              </p>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">
                You May Also Like
              </h2>

              <p className="mt-2 md:mt-3 max-w-xl text-sm sm:text-base text-gray-400 leading-6 sm:leading-7">
                Explore more movies similar to the one you are watching.
              </p>
            </div>

            <div className="movie-carousel">
              {relatedMovies.map((movie) => (
                <div className="flex-shrink-0 snap-start w-[170px] sm:w-[250px]">
                  <MovieCard key={movie._id} movie={movie} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MovieDetails;
