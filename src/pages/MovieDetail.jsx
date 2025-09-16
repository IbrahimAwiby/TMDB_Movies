import { useEffect, useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieDetails } from "../../store/slices/moviesSlice";
import { saveMovie } from "../../store/slices/authSlice";
import { getImageUrl } from "../../services/api";
import { ThemeContext } from "../App";

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { details } = useSelector((state) => state.movies);
  const user = useSelector((state) => state.auth.user);
  const { theme } = useContext(ThemeContext);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    dispatch(fetchMovieDetails({ movieId: id }));
  }, [dispatch, id]);

  // Check if movie is saved when user or movie data changes
  useEffect(() => {
    if (user && details.data) {
      const saved = user.savedMovies?.some(
        (movie) => movie.id === details.data.id
      );
      setIsSaved(saved);
    }
  }, [user, details.data]);

  const handleSaveMovie = () => {
    if (!user) {
      alert("Please login to save movies!");
      return;
    }

    if (details.data) {
      const movieData = {
        id: details.data.id,
        title: details.data.title,
        poster_path: details.data.poster_path,
        vote_average: details.data.vote_average,
        release_date: details.data.release_date,
        overview: details.data.overview,
      };

      dispatch(saveMovie(movieData));
    }
  };

  if (details.loading) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } flex items-center justify-center transition-colors duration-300`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (details.error) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } flex items-center justify-center transition-colors duration-300`}
      >
        <div className="text-red-500 text-xl">Error: {details.error}</div>
      </div>
    );
  }

  if (!details.data) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } flex items-center justify-center transition-colors duration-300`}
      >
        <div
          className={`text-xl ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Movie not found
        </div>
      </div>
    );
  }

  const movie = details.data;

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } transition-colors duration-300`}
    >
      {/* Hero Section */}
      <div className="relative w-full md:h-[590px] h-96">
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <img
          src={
            getImageUrl(movie.backdrop_path, "w1280") ||
            "https://via.placeholder.com/1280x720?text=No+Image"
          }
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 z-20 p-4 md:p-8 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-3 text-gray-200">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2 md:mb-4">
                <span className="text-yellow-400 flex items-center text-sm md:text-base">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-gray-200 text-sm md:text-base">
                  {new Date(movie.release_date).getFullYear()}
                </span>
                <span className="text-gray-200 text-sm md:text-base">
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
                {movie.genres && (
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {movie.genres.slice(0, 2).map((genre) => (
                      <span
                        key={genre.id}
                        className="bg-blue-600 px-2 py-1 rounded text-xs md:text-sm text-white"
                      >
                        {genre.name}
                      </span>
                    ))}
                    {movie.genres.length > 2 && (
                      <span className="bg-blue-600 px-2 py-1 rounded text-xs md:text-sm text-white">
                        +{movie.genres.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Save Movie Button - Improved for mobile */}
            <div className="">
              <button
                onClick={handleSaveMovie}
                className={`flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold transition-all duration-300 w-full md:w-auto ${
                  isSaved
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                title={isSaved ? "Remove from saved movies" : "Save to profile"}
              >
                {isSaved ? (
                  <>
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm md:text-base">Saved</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    <span className="text-sm md:text-base">Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster and Info */}
          <div className="md:w-1/3 lg:w-1/4">
            <img
              src={
                getImageUrl(movie.poster_path) ||
                "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Facts</h3>
              <div className="space-y-3">
                <div>
                  <h4
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Status
                  </h4>
                  <p>{movie.status}</p>
                </div>
                <div>
                  <h4
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Release Date
                  </h4>
                  <p>{new Date(movie.release_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Original Language
                  </h4>
                  <p>{movie.original_language.toUpperCase()}</p>
                </div>
                <div>
                  <h4
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Budget
                  </h4>
                  <p>${movie.budget.toLocaleString()}</p>
                </div>
                <div>
                  <h4
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Revenue
                  </h4>
                  <p>${movie.revenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-2/3 lg:w-3/4">
            {/* Tagline */}
            {movie.tagline && (
              <p
                className={`text-xl italic ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                } mb-6`}
              >
                "{movie.tagline}"
              </p>
            )}

            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">Overview</h3>
              <p className="text-lg">{movie.overview}</p>
            </div>

            {/* Cast */}
            {movie.credits && movie.credits.cast.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">Top Cast</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {movie.credits.cast.slice(0, 8).map((actor) => (
                    <div
                      key={actor.cast_id}
                      className={`${
                        theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                      } p-4 rounded-lg`}
                    >
                      <img
                        src={
                          getImageUrl(actor.profile_path, "w185") ||
                          "https://via.placeholder.com/185x278?text=No+Image"
                        }
                        alt={actor.name}
                        className="w-full h-44 object-cover rounded mb-2"
                      />
                      <h4 className="font-semibold">{actor.name}</h4>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {actor.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Movies */}
            {movie.similar && movie.similar.results.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Similar Movies</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {movie.similar.results.slice(0, 4).map((similarMovie) => (
                    <Link
                      to={`/movie/${similarMovie.id}`}
                      onClick={() => {
                        scrollTo(0, 0);
                      }}
                      key={similarMovie.id}
                    >
                      <div
                        className={`${
                          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                        } rounded-lg overflow-hidden`}
                      >
                        <img
                          src={
                            getImageUrl(similarMovie.poster_path) ||
                            "https://via.placeholder.com/300x450?text=No+Image"
                          }
                          alt={similarMovie.title}
                          className="w-full h-64 object-cover hover:scale-105 duration-300"
                        />
                        <div className="p-3">
                          <h4 className="font-semibold text-sm truncate">
                            {similarMovie.title}
                          </h4>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-yellow-400 text-sm">
                              <svg
                                className="w-4 h-4 inline-block mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {similarMovie.vote_average.toFixed(1)}
                            </span>
                            <span
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {new Date(
                                similarMovie.release_date
                              ).getFullYear()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
