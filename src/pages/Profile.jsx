import { useSelector, useDispatch } from "react-redux";
import { useContext } from "react";
import { logoutUser } from "../../store/slices/authSlice";
import { ThemeContext } from "../App";

const Profile = () => {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);

  if (!user) return null;

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      } pt-20 px-4 transition-colors duration-300`}
    >
      <div
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } p-8 rounded-2xl shadow-lg w-full max-w-md text-center transition-colors duration-300`}
      >
        <h1
          className={`text-3xl font-bold mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          👤 Profile
        </h1>

        <div
          className={`space-y-3 text-left ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Username:</span>{" "}
            {user.displayName || "Not set"}
          </p>
          <p>
            <span className="font-semibold">User ID:</span> {user.uid}
          </p>
        </div>

        <button
          onClick={() => dispatch(logoutUser())}
          className="mt-6 w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
