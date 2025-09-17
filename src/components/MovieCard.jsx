import { Link } from "react-router-dom";
import { getImageUrl } from "../../services/api";
import { FaStar, FaCalendarAlt, FaPlayCircle } from "react-icons/fa";

const MovieCard = ({ movie }) => {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <Link
          to={`/movie/${movie.id}`}
          onClick={() => {
            scrollTo(0, 0);
          }}
        >
          <img
            src={
              getImageUrl(movie.poster_path) ||
              "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={movie.title}
            className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Overlay with play icon on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
            <FaPlayCircle className="text-white text-4xl transform scale-75 group-hover:scale-100 transition-transform duration-300" />
          </div>
        </Link>
      </div>

      <div className="p-4">
        <Link to={`/movie/${movie.id}`}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1 transition-colors duration-300">
            {movie.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <FaStar className="text-yellow-500 w-5 h-5 mr-1" />
            <span className="font-semibold text-gray-900 dark:text-white">
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <FaCalendarAlt className="mr-1" />
            <span>
              {movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Additional movie info (optional) */}
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {movie.overview?.substring(0, 80)}...
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
