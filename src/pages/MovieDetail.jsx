import { useEffect, useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieDetails } from "../../store/slices/moviesSlice";
import { saveMovie } from "../../store/slices/authSlice";
import { getImageUrl } from "../../services/api";
import { ThemeContext } from "../App";
import MovieCard from "../components/MovieCard";
import {
  FaStar,
  FaClock,
  FaCalendarAlt,
  FaBookmark,
  FaCheck,
  FaLanguage,
  FaMoneyBillWave,
  FaDollarSign,
  FaPlay,
  FaArrowLeft,
} from "react-icons/fa";

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
      setIsSaved(!isSaved);
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
      {/* Hero Section with Back Button */}
      <div className="relative w-full md:h-[590px] h-96">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90 z-10"></div>
        <img
          src={
            getImageUrl(movie.backdrop_path, "w1280") ||
            "https://via.placeholder.com/1280x720?text=No+Image"
          }
          alt={movie.title}
          className="w-full h-full object-cover"
        />

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-30">
          <Link
            to="/"
            className={`inline-flex items-center px-4 py-2 rounded-lg backdrop-blur-sm ${
              theme === "dark"
                ? "bg-black/40 text-white hover:bg-black/60"
                : "bg-white/20 text-white hover:bg-white/30"
            } transition-all duration-300 shadow-lg`}
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 z-20 p-4 md:p-8 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-white">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <span className="text-yellow-400 flex items-center text-sm md:text-base bg-black/30 px-3 py-1 rounded-full">
                  <FaStar className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-white text-sm md:text-base bg-black/30 px-3 py-1 rounded-full flex items-center">
                  <FaCalendarAlt className="w-4 h-4 mr-1" />
                  {new Date(movie.release_date).getFullYear()}
                </span>
                <span className="text-white text-sm md:text-base bg-black/30 px-3 py-1 rounded-full flex items-center">
                  <FaClock className="w-4 h-4 mr-1" />
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
                {movie.genres && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.slice(0, 3).map((genre) => (
                      <span
                        key={genre.id}
                        className="bg-blue-600 px-3 py-1 rounded-full text-xs md:text-sm text-white"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Save Movie Button */}
            <div className="">
              <button
                onClick={handleSaveMovie}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 w-full md:w-auto ${
                  isSaved
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                }`}
                title={isSaved ? "Remove from saved movies" : "Save to profile"}
              >
                {isSaved ? (
                  <>
                    <FaCheck className="w-5 h-5" />
                    <span className="text-base">Saved</span>
                  </>
                ) : (
                  <>
                    <FaBookmark className="w-5 h-5" />
                    <span className="text-base">Save Movie</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster and Info */}
          <div className="lg:w-1/4">
            <div className="sticky top-6">
              <img
                src={
                  getImageUrl(movie.poster_path, "w500") ||
                  "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={movie.title}
                className="w-full rounded-xl shadow-2xl"
              />

              <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaPlay className="mr-2 text-blue-500" />
                  Movie Facts
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                      Status
                    </h4>
                    <p className="font-medium">{movie.status}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1 flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      Release Date
                    </h4>
                    <p className="font-medium">
                      {new Date(movie.release_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1 flex items-center">
                      <FaLanguage className="mr-1" />
                      Original Language
                    </h4>
                    <p className="font-medium">
                      {movie.original_language.toUpperCase()}
                    </p>
                  </div>
                  {movie.budget > 0 && (
                    <div>
                      <h4 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1 flex items-center">
                        <FaMoneyBillWave className="mr-1" />
                        Budget
                      </h4>
                      <p className="font-medium">
                        ${movie.budget.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div>
                      <h4 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1 flex items-center">
                        <FaDollarSign className="mr-1" />
                        Revenue
                      </h4>
                      <p className="font-medium">
                        ${movie.revenue.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Tagline */}
            {movie.tagline && (
              <p
                className={`text-xl italic ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                } mb-8 text-center`}
              >
                "{movie.tagline}"
              </p>
            )}

            {/* Overview */}
            <div className="mb-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="text-2xl font-semibold mb-4">Overview</h3>
              <p className="text-lg leading-relaxed">{movie.overview}</p>
            </div>

            {/* Cast */}
            {movie.credits && movie.credits.cast.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-6">Top Cast</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {movie.credits.cast.slice(0, 8).map((actor) => (
                    <div
                      key={actor.cast_id}
                      className={`${
                        theme === "dark" ? "bg-gray-800" : "bg-white"
                      } p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300`}
                    >
                      <img
                        src={
                          getImageUrl(actor.profile_path, "w185") ||
                          "https://via.placeholder.com/185x278?text=No+Image"
                        }
                        alt={actor.name}
                        className="w-full h-44 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-sm truncate">
                        {actor.name}
                      </h4>
                      <p
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        } truncate`}
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
                <h3 className="text-2xl font-semibold mb-6">Similar Movies</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                  {movie.similar.results.slice(0, 4).map((similarMovie) => (
                    <MovieCard key={similarMovie.id} movie={similarMovie} />
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
