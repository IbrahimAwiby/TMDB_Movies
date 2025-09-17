import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ThemeContext } from "../App";

// Import icons (you'll need to install react-icons if not already)
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaFilm,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((s) => s.auth);
  const { theme } = useContext(ThemeContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignIn) {
        await dispatch(
          loginUser({ email: form.email, password: form.password })
        ).unwrap();
        toast.success("Signed in successfully 🎉");
      } else {
        await dispatch(
          registerUser({
            email: form.email,
            password: form.password,
            displayName: form.displayName,
          })
        ).unwrap();
        toast.success("Account created successfully 🎉");
      }
      navigate("/");
    } catch (err) {
      toast.error(err || "Something went wrong ❌");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        theme === "dark"
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-indigo-50"
      } px-4 transition-colors duration-300`}
    >
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        } rounded-2xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden transition-colors duration-300 border`}
      >
        {/* TMDB Branding */}
        <div className="flex items-center justify-center mb-6">
          <FaFilm className="text-blue-500 text-3xl mr-2" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            TMDB
          </h1>
        </div>

        {/* Toggle buttons */}
        <div className="flex justify-center mb-8 rounded-lg p-1 bg-gray-100 dark:bg-gray-700">
          <button
            onClick={() => setIsSignIn(true)}
            className={`flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              isSignIn
                ? "bg-blue-600 text-white shadow-md"
                : `${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              !isSignIn
                ? "bg-blue-600 text-white shadow-md"
                : `${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`
            }`}
          >
            Sign Up
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isSignIn ? (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.35 }}
            >
              <h2
                className={`text-2xl font-bold text-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                } mb-6`}
              >
                Welcome Back
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-900 border-gray-200"
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-900 border-gray-200"
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash
                        className={`${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    ) : (
                      <FaEye
                        className={`${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white disabled:opacity-50 transition-colors duration-300 flex items-center justify-center"
                >
                  {status === "loading" ? (
                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  ) : null}
                  {status === "loading" ? "Signing In..." : "Sign In"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <h2
                className={`text-2xl font-bold text-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                } mb-6`}
              >
                Join TMDB
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <input
                    name="displayName"
                    type="text"
                    required
                    placeholder="Username"
                    value={form.displayName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-900 border-gray-200"
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-900 border-gray-200"
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-900 border-gray-200"
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash
                        className={`${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    ) : (
                      <FaEye
                        className={`${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white disabled:opacity-50 transition-colors duration-300 flex items-center justify-center"
                >
                  {status === "loading" ? (
                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  ) : null}
                  {status === "loading"
                    ? "Creating Account..."
                    : "Create Account"}
                </button>
              </form>

              <p
                className={`mt-6 text-center text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                By signing up, you agree to our
                <a href="#" className="text-blue-500 hover:text-blue-600 ml-1">
                  Terms of Service
                </a>{" "}
                and
                <a href="#" className="text-blue-500 hover:text-blue-600 ml-1">
                  Privacy Policy
                </a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Auth;
