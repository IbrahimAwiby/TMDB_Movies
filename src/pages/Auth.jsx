import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsSignIn(true)}
            className={`px-4 py-2 rounded-l-lg font-semibold ${
              isSignIn ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`px-4 py-2 rounded-r-lg font-semibold ${
              !isSignIn ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
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
              <h2 className="text-2xl font-bold text-center text-white mb-4">
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
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50"
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
              <h2 className="text-2xl font-bold text-center text-white mb-4">
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
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50"
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
