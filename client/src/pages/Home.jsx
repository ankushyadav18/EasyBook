import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import FeaturedSection from "../components/FeaturedSection";
import TrailersSection from "../components/TrailersSection";
import ComingSoon from "../components/ComingSoon";
import TrendingSection from "../components/TrendingSection";
import PageBackground from "../components/PageBackground";
import api from "../lib/api";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMovies = async () => {
    try {
      const { data } = await api.get("/movie");

      if (data.success) {
        setMovies(data.movies);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <>
      <PageBackground />
      <HeroSection movies={movies} loading={loading} />
      <TrendingSection />
      <FeaturedSection
        movies={movies}
        loading={loading}
      />

      <ComingSoon movies={movies} loading={loading} />
      <TrailersSection />
    </>
  );
};

export default Home;
