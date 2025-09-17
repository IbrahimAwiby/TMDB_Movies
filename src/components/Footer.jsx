import { useContext } from "react";
import { ThemeContext } from "../App";
import {
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaFilm,
  FaHeart,
  FaExternalLinkAlt,
} from "react-icons/fa";

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer
      className={`${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } text-gray-900 dark:text-white py-12 transition-colors duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-6 md:mb-0">
            <FaFilm className="text-blue-500 text-3xl mr-2" />
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                MovieDB
              </h3>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Discover your next favorite movie
              </p>
            </div>
          </div>

          <div className="flex space-x-6">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://x.com/Ibrahimawiby?t=WTLxFucjA3ld4x1oEMMwCQ&s=08"
              className={`p-3 rounded-full ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-100"
              } shadow-md transition-all duration-300 hover:text-blue-500`}
              aria-label="Twitter"
            >
              <FaTwitter className="w-5 h-5" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/ibrahim_awiby?igsh=MXI3c2tqeDhxNDlxMQ=="
              className={`p-3 rounded-full ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-100"
              } shadow-md transition-all duration-300 hover:text-pink-500`}
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/in/ibrahim-hassan-5a1300373?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              className={`p-3 rounded-full ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-100"
              } shadow-md transition-all duration-300 hover:text-blue-600`}
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4 text-lg">About MovieDB</h4>
            <p
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } text-sm`}
            >
              MovieDB is your ultimate destination for discovering, rating, and
              discussing films from around the world.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } space-y-2 text-sm`}
            >
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Popular Movies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Top Rated
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Upcoming Releases
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  News
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Legal</h4>
            <ul
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } space-y-2 text-sm`}
            >
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:text-blue-500 transition-colors"
                >
                  TMDB Website <FaExternalLinkAlt className="ml-1 text-xs" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } text-sm mb-2`}
          >
            © {new Date().getFullYear()} MovieDB. All rights reserved.
          </p>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } text-sm flex items-center justify-center`}
          >
            Made with <FaHeart className="text-red-500 mx-1" /> by Ibrahim
          </p>
          <p
            className={`${
              theme === "dark" ? "text-gray-500" : "text-gray-500"
            } text-xs mt-3`}
          >
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
