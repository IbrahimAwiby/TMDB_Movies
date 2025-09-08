import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchMovies } from "../../store/slices/moviesSlice";
import MovieCard from "../components/MovieCard";
import { useLocation, useNavigate } from "react-router-dom";

const Search = () => {
  const dispatch = useDispatch();
  const { search } = useSelector((state) => state.movies);
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // read query from URL whenever it changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      setQuery(searchQuery);
      // dispatch using the new payload object: { query, page }
      dispatch(searchMovies({ query: searchQuery, page }));
    }
    // if no q in URL, we do nothing (user might come from navbar dispatch)
  }, [dispatch, location.search, page]);

  // keep local page in-sync if store updates currentPage (optional)
  useEffect(() => {
    if (search.currentPage && search.currentPage !== page) {
      setPage(search.currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const q = query.trim();
      setPage(1);
      dispatch(searchMovies({ query: q, page: 1 }));
      // use navigate so React Router updates location and re-runs effects
      navigate(`/search?q=${encodeURIComponent(q)}`);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (page < (search.totalPages || 1)) {
      const next = page + 1;
      setPage(next);
      // dispatch will run automatically because page is in effect deps
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
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Search Movies</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-800 text-white px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
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
                <p className="text-white mb-6">
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
                        ? "bg-gray-700 cursor-not-allowed text-gray-400"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-white">
                    Page {page} of {search.totalPages || 1}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={page === search.totalPages}
                    className={`px-4 py-2 rounded-lg ${
                      page === search.totalPages
                        ? "bg-gray-700 cursor-not-allowed text-gray-400"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : displayQuery ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">
                  No results found for "{displayQuery}"
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">
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
