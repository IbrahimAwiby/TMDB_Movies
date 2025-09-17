import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMovies,
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
} from "../../store/slices/moviesSlice";
import MovieCard from "../components/MovieCard";
import { ThemeContext } from "../App";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaFire,
  FaStar,
  FaRocket,
  FaClock,
} from "react-icons/fa";

const Movies = () => {
  const dispatch = useDispatch();
  const { popular, trending, topRated, upcoming } = useSelector(
    (state) => state.movies
  );
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const { theme } = useContext(ThemeContext);

  // Determine which movie list to display based on active category
  const getActiveMovieList = () => {
    switch (activeCategory) {
      case "trending":
        return trending;
      case "topRated":
        return topRated;
      case "upcoming":
        return upcoming;
      default:
        return popular;
    }
  };

  const activeMovies = getActiveMovieList();

  useEffect(() => {
    // Fetch data based on active category
    switch (activeCategory) {
      case "trending":
        dispatch(fetchTrendingMovies({ timeWindow: "week" }));
        break;
      case "topRated":
        dispatch(fetchTopRatedMovies({ page }));
        break;
      case "upcoming":
        dispatch(fetchUpcomingMovies({ page }));
        break;
      default:
        dispatch(fetchMovies({ page }));
        break;
    }
  }, [dispatch, page, activeCategory]);

  const handleNextPage = () => {
    if (page < activeMovies.totalPages) {
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setPage(1);
    setShowFilters(false);
  };

  // Sort movies based on selected criteria
  const sortMovies = (movies) => {
    if (!movies) return [];

    const sortedMovies = [...movies];
    switch (sortBy) {
      case "rating":
        return sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
      case "newest":
        return sortedMovies.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
      case "oldest":
        return sortedMovies.sort(
          (a, b) => new Date(a.release_date) - new Date(b.release_date)
        );
      case "title":
        return sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sortedMovies; // popularity (default order)
    }
  };

  const sortedMovies = sortMovies(activeMovies.list);

  const categoryButtons = [
    { id: "popular", label: "Popular", icon: FaFire },
    { id: "trending", label: "Trending", icon: FaRocket },
    { id: "topRated", label: "Top Rated", icon: FaStar },
    { id: "upcoming", label: "Upcoming", icon: FaClock },
  ];

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } py-8 transition-colors duration-300`}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Discover Movies
          </h1>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              theme === "dark"
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-white text-gray-900 hover:bg-gray-100"
            } transition-colors duration-300 shadow-md`}
          >
            <FaFilter />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Category Selection */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categoryButtons.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleCategoryChange(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                activeCategory === id
                  ? "bg-blue-600 text-white shadow-lg"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } shadow-md`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div
            className={`p-4 rounded-xl mb-8 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-lg transition-all duration-300`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Sort By
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { id: "popularity", label: "Popularity" },
                { id: "rating", label: "Rating" },
                { id: "newest", label: "Newest" },
                { id: "oldest", label: "Oldest" },
                { id: "title", label: "Title" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSortBy(id)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    sortBy === id
                      ? "bg-blue-600 text-white"
                      : theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-colors duration-300`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {activeMovies.loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Movie Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {sortedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination - Only show for categories that support pagination */}
            {(activeCategory === "popular" ||
              activeCategory === "topRated" ||
              activeCategory === "upcoming") && (
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
                    { length: Math.min(5, activeMovies.totalPages) },
                    (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => {
                            setPage(pageNumber);
                            window.scrollTo(0, 0);
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
                  {activeMovies.totalPages > 5 && (
                    <span className="mx-2">...</span>
                  )}
                </div>

                <span
                  className={theme === "dark" ? "text-white" : "text-gray-900"}
                >
                  Page {page} of {activeMovies.totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={page === activeMovies.totalPages}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    page === activeMovies.totalPages
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

export default Movies;
