import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "../store/store";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import Search from "./pages/Search";
import Trending from "./pages/Trending";
import Upcoming from "./pages/Upcoming";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { onAuthStateChangedListener } from "../services/firebase";
import { useEffect, useState, createContext } from "react";
import { setUser } from "../store/slices/authSlice";

// Toastify
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

// Create context for theme and language
export const ThemeContext = createContext();
export const LanguageContext = createContext();

function AppWithAuthListener() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [authChecked, setAuthChecked] = useState(false);

  // ✅ حفظ المود في localStorage
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "dark";
  });

  const [language, setLanguage] = useState("en");

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const unsub = onAuthStateChangedListener((user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        );
      } else {
        dispatch(setUser(null));
      }
      setAuthChecked(true);
    });
    return unsub;
  }, [dispatch]);

  useEffect(() => {
    if (authChecked && !user && location.pathname === "/") {
      navigate("/auth", { replace: true });
    }
  }, [authChecked, user, location, navigate]);

  const hideLayout =
    location.pathname === "/auth" || location.pathname === "/404";

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <h2 className="text-xl animate-pulse">Loading...</h2>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <div className={theme === "dark" ? "dark" : ""}>
          {!hideLayout && <Navbar />}
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/upcoming" element={<Upcoming />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {!hideLayout && <Footer />}
        </div>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}

function AppRoot() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
          <AppWithAuthListener />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </Router>
    </Provider>
  );
}

export default AppRoot;
