import { useSelector, useDispatch } from "react-redux";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "../../store/slices/authSlice";
import { ThemeContext } from "../App";
import MovieCard from "../components/MovieCard"; // Import the MovieCard component

const Profile = () => {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);

  if (!user) return null;

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      } pt-8 px-4 transition-colors duration-300`}
    >
      <div className="container mx-auto py-8">
        {/* User Info Card */}
        <div
          className={`${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } p-8 rounded-2xl shadow-lg mb-8 transition-colors duration-300`}
        >
          <h1
            className={`text-3xl font-bold mb-6 text-center ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            👤 Profile
          </h1>

          <div
            className={`space-y-3 text-left ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Username:</span>{" "}
              {user.displayName || "Not set"}
            </p>
            <p>
              <span className="font-semibold">User ID:</span> {user.uid}
            </p>
            <p>
              <span className="font-semibold">Saved Movies:</span>{" "}
              {user.savedMovies?.length || 0}
            </p>
          </div>

          <button
            onClick={() => dispatch(logoutUser())}
            className="mt-6 w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition-colors duration-300"
          >
            Logout
          </button>
        </div>

        {/* Saved Movies Section */}
        {user.savedMovies && user.savedMovies.length > 0 && (
          <div
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } p-8 rounded-2xl shadow-lg transition-colors duration-300`}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              🎬 Saved Movies ({user.savedMovies.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {user.savedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {(!user.savedMovies || user.savedMovies.length === 0) && (
          <div
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } p-8 rounded-2xl shadow-lg text-center transition-colors duration-300`}
          >
            <h2
              className={`text-xl mb-4 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              No saved movies yet
            </h2>
            <p
              className={`mb-6 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Start exploring movies and save your favorites to see them here!
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300"
            >
              Browse Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
