import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../App";

const NotFound = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      } text-center px-4 transition-colors duration-300`}
    >
      <h1 className="text-6xl md:text-8xl font-bold text-blue-600 mb-6">404</h1>
      <h2
        className={`text-2xl md:text-3xl font-semibold mb-4 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Oops! Page not found
      </h2>
      <p
        className={`mb-8 max-w-md ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        The page you are looking for doesn't exist, was removed, or is
        temporarily unavailable.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg text-white font-medium transition duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
