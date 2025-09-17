import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchMovies } from "../../store/slices/moviesSlice";
import MovieCard from "../components/MovieCard";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import {
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaStar,
  FaCalendarAlt,
} from "react-icons/fa";

const Search = () => {
  const dispatch = useDispatch();
  const { search } = useSelector((state) => state.movies);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      setQuery(searchQuery);
      dispatch(searchMovies({ query: searchQuery, page }));
    }
  }, [dispatch, location.search, page]);

  useEffect(() => {
    if (search.currentPage && search.currentPage !== page) {
      setPage(search.currentPage);
    }
  }, [search.currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const q = query.trim();
      setPage(1);
      dispatch(searchMovies({ query: q, page: 1 }));
      navigate(`/search?q=${encodeURIComponent(q)}`);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (page < (search.totalPages || 1)) {
      const next = page + 1;
      setPage(next);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const prev = page - 1;
      setPage(prev);
      window.scrollTo(0, 0);
    }
  };

  const clearFilters = () => {
    setSortBy("popularity");
    setYearFilter("");
    setRatingFilter("");
  };

  const displayQuery = query || search.query;

  // Filter and sort results
  const filteredResults = search.results
    ? search.results
        .filter((movie) => {
          let passes = true;

          if (yearFilter && movie.release_date) {
            passes =
              passes &&
              new Date(movie.release_date).getFullYear().toString() ===
                yearFilter;
          }

          if (ratingFilter && movie.vote_average) {
            const minRating = parseInt(ratingFilter);
            passes = passes && movie.vote_average >= minRating;
          }

          return passes;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case "rating":
              return b.vote_average - a.vote_average;
            case "newest":
              return new Date(b.release_date) - new Date(a.release_date);
            case "oldest":
              return new Date(a.release_date) - new Date(b.release_date);
            case "title":
              return a.title.localeCompare(b.title);
            default:
              return 0; // popularity (default order)
          }
        })
    : [];

  // Generate year options (last 30 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-indigo-50"
      } py-8 transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <h1
          className={`text-4xl font-bold text-center ${
            theme === "dark" ? "text-white" : "text-gray-900"
          } mb-8`}
        >
          Discover Movies
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for movies by title, actor, or genre..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`w-full ${
                  theme === "dark"
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-200"
                } px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border pr-24`}
              />
              <div className="absolute right-2 top-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-colors duration-300`}
                  title="Filters"
                >
                  <FaFilter />
                </button>
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  title="Search"
                >
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div
            className={`max-w-2xl mx-auto mb-8 p-6 rounded-xl ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-lg transition-all duration-300`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Filter Results
              </h3>
              <button
                onClick={clearFilters}
                className={`text-sm ${
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-800"
                } transition-colors duration-300`}
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sort By */}
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
                  className={`w-full p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-gray-900 border-gray-200"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="popularity">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <FaCalendarAlt className="inline mr-1" />
                  Release Year
                </label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className={`w-full p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-gray-900 border-gray-200"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">All Years</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <FaStar className="inline mr-1 text-yellow-500" />
                  Min Rating
                </label>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className={`w-full p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-gray-900 border-gray-200"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Any Rating</option>
                  <option value="7">7+ Stars</option>
                  <option value="8">8+ Stars</option>
                  <option value="9">9+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {search.loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {search.results && search.results.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Found {search.totalResults} results for "{displayQuery}"
                    {(yearFilter || ratingFilter) && (
                      <span className="ml-2 text-blue-500">
                        ({filteredResults.length} after filtering)
                      </span>
                    )}
                  </p>

                  {filteredResults.length > 0 && (
                    <div
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Sorted by: {sortBy}
                    </div>
                  )}
                </div>

                {filteredResults.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                      {filteredResults.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </div>

                    {/* Pagination */}
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

                      <span
                        className={
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }
                      >
                        Page {page} of {search.totalPages || 1}
                      </span>

                      <button
                        onClick={handleNextPage}
                        disabled={page === search.totalPages}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                          page === search.totalPages
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
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaTimes className="text-3xl text-gray-500" />
                    </div>
                    <p
                      className={`text-xl ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      } mb-2`}
                    >
                      No results match your filters
                    </p>
                    <button
                      onClick={clearFilters}
                      className={`px-4 py-2 rounded-lg ${
                        theme === "dark"
                          ? "bg-gray-700 text-white hover:bg-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } transition-colors duration-300`}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            ) : displayQuery ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-3xl text-gray-500" />
                </div>
                <p
                  className={`text-xl ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } mb-2`}
                >
                  No results found for "{displayQuery}"
                </p>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Try different keywords or check the spelling
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-3xl text-blue-500" />
                </div>
                <p
                  className={`text-xl ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } mb-2`}
                >
                  Search for movies
                </p>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Use the search bar above to find your favorite movies
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
