import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpcomingMovies } from "../../store/slices/moviesSlice";
import MovieCard from "../components/MovieCard";
import { ThemeContext } from "../App";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaRocket,
  FaFilter,
} from "react-icons/fa";

const Upcoming = () => {
  const dispatch = useDispatch();
  const { upcoming } = useSelector((state) => state.movies);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("release_date");
  const [showFilters, setShowFilters] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUpcomingMovies = async () => {
      setIsLoading(true);
      await dispatch(fetchUpcomingMovies({ page }));
      setIsLoading(false);
    };

    loadUpcomingMovies();
  }, [dispatch, page]);

  const handleNextPage = () => {
    if (page < upcoming.totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Sort movies based on selected criteria
  const sortMovies = (movies) => {
    if (!movies) return [];

    const sortedMovies = [...movies];
    switch (sortBy) {
      case "popularity":
        return sortedMovies.sort((a, b) => b.popularity - a.popularity);
      case "rating":
        return sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
      case "title":
        return sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
      case "release_date_desc":
        return sortedMovies.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
      default: // release_date (ascending)
        return sortedMovies.sort(
          (a, b) => new Date(a.release_date) - new Date(b.release_date)
        );
    }
  };

  const sortedMovies = sortMovies(upcoming.list);

  // Get unique years from upcoming movies for filtering
  const uniqueYears = [
    ...new Set(
      upcoming.list
        .filter((movie) => movie.release_date)
        .map((movie) => new Date(movie.release_date).getFullYear())
    ),
  ].sort((a, b) => b - a);

  // Count movies by month for statistics
  const moviesByMonth = upcoming.list.reduce((acc, movie) => {
    if (movie.release_date) {
      const month = new Date(movie.release_date).toLocaleString("default", {
        month: "long",
      });
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {});

  const mostAnticipatedMonth = Object.keys(moviesByMonth).reduce(
    (a, b) => (moviesByMonth[a] > moviesByMonth[b] ? a : b),
    ""
  );

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
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
              <FaRocket className="text-white text-xl" />
            </div>
            <div>
              <h1
                className={`text-3xl md:text-4xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Upcoming Movies
              </h1>
              <p
                className={`mt-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Discover movies coming soon to theaters
              </p>
            </div>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              theme === "dark"
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-white text-gray-900 hover:bg-gray-100"
            } transition-colors duration-300 shadow-md`}
          >
            <FaFilter />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div
            className={`mb-8 p-6 rounded-xl ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-lg transition-all duration-300`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Sort & Filter
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full p-3 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-gray-900 border-gray-200"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="release_date">
                    Release Date (Soonest First)
                  </option>
                  <option value="release_date_desc">
                    Release Date (Newest First)
                  </option>
                  <option value="popularity">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        <div
          className={`mb-8 p-6 rounded-xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-md`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {upcoming.list.length}
              </div>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Upcoming Movies
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }`}
              >
                {uniqueYears.length}
              </div>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Release Years
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`}
              >
                {upcoming.list.length > 0
                  ? Math.max(
                      ...upcoming.list.map((m) => m.vote_average)
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
                  theme === "dark" ? "text-orange-400" : "text-orange-600"
                }`}
              >
                {mostAnticipatedMonth || "—"}
              </div>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Most Anticipated
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {upcoming.loading || isLoading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              Loading upcoming movies...
            </p>
          </div>
        ) : upcoming.error ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-3xl text-red-500" />
            </div>
            <p
              className={`text-xl ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } mb-2`}
            >
              Failed to load upcoming movies
            </p>
            <p className={theme === "dark" ? "text-gray-500" : "text-gray-500"}>
              Please try again later
            </p>
          </div>
        ) : (
          <>
            {/* Movie Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {sortedMovies.map((movie) => (
                <div key={movie.id} className="relative">
                  {/* Release Date Badge */}
                  {movie.release_date && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          theme === "dark"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {new Date(movie.release_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  )}
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {upcoming.list.length === 0 && !upcoming.loading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCalendarAlt className="text-3xl text-gray-500" />
                </div>
                <p
                  className={`text-xl ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } mb-2`}
                >
                  No upcoming movies found
                </p>
                <p
                  className={
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }
                >
                  Check back later for new releases
                </p>
              </div>
            )}

            {/* Pagination */}
            {upcoming.list.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-center items-center mt-12 gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    page === 1
                      ? `${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                        } cursor-not-allowed`
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                  }`}
                >
                  <FaChevronLeft />
                  Previous
                </button>

                <div
                  className={`flex items-center gap-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {Array.from(
                    { length: Math.min(5, upcoming.totalPages) },
                    (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => {
                            setPage(pageNumber);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-10 h-10 rounded-full transition-all duration-300 ${
                            page === pageNumber
                              ? "bg-blue-600 text-white shadow-md"
                              : theme === "dark"
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                  )}
                  {upcoming.totalPages > 5 && <span className="mx-2">...</span>}
                </div>

                <span
                  className={theme === "dark" ? "text-white" : "text-gray-900"}
                >
                  Page {page} of {upcoming.totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={page === upcoming.totalPages}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    page === upcoming.totalPages
                      ? `${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                        } cursor-not-allowed`
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                  }`}
                >
                  Next
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Upcoming;
