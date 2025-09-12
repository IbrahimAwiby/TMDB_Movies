import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ThemeContext } from "../App";

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);
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
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      } px-4 transition-colors duration-300`}
    >
      <div
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden transition-colors duration-300`}
      >
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsSignIn(true)}
            className={`px-4 py-2 rounded-l-lg font-semibold ${
              isSignIn
                ? "bg-blue-600 text-white"
                : `${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-200 text-gray-700"
                  }`
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`px-4 py-2 rounded-r-lg font-semibold ${
              !isSignIn
                ? "bg-blue-600 text-white"
                : `${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-200 text-gray-700"
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
                } mb-4`}
              >
                Welcome Back
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white disabled:opacity-50"
                >
                  {status === "loading" ? "Loading..." : "Sign In"}
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
                } mb-4`}
              >
                Create Account
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="displayName"
                  type="text"
                  required
                  placeholder="Username"
                  value={form.displayName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white disabled:opacity-50"
                >
                  {status === "loading" ? "Creating..." : "Sign Up"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Auth;
