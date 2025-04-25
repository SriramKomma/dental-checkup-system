import React, { useState, useEffect } from "react";
import axios from "axios";

const DentistList = ({ userId, onRequestCheckup }) => {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/dentists");
        setDentists(res.data);
      } catch (err) {
        console.error("Error fetching dentists:", err);
        alert("Failed to load dentists");
      } finally {
        setLoading(false);
      }
    };
    fetchDentists();
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-2xl dark:text-white mb-4">Available Dentists</h2>
      {loading ? (
        <p className="dark:text-white">Loading dentists...</p>
      ) : dentists.length === 0 ? (
        <p className="dark:text-white">No dentists available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dentists.map((dentist) => (
            <div
              key={dentist._id}
              className="p-4 border rounded dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-xl dark:text-white">{dentist.name}</h3>
              <p className="dark:text-gray-300">{dentist.email}</p>
              <button
                onClick={() => onRequestCheckup(dentist._id)}
                className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Request Checkup
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DentistList;
