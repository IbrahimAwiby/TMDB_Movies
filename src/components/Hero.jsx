// components/Hero.js
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getImageUrl } from "../../services/api";
import { Link } from "react-router-dom";

const Hero = () => {
  const { popular } = useSelector((state) => state.movies);
  const [featuredMovie, setFeaturedMovie] = useState(null);

  useEffect(() => {
    if (popular.list.length > 0) {
      // Get a random movie from the popular list for the hero section
      const randomIndex = Math.floor(Math.random() * popular.list.length);
      setFeaturedMovie(popular.list[randomIndex]);
    }
  }, [popular.list]);

  if (!featuredMovie) {
    return (
      <div className="w-full h-96 bg-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 md:h-screen max-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      <img
        src={
          getImageUrl(featuredMovie.backdrop_path, "w1280") ||
          "https://via.placeholder.com/1280x720?text=No+Image"
        }
        alt={featuredMovie.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 z-20 p-8 md:p-16 w-full md:w-2/3">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {featuredMovie.title}
        </h1>
        <p className="text-gray-200 mb-6 line-clamp-3">
          {featuredMovie.overview}
        </p>
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-yellow-400 flex items-center">
            <svg
              className="w-5 h-5 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {featuredMovie.vote_average.toFixed(1)}
          </span>
          <span className="text-gray-300">
            {new Date(featuredMovie.release_date).getFullYear()}
          </span>
        </div>
        <Link
          to={`/movie/${featuredMovie.id}`}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Details
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
