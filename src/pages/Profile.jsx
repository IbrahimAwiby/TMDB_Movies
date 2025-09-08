import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";

const Profile = () => {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white pt-20 px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">👤 Profile</h1>

        <div className="space-y-3 text-left">
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
          className="mt-6 w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
