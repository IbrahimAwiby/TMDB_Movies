// pages/Home.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies, fetchTrendingMovies } from "../../store/slices/moviesSlice";
import MovieCard from "../components/MovieCard";
import Hero from "../components/Hero";

const Home = () => {
  const dispatch = useDispatch();
  const { popular, trending } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMovies(1));
    dispatch(fetchTrendingMovies("week"));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Hero />

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Popular Movies</h2>
        {popular.loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {popular.list.slice(0, 12).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Trending This Week
        </h2>
        {trending.loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {trending.list.slice(0, 12).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
