import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMovies,
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
} from "../../store/slices/moviesSlice";
import MovieCard from "../components/MovieCard";
import Hero from "../components/Hero";
import { FaFire, FaStar, FaRocket, FaClock, FaFilm } from "react-icons/fa";

const Home = () => {
  const dispatch = useDispatch();
  const { popular, trending, topRated, upcoming, nowPlaying } = useSelector(
    (state) => state.movies
  );

  useEffect(() => {
    dispatch(fetchMovies(1));
    dispatch(fetchTrendingMovies({ timeWindow: "week" }));
    dispatch(fetchTopRatedMovies());
    dispatch(fetchUpcomingMovies());
    dispatch(fetchNowPlayingMovies());
  }, [dispatch]);

  // Movie section component to avoid repetition
  const MovieSection = ({ title, movies, loading, icon: Icon }) => (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Icon className="text-2xl mr-2 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.slice(0, 12).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Hero />

      <MovieSection
        title="Popular Movies"
        movies={popular.list}
        loading={popular.loading}
        icon={FaFire}
      />

      <MovieSection
        title="Trending This Week"
        movies={trending.list}
        loading={trending.loading}
        icon={FaRocket}
      />

      <MovieSection
        title="Top Rated Movies"
        movies={topRated.list}
        loading={topRated.loading}
        icon={FaStar}
      />

      <MovieSection
        title="Now Playing"
        movies={nowPlaying.list}
        loading={nowPlaying.loading}
        icon={FaFilm}
      />

      <MovieSection
        title="Upcoming Movies"
        movies={upcoming.list}
        loading={upcoming.loading}
        icon={FaClock}
      />
    </div>
  );
};

export default Home;
