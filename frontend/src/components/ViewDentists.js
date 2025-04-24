import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewDentists = ({ userId, onSelectDentist }) => {
  const [dentists, setDentists] = useState([]);

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/dentists/available"
        );
        setDentists(res.data);
      } catch (err) {
        console.error("Error fetching dentists:", err);
      }
    };
    fetchDentists();
  }, []);

  return (
    <div>
      <h2>Available Dentists</h2>
      <ul>
        {dentists.map((dentist) => (
          <li key={dentist._id}>
            {dentist.name} ({dentist.email})
            <button onClick={() => onSelectDentist(dentist._id)}>
              Request Checkup
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewDentists;
