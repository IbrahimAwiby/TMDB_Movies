import { useSelector, useDispatch } from "react-redux";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "../../store/slices/authSlice";
import { ThemeContext } from "../App";
import MovieCard from "../components/MovieCard";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaHeart,
  FaSignOutAlt,
  FaFilm,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";

const Profile = () => {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);

  if (!user) return null;

  // Calculate some stats about saved movies
  const savedMoviesCount = user.savedMovies?.length || 0;
  const averageRating =
    savedMoviesCount > 0
      ? (
          user.savedMovies.reduce(
            (sum, movie) => sum + (movie.vote_average || 0),
            0
          ) / savedMoviesCount
        ).toFixed(1)
      : 0;

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-indigo-50"
      } pt-8 px-4 transition-colors duration-300`}
    >
      <div className="container mx-auto py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className={`text-4xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            } mb-2`}
          >
            Your Profile
          </h1>
          <p
            className={`text-lg ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Manage your account and view your saved movies
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Sidebar */}
          <div
            className={`lg:col-span-1 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } p-6 rounded-2xl shadow-lg transition-colors duration-300`}
          >
            {/* User Avatar */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-white text-4xl" />
              </div>
              <h2
                className={`text-xl font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {user.displayName || "Movie Lover"}
              </h2>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Member since{" "}
                {new Date(user.metadata?.creationTime).getFullYear() || "2024"}
              </p>
            </div>

            {/* User Stats */}
            <div
              className={`mb-6 p-4 rounded-xl ${
                theme === "dark" ? "bg-gray-700" : "bg-blue-50"
              }`}
            >
              <h3
                className={`font-semibold mb-3 flex items-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                <FaHeart className="text-red-500 mr-2" />
                Your Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    Saved Movies
                  </span>
                  <span className="font-semibold text-blue-500">
                    {savedMoviesCount}
                  </span>
                </div>
                {savedMoviesCount > 0 && (
                  <div className="flex justify-between items-center">
                    <span
                      className={
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }
                    >
                      Avg. Rating
                    </span>
                    <span className="font-semibold text-yellow-500 flex items-center">
                      <FaStar className="mr-1" />
                      {averageRating}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="mb-6">
              <h3
                className={`font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Account Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaEnvelope
                    className={`mr-3 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <span
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaIdCard
                    className={`mr-3 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <span
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    {user.uid.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => dispatch(logoutUser())}
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold text-white transition-colors duration-300 flex items-center justify-center"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>

          {/* Saved Movies Section */}
          <div className="lg:col-span-2">
            {user.savedMovies && user.savedMovies.length > 0 ? (
              <div
                className={`${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } p-6 rounded-2xl shadow-lg transition-colors duration-300`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`text-2xl font-bold flex items-center ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <FaFilm className="text-blue-500 mr-3" />
                    Your Saved Movies ({savedMoviesCount})
                  </h2>
                  <Link
                    to="/"
                    className={`flex items-center text-sm ${
                      theme === "dark"
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-800"
                    } transition-colors duration-300`}
                  >
                    Browse more <FaArrowRight className="ml-1" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {user.savedMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>

                {/* Additional Stats */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Collection Insights
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div
                      className={`p-3 rounded-lg text-center ${
                        theme === "dark" ? "bg-gray-700" : "bg-blue-50"
                      }`}
                    >
                      <div className="text-2xl font-bold text-blue-500">
                        {savedMoviesCount}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Movies
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-lg text-center ${
                        theme === "dark" ? "bg-gray-700" : "bg-yellow-50"
                      }`}
                    >
                      <div className="text-2xl font-bold text-yellow-500">
                        {averageRating}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Avg Rating
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-lg text-center ${
                        theme === "dark" ? "bg-gray-700" : "bg-green-50"
                      }`}
                    >
                      <div className="text-2xl font-bold text-green-500">
                        {new Date(
                          Math.max(
                            ...user.savedMovies.map(
                              (m) => new Date(m.release_date || 0)
                            )
                          )
                        ).getFullYear()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Newest
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-lg text-center ${
                        theme === "dark" ? "bg-gray-700" : "bg-purple-50"
                      }`}
                    >
                      <div className="text-2xl font-bold text-purple-500">
                        {new Date(
                          Math.min(
                            ...user.savedMovies
                              .filter((m) => m.release_date)
                              .map((m) => new Date(m.release_date))
                          )
                        ).getFullYear()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Oldest
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } p-8 rounded-2xl shadow-lg text-center transition-colors duration-300`}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaFilm className="text-blue-500 text-3xl" />
                </div>
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Your movie collection is empty
                </h2>
                <p
                  className={`mb-6 max-w-md mx-auto ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Start building your personal movie library by saving your
                  favorite films
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-300"
                >
                  Explore Movies
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
