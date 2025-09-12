import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchMovies } from "../../store/slices/moviesSlice";
import MovieCard from "../components/MovieCard";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";

const Search = () => {
  const dispatch = useDispatch();
  const { search } = useSelector((state) => state.movies);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

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

  const displayQuery = query || search.query;

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      } py-8 transition-colors duration-300`}
    >
      <div className="container mx-auto px-4">
        <h1
          className={`text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          } mb-8`}
        >
          Search Movies
        </h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-900"
              } px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              type="submit"
              className={`absolute right-3 top-3 ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>

        {search.loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {search.results && search.results.length > 0 ? (
              <>
                <p
                  className={`mb-6 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Found {search.totalResults} results for "{displayQuery}"
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {search.results.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-12 space-x-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg ${
                      page === 1
                        ? `${
                            theme === "dark"
                              ? "bg-gray-700 text-gray-400"
                              : "bg-gray-300 text-gray-500"
                          } cursor-not-allowed`
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
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
                    className={`px-4 py-2 rounded-lg ${
                      page === search.totalPages
                        ? `${
                            theme === "dark"
                              ? "bg-gray-700 text-gray-400"
                              : "bg-gray-300 text-gray-500"
                          } cursor-not-allowed`
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : displayQuery ? (
              <div className="text-center py-12">
                <p
                  className={`text-xl ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  No results found for "{displayQuery}"
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p
                  className={`text-xl ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Search for movies using the search bar above
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
