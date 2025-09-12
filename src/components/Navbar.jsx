import { useState, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  searchMovies,
  clearSearchResults,
} from "../../store/slices/moviesSlice";

import { ThemeContext } from "../App";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { theme, setTheme } = useContext(ThemeContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchMovies({ query: searchQuery.trim(), page: 1 }));
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  const handleLogoClick = () => {
    setSearchQuery("");
    dispatch(clearSearchResults());
    setMenuOpen(false);
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const linkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
    }`;

  const userDisplay = user?.displayName || user?.email?.split("@")[0] || null;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md dark:shadow-none sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex-shrink-0 text-xl font-bold text-gray-900 dark:text-white"
            onClick={handleLogoClick}
          >
            MovieDB
          </Link>

          {/* Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 items-center justify-center px-4">
            <form onSubmit={handleSearch} className="w-full max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
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
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-4 ml-6">
            <NavLink to="/" className={linkClasses}>
              Home
            </NavLink>
            <NavLink to="/movies" className={linkClasses}>
              Movies
            </NavLink>
            <NavLink to="/trending" className={linkClasses}>
              Trending
            </NavLink>
            <NavLink to="/upcoming" className={linkClasses}>
              Upcoming
            </NavLink>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* Auth area */}
            {!user ? (
              <NavLink to="/auth" className={linkClasses}>
                Sign In
              </NavLink>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="text-sm text-gray-700 dark:text-gray-200 px-2 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {userDisplay}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: always show auth button next to burger */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {!user ? (
              <Link
                to="/auth"
                className="px-3 py-1 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setMenuOpen(false)}
                >
                  {userDisplay}
                </Link>
              </div>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              {menuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gray-100 dark:bg-gray-700 px-4 pt-2 pb-3 space-y-1 transition-colors duration-300">
          <form
            onSubmit={handleSearch}
            className="mb-3"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(e);
            }}
          >
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-600 text-gray-900 dark:text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          <NavLink
            to="/"
            className={linkClasses}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/movies"
            className={linkClasses}
            onClick={() => setMenuOpen(false)}
          >
            Movies
          </NavLink>
          <NavLink
            to="/trending"
            className={linkClasses}
            onClick={() => setMenuOpen(false)}
          >
            Trending
          </NavLink>
          <NavLink
            to="/upcoming"
            className={linkClasses}
            onClick={() => setMenuOpen(false)}
          >
            Upcoming
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
