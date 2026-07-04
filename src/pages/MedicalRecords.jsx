import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function MedicalRecords() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);

  const [record, setRecord] = useState({
    symptoms: "",
    bloodPressure: "",
    temperature: "",
    heartRate: "",
    notes: "",
    weight: ""
  });

  useEffect(() => {
    fetchPatient();
  }, []);

  const fetchPatient = async () => {
    try {
      const response = await API.get(`/patients/${patientId}`);
      setPatient(response.data);
    } catch (error) {
      console.error("Error loading patient:", error);
    }
  };

  const handleChange = (e) => {
    setRecord({
      ...record,
      [e.target.name]: e.target.value
    });
  };

  const submitRecord = async () => {
    try {
      const userId = localStorage.getItem("userId");

      // ✅ SAFE VALIDATION
      if (!userId || userId === "null" || userId === "undefined") {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      await API.post(
        `/medical-records/${patientId}/${userId}`,
        record
      );

      alert("Medical record added successfully");

      navigate(`/risk-analysis/${patientId}`);

    } catch (error) {
      console.error("Error saving record:", error);
      alert("Failed to save medical record");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3]">
      <Navbar />

      <div className="max-w-3xl mx-auto p-8">

        <h2 className="text-3xl font-semibold text-[#0E2A38] mb-6">
          Medical Record
        </h2>

        {patient && (
          <div className="bg-white border border-[#E8EDEC] rounded-2xl p-5 mb-6">
            <h3 className="text-xl font-semibold mb-3">
              Patient Information
            </h3>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <p><strong>Name:</strong> {patient.fullName}</p>
              <p><strong>Patient No:</strong> {patient.patientNum}</p>
              <p><strong>Age:</strong> {patient.age}</p>
              <p><strong>Gender:</strong> {patient.gender}</p>
              <p><strong>Contact:</strong> {patient.contactNumber}</p>
              <p><strong>Address:</strong> {patient.address}</p>
            </div>
          </div>
        )}

        <div className="bg-white border border-[#E8EDEC] rounded-2xl p-6">

          {/* Symptoms */}
          <textarea
            name="symptoms"
            value={record.symptoms}
            onChange={handleChange}
            placeholder="Symptoms"
            rows="3"
            className="w-full border p-3 mb-3 rounded-xl"
          />

          {/* Blood Pressure */}
          <input
            type="text"
            name="bloodPressure"
            value={record.bloodPressure}
            onChange={handleChange}
            placeholder="Blood Pressure (120/80)"
            className="w-full border p-3 mb-3 rounded-xl"
          />

          {/* Temperature */}
          <input
            type="number"
            step="0.1"
            name="temperature"
            value={record.temperature}
            onChange={handleChange}
            placeholder="Temperature (°C)"
            className="w-full border p-3 mb-3 rounded-xl"
          />

          {/* Heart Rate */}
          <input
            type="number"
            name="heartRate"
            value={record.heartRate}
            onChange={handleChange}
            placeholder="Heart Rate (BPM)"
            className="w-full border p-3 mb-3 rounded-xl"
          />

          {/* Weight */}
          <input
            type="number"
            name="weight"
            value={record.weight}
            onChange={handleChange}
            placeholder="Weight (KG)"
            className="w-full border p-3 mb-3 rounded-xl"
          />

          {/* Notes */}
          <textarea
            name="notes"
            value={record.notes}
            onChange={handleChange}
            placeholder="Notes"
            rows="4"
            className="w-full border p-3 mb-4 rounded-xl"
          />

          {/* Submit */}
          <button
            onClick={submitRecord}
            className="bg-[#1C6E74] hover:bg-[#15565B] text-white px-6 py-3 rounded-xl font-medium"
          >
            Save Record & Analyze Risk
          </button>

        </div>
      </div>
    </div>
  );
}

export default MedicalRecords;