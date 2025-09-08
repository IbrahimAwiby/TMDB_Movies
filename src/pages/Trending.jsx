// pages/Trending.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrendingMovies } from "../../store/slices/moviesSlice";
import MovieCard from "../components/MovieCard";

const Trending = () => {
  const dispatch = useDispatch();
  const { trending } = useSelector((state) => state.movies);
  const [timeWindow, setTimeWindow] = useState("week");

  useEffect(() => {
    dispatch(fetchTrendingMovies(timeWindow));
  }, [dispatch, timeWindow]);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Trending Movies</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeWindow("day")}
              className={`px-4 py-2 rounded-lg ${
                timeWindow === "day" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeWindow("week")}
              className={`px-4 py-2 rounded-lg ${
                timeWindow === "week" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              This Week
            </button>
          </div>
        </div>

        {trending.loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {trending.list.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
