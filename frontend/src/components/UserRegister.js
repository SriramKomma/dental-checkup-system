import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaTooth } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5001/api/users/register",
        form
      );
      localStorage.setItem("token", res.data.token);
      setError("");
      alert("User registered");
      navigate("/user-login");
    } catch (err) {
      console.error("User Registration Error:", err.response); // Log the full error response
      setError(err.response?.data.msg || "Error registering user");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-center items-center mb-4">
        <FaTooth className="text-gray-700 dark:text-gray-300 h-12 w-12" />
      </div>
      <h2 className="text-2xl mb-4 dark:text-white flex items-center justify-center">
        <FaUser className="mr-2" /> User Register <FaTooth className="ml-2" />
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center border rounded dark:bg-gray-700">
          <FaUser className="m-2 text-gray-500 dark:text-gray-300" />
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 bg-transparent dark:text-white"
          />
        </div>
        <div className="flex items-center border rounded dark:bg-gray-700">
          <FaEnvelope className="m-2 text-gray-500 dark:text-gray-300" />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 bg-transparent dark:text-white"
          />
        </div>
        <div className="flex items-center border rounded dark:bg-gray-700">
          <FaLock className="m-2 text-gray-500 dark:text-gray-300" />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 bg-transparent dark:text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:scale-105 transition flex items-center justify-center">
          <FaUser className="mr-2" /> Register
        </button>
      </form>
    </div>
  );
};

export default UserRegister;
