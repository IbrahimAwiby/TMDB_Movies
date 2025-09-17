import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrendingMovies } from "../../store/slices/moviesSlice";
import MovieCard from "../components/MovieCard";
import { ThemeContext } from "../App";
import {
  FaFire,
  FaCalendarDay,
  FaCalendarWeek,
  FaChartLine,
} from "react-icons/fa";

const Trending = () => {
  const dispatch = useDispatch();
  const { trending } = useSelector((state) => state.movies);
  const [timeWindow, setTimeWindow] = useState("week");
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTrendingMovies = async () => {
      setIsLoading(true);
      await dispatch(fetchTrendingMovies({ timeWindow }));
      setIsLoading(false);
    };

    loadTrendingMovies();
  }, [dispatch, timeWindow]);

  const handleTimeWindowChange = (window) => {
    setTimeWindow(window);
    // Scroll to top when changing time window
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-indigo-50"
      } py-8 transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4">
              <FaFire className="text-white text-xl" />
            </div>
            <div>
              <h1
                className={`text-3xl md:text-4xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Trending Movies
              </h1>
              <p
                className={`mt-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Discover what's popular right now
              </p>
            </div>
          </div>

          {/* Time Window Selector */}
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => handleTimeWindowChange("day")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                timeWindow === "day"
                  ? "bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-md"
                  : `${
                      theme === "dark"
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`
              }`}
            >
              <FaCalendarDay className="w-4 h-4" />
              <span>Today</span>
            </button>
            <button
              onClick={() => handleTimeWindowChange("week")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                timeWindow === "week"
                  ? "bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-md"
                  : `${
                      theme === "dark"
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`
              }`}
            >
              <FaCalendarWeek className="w-4 h-4" />
              <span>This Week</span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div
          className={`mb-8 p-4 rounded-xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-md`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-orange-400" : "text-orange-600"
                }`}
              >
                {trending.list.length}
              </div>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Trending Movies
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }`}
              >
                {timeWindow === "day" ? "24h" : "7d"}
              </div>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Time Period
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {trending.list.length > 0
                  ? Math.max(
                      ...trending.list.map((m) => m.vote_average)
                    ).toFixed(1)
                  : "0.0"}
              </div>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Highest Rating
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`}
              >
                {trending.list.length > 0
                  ? new Date(
                      Math.max(
                        ...trending.list.map(
                          (m) => new Date(m.release_date || 0)
                        )
                      )
                    ).getFullYear()
                  : "—"}
              </div>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Newest Movie
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {trending.loading || isLoading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mb-4"></div>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              Loading trending movies...
            </p>
          </div>
        ) : trending.error ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaChartLine className="text-3xl text-red-500" />
            </div>
            <p
              className={`text-xl ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } mb-2`}
            >
              Failed to load trending movies
            </p>
            <p className={theme === "dark" ? "text-gray-500" : "text-gray-500"}>
              Please try again later
            </p>
          </div>
        ) : (
          <>
            {/* Movie Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {trending.list.map((movie, index) => (
                <div key={movie.id} className="relative">
                  {/* Trending Badge for top 3 movies */}
                  {index < 3 && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                            ? "bg-gray-400"
                            : "bg-amber-700"
                        }`}
                      >
                        #{index + 1}
                      </div>
                    </div>
                  )}
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {trending.list.length === 0 && !trending.loading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFire className="text-3xl text-gray-500" />
                </div>
                <p
                  className={`text-xl ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } mb-2`}
                >
                  No trending movies found
                </p>
                <p
                  className={
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }
                >
                  Check back later for updated trending content
                </p>
              </div>
            )}

            {/* Info Footer */}
            <div
              className={`mt-12 p-6 rounded-xl text-center ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <FaChartLine className="text-3xl text-orange-500 mx-auto mb-3" />
              <h3
                className={`text-lg font-semibold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                How Trending Works
              </h3>
              <p
                className={`max-w-2xl mx-auto ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Trending movies are determined by viewer engagement, ratings,
                and popularity metrics collected by TMDB. The "Today" view shows
                movies trending in the last 24 hours, while "This Week" shows
                movies trending over the past 7 days.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Trending;
