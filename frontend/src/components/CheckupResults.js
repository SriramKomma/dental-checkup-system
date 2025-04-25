import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CheckupResults = ({ userId }) => {
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckups = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/checkups", {
          params: { userId },
        });
        setCheckups(res.data);
      } catch (err) {
        console.error("Error fetching checkups:", err);
        alert("Failed to load checkup results");
      } finally {
        setLoading(false);
      }
    };
    fetchCheckups();
  }, [userId]);

  const exportToPDF = async (checkup) => {
    const doc = new jsPDF();
    let yOffset = 10;

    // Add title
    doc.setFontSize(16);
    doc.text(`Checkup Results - ${checkup._id}`, 10, yOffset);
    yOffset += 10;

    // Add notes
    if (checkup.notes) {
      doc.setFontSize(12);
      doc.text("Notes:", 10, yOffset);
      yOffset += 10;
      const splitNotes = doc.splitTextToSize(checkup.notes, 180);
      doc.text(splitNotes, 10, yOffset);
      yOffset += splitNotes.length * 10;
    }

    // Add images
    if (checkup.images && checkup.images.length > 0) {
      doc.setFontSize(12);
      doc.text("Images:", 10, yOffset);
      yOffset += 10;

      for (let i = 0; i < checkup.images.length; i++) {
        const imgUrl = checkup.images[i];
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = imgUrl;
          await new Promise((resolve) => {
            img.onload = resolve;
          });

          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const imgData = canvas.toDataURL("image/jpeg");

          const imgProps = doc.getImageProperties(imgData);
          const pdfWidth = doc.internal.pageSize.getWidth() - 20;
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

          if (yOffset + imgHeight > doc.internal.pageSize.getHeight() - 10) {
            doc.addPage();
            yOffset = 10;
          }

          doc.addImage(imgData, "JPEG", 10, yOffset, pdfWidth, imgHeight);
          yOffset += imgHeight + 10;
        } catch (err) {
          console.error("Error loading image:", err);
          doc.text(`[Image ${i + 1} could not be loaded]`, 10, yOffset);
          yOffset += 10;
        }
      }
    }

    doc.save(`checkup_${checkup._id}.pdf`);
  };

  return (
    <div>
      <h2 className="text-2xl dark:text-white mb-4">Your Checkup Results</h2>
      {loading ? (
        <p className="dark:text-white">Loading checkups...</p>
      ) : checkups.length === 0 ? (
        <p className="dark:text-white">No checkup results available</p>
      ) : (
        <div className="space-y-4">
          {checkups.map((checkup) => (
            <div
              key={checkup._id}
              className="p-4 border rounded dark:border-gray-700 dark:bg-gray-800">
              <p className="dark:text-white">
                <strong>Checkup ID:</strong> {checkup._id}
              </p>
              <p className="dark:text-white">
                <strong>Status:</strong> {checkup.status}
              </p>
              {checkup.notes && (
                <div>
                  <p className="dark:text-white">
                    <strong>Notes:</strong>
                  </p>
                  <p className="dark:text-gray-300">{checkup.notes}</p>
                </div>
              )}
              {checkup.images && checkup.images.length > 0 && (
                <div>
                  <p className="dark:text-white">
                    <strong>Images:</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {checkup.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Checkup image ${index + 1}`}
                        className="w-32 h-32 object-cover rounded"
                        onError={(e) =>
                          (e.target.src = "path/to/placeholder.jpg")
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => exportToPDF(checkup)}
                className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600">
                Export to PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckupResults;
