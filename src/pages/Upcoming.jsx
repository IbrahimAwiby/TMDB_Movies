import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpcomingMovies } from "../../store/slices/moviesSlice";
import MovieCard from "../components/MovieCard";
import { ThemeContext } from "../App";

const Upcoming = () => {
  const dispatch = useDispatch();
  const { upcoming } = useSelector((state) => state.movies);
  const [page, setPage] = useState(1);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    dispatch(fetchUpcomingMovies({ page }));
  }, [dispatch, page]);

  const handleNextPage = () => {
    if (page < upcoming.totalPages) {
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
          Upcoming Movies
        </h1>

        {upcoming.loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {upcoming.list.map((movie) => (
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
                        theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                      } cursor-not-allowed ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Previous
              </button>
              <span
                className={theme === "dark" ? "text-white" : "text-gray-900"}
              >
                Page {page} of {upcoming.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === upcoming.totalPages}
                className={`px-4 py-2 rounded-lg ${
                  page === upcoming.totalPages
                    ? `${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                      } cursor-not-allowed ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Upcoming;
