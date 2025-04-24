import React from "react";
import axios from "axios";

const CheckupRequest = ({ userId, dentistId }) => {
  const handleRequest = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/checkup", {
        userId,
        dentistId,
      });
      alert("Checkup requested");
    } catch (err) {
      alert("Error requesting checkup");
    }
  };

  return (
    <button
      onClick={handleRequest}
      className="p-2 bg-green-500 text-white rounded">
      Confirm Request
    </button>
  );
};

export default CheckupRequest;
