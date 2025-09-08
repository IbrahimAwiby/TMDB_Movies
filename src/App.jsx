// src/App.js
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
import { useEffect, useState } from "react";
import { setUser } from "../store/slices/authSlice";

// Toastify
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

function AppWithAuthListener() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [authChecked, setAuthChecked] = useState(false);

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
      setAuthChecked(true); // ✅ Auth state is resolved
    });
    return unsub;
  }, [dispatch]);

  // Redirect only after Firebase finishes checking auth
  useEffect(() => {
    if (authChecked && !user && location.pathname === "/") {
      navigate("/auth", { replace: true });
    }
  }, [authChecked, user, location, navigate]);

  // Hide Navbar & Footer on auth + not found
  const hideLayout =
    location.pathname === "/auth" || location.pathname === "/404";

  if (!authChecked) {
    // Show a loading screen while Firebase checks auth
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <h2 className="text-xl animate-pulse">Loading...</h2>
      </div>
    );
  }

  return (
    <>
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
    </>
  );
}

function AppRoot() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App min-h-screen bg-gray-900 text-white">
          <AppWithAuthListener />
          {/* Toastify container */}
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
