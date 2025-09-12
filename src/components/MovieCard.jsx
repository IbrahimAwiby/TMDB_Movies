import { Link } from "react-router-dom";
import { getImageUrl } from "../../services/api";

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
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
          className="w-full h-64 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/movie/${movie.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate">
            {movie.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <span className="text-yellow-500">
            <svg
              className="w-5 h-5 inline-block"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </span>
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
