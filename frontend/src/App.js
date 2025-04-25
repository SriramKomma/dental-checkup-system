import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaUserMd,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaTooth,
} from "react-icons/fa";
import LandingPage from "./components/LandingPage";
import DentistList from "./components/DentistList";
import CheckupResults from "./components/CheckupResults";
import DentistDashboard from "./components/DentistDashboard";

const App = () => {
  const [user, setUser] = useState(null);
  const [dentist, setDentist] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate authenticated user
    setUser({
      id: "mock-user-id",
      name: "Sriram Komma",
      email: "sriram@example.com",
    });
    navigate("/user");

    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.documentElement.classList.toggle("dark", savedDarkMode);
  }, [navigate]);

  const handleLogout = () => {
    setUser(null);
    setDentist(null);
    navigate("/");
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  const handleRequestCheckup = async (dentistId) => {
    try {
      await axios.post("http://localhost:5001/api/users/checkup", {
        userId: user.id,
        dentistId,
      });
      alert("Checkup requested successfully");
    } catch (err) {
      alert(err.response?.data.msg || "Error requesting checkup");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      }`}>
      {(user || dentist) && (
        <nav className="bg-blue-500 dark:bg-gray-800 p-4 text-white flex justify-between items-center">
          <div className="flex items-center">
            <FaTooth className="text-white dark:text-gray-300 h-8 w-8 mr-4" />
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/home")}
                className="flex items-center hover:text-blue-200 transition">
                <FaHome className="mr-2" /> Home
              </button>
              {user && (
                <button
                  onClick={() => navigate("/user")}
                  className="flex items-center hover:text-blue-200 transition">
                  <FaUser className="mr-2" /> User Dashboard
                </button>
              )}
              {dentist && (
                <button
                  onClick={() => navigate("/dentist")}
                  className="flex items-center hover:text-blue-200 transition">
                  <FaUserMd className="mr-2" /> Dentist Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center hover:text-blue-200 transition">
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center">
            {darkMode ? (
              <FaSun className="mr-2" />
            ) : (
              <FaMoon className="mr-2" />
            )}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </nav>
      )}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/home"
            element={
              <div className="text-center">
                <div className="flex justify-center items-center mb-4">
                  <FaTooth className="text-gray-700 dark:text-gray-300 h-12 w-12" />
                </div>
                <h1 className="text-3xl dark:text-white">
                  Dental Checkup System
                </h1>
                {user && (
                  <p className="mt-4 text-xl dark:text-white">
                    Welcome, {user.name}!
                  </p>
                )}
                {dentist && (
                  <p className="mt-4 text-xl dark:text-white">
                    Welcome, Dr. {dentist.name}!
                  </p>
                )}
              </div>
            }
          />
          <Route
            path="/user"
            element={
              user ? (
                <>
                  <DentistList
                    userId={user.id}
                    onRequestCheckup={handleRequestCheckup}
                  />
                  <CheckupResults userId={user.id} />
                </>
              ) : (
                <div className="text-center dark:text-white">
                  <p>Please select a role to access this page.</p>
                  <button
                    onClick={() => navigate("/")}
                    className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Go to Home
                  </button>
                </div>
              )
            }
          />
          <Route
            path="/dentist"
            element={
              dentist ? (
                <DentistDashboard dentistId={dentist.id} />
              ) : (
                <div className="text-center dark:text-white">
                  <p>Please select a role to access this page.</p>
                  <button
                    onClick={() => navigate("/")}
                    className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Go to Home
                  </button>
                </div>
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
