import React from "react";
import { FaUser, FaUserMd, FaTooth } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center items-center mb-4">
          <FaTooth className="text-gray-700 dark:text-gray-300 h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold mb-8 dark:text-white">
          Dental Checkup System
        </h1>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate("/user-login")}
            className="p-4 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 hover:scale-105 transition">
            <FaUser className="mr-2" /> User Login
          </button>
          <button
            onClick={() => navigate("/dentist-login")}
            className="p-4 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600 hover:scale-105 transition">
            <FaUserMd className="mr-2" /> Dentist Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
