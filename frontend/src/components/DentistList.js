import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTooth } from "react-icons/fa";

const DentistList = ({ userId, onRequestCheckup }) => {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/users/dentists")
      .then((res) => {
        setDentists(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data.msg || "Error fetching dentists");
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl mb-4 dark:text-white flex items-center">
        <FaTooth className="mr-2" /> Available Dentists
      </h2>
      {loading && <p className="text-center dark:text-white">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul className="space-y-4">
        {dentists.map((dentist) => (
          <li
            key={dentist._id}
            className="p-4 border rounded flex justify-between hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">
            <span className="dark:text-white">
              {dentist.name} ({dentist.email})
            </span>
            <button
              onClick={() => onRequestCheckup(dentist._id)}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600 hover:scale-105 transition flex items-center">
              <FaTooth className="mr-2" /> Request Checkup
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DentistList;
