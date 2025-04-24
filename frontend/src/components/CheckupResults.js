import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CheckupResults = ({ userId }) => {
  const [checkups, setCheckups] = useState([]);

  useEffect(() => {
    const fetchCheckups = async () => {
      if (!userId) {
        alert("Please log in as a user first");
        return;
      }
      try {
        const res = await axios.get(
          "http://localhost:5001/api/users/checkups",
          {
            params: { userId },
          }
        );
        setCheckups(res.data);
      } catch (err) {
        console.error("Error fetching checkups:", err);
      }
    };
    fetchCheckups();
  }, [userId]);

  const exportToPDF = async (checkup) => {
    const doc = new jsPDF();
    doc.text(
      `Checkup Results - ${new Date(checkup.date).toLocaleDateString()}`,
      10,
      10
    );
    doc.text(`Dentist: ${checkup.dentistId.name}`, 10, 20);
    doc.text(`Notes: ${checkup.notes || "No notes"}`, 10, 30);

    let yPosition = 40;
    for (const image of checkup.images) {
      try {
        const imgData = await fetch(image).then((res) => res.blob());
        const reader = new FileReader();
        reader.readAsDataURL(imgData);
        reader.onloadend = () => {
          doc.addImage(reader.result, "JPEG", 10, yPosition, 50, 50);
          yPosition += 60;
          if (checkup.images.indexOf(image) === checkup.images.length - 1) {
            doc.save(`checkup-${checkup._id}.pdf`);
          }
        };
      } catch (err) {
        console.error("Error adding image to PDF:", err);
      }
    }

    if (checkup.images.length === 0) {
      doc.save(`checkup-${checkup._id}.pdf`);
    }
  };

  return (
    <div>
      <h2>Checkup Results</h2>
      {checkups.length === 0 ? (
        <p>No checkups found</p>
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
              <strong>Date:</strong> {new Date(checkup.date).toLocaleString()}
            </p>
            <p>
              <strong>Dentist:</strong> {checkup.dentistId.name}
            </p>
            <p>
              <strong>Status:</strong> {checkup.status}
            </p>
            <p>
              <strong>Notes:</strong> {checkup.notes || "No notes"}
            </p>
            <div>
              <strong>Images:</strong>
              {checkup.images.length > 0 ? (
                checkup.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="Checkup"
                    style={{ width: "100px", margin: "5px" }}
                  />
                ))
              ) : (
                <p>No images</p>
              )}
            </div>
            <button onClick={() => exportToPDF(checkup)}>Export to PDF</button>
          </div>
        ))
      )}
    </div>
  );
};

export default CheckupResults;
