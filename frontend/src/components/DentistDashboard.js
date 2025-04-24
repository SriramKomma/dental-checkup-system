import React, { useState, useEffect } from "react";
import axios from "axios";

const DentistDashboard = ({ dentistId }) => {
  const [checkups, setCheckups] = useState([]);
  const [form, setForm] = useState({ notes: "", images: [] });

  useEffect(() => {
    const fetchCheckups = async () => {
      if (!dentistId) {
        alert("Please log in as a dentist first");
        return;
      }
      try {
        const res = await axios.get("http://localhost:5001/api/checkups", {
          params: { dentistId },
        });
        setCheckups(res.data);
      } catch (err) {
        console.error("Error fetching checkups:", err);
      }
    };
    fetchCheckups();
  }, [dentistId]);

  const handleFileChange = (e) => {
    setForm({ ...form, images: e.target.files });
  };

  const handleSubmit = async (checkupId) => {
    const formData = new FormData();
    formData.append("notes", form.notes);
    for (let i = 0; i < form.images.length; i++) {
      formData.append("images", form.images[i]);
    }

    try {
      await axios.post(
        `http://localhost:5001/api/checkups/${checkupId}/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Checkup results updated");
      setForm({ notes: "", images: [] });
      window.location.reload();
    } catch (err) {
      console.error("Error updating checkup:", err);
      alert("Failed to update checkup");
    }
  };

  return (
    <div>
      <h2>Dentist Dashboard</h2>
      {checkups.length === 0 ? (
        <p>No checkups assigned</p>
      ) : (
        checkups.map((checkup) => (
          <div
            key={checkup._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
            }}>
            <p>
              <strong>User ID:</strong> {checkup.userId}
            </p>
            <p>
              <strong>Status:</strong> {checkup.status}
            </p>
            {checkup.status === "pending" && (
              <div>
                <textarea
                  placeholder="Add notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
                <input type="file" multiple onChange={handleFileChange} />
                <button onClick={() => handleSubmit(checkup._id)}>
                  Update Checkup
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DentistDashboard;
