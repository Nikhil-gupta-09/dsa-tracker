import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, provider, db } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Header = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // On load, restore user + theme
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("dsa-user"));
    if (storedUser) setUser(storedUser);

    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.documentElement.classList.toggle("dark", savedMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      };

      setUser(userData);
      localStorage.setItem("dsa-user", JSON.stringify(userData));

      await setDoc(doc(db, "leaderboard", userData.email), {
        ...userData,
        xp: parseInt(localStorage.getItem("xp")) || 0,
      });
    } catch (error) {
      alert("Login failed");
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    localStorage.removeItem("dsa-user");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-white bg-blue-600"
      : "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800";

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-700 dark:text-white">
          DSA Tracker 🚀
        </Link>

        <div className="flex items-center gap-4">
          <nav className="space-x-2 flex items-center">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md font-medium ${isActive("/")}`}
            >
              Home
            </Link>
            <Link
              to="/add"
              className={`px-4 py-2 rounded-md font-medium ${isActive("/add")}`}
            >
              Add Problem
            </Link>
            <Link
              to="/leaderboard"
              className={`px-4 py-2 rounded-md font-medium ${isActive("/leaderboard")}`}
            >
              Leaderboard
            </Link>

            <button
              onClick={toggleDarkMode}
              className="text-sm px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            {user ? (
              <div className="flex items-center gap-2 ml-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm uppercase">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="text-sm text-gray-800 dark:text-white">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login with Google
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
