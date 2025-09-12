import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrendingMovies } from "../../store/slices/moviesSlice";
import MovieCard from "../components/MovieCard";
import { ThemeContext } from "../App";

const Trending = () => {
  const dispatch = useDispatch();
  const { trending } = useSelector((state) => state.movies);
  const [timeWindow, setTimeWindow] = useState("week");
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    dispatch(fetchTrendingMovies({ timeWindow }));
  }, [dispatch, timeWindow]);

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      } py-8 transition-colors duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Trending Movies
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeWindow("day")}
              className={`px-4 py-2 rounded-lg ${
                timeWindow === "day"
                  ? "bg-blue-600 text-white"
                  : `${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-700"
                    }`
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeWindow("week")}
              className={`px-4 py-2 rounded-lg ${
                timeWindow === "week"
                  ? "bg-blue-600 text-white"
                  : `${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-700"
                    }`
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
