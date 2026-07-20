import React from "react";

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

const BrowseByGenre = ({ selectedGenre, setSelectedGenre }) => {
  return (
    <section className="section-container">
      {/* Heading */}
      <div className="mb-6">
        <span className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-widest uppercase mb-3">
          Genres
        </span>

        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-2">Browse by Genre</h2>

        <p className="text-gray-400 mt-3 max-w-xl leading-7">
          Explore thousands of movies across your favorite genres.
        </p>
      </div>

      {/* Genre Buttons */}
      <div className="movie-carousel">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`flex-shrink-0 px-7 py-3 rounded-full cursor-pointer backdrop-blur-xl border transition-all duration-300 font-medium ${
              selectedGenre === genre
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/40"
                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary hover:-translate-y-1"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </section>
  );
};

export default BrowseByGenre;
