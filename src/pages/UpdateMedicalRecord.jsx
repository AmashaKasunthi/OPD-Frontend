import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function UpdateMedicalRecord() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);

  const [record, setRecord] = useState({
    recordId: "",
    symptoms: "",
    bloodPressure: "",
    temperature: "",
    heartRate: "",
    weight: "",
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load patient
      const patientResponse = await API.get(`/patients/${patientId}`);
      setPatient(patientResponse.data);

      // Load latest medical record
      const recordResponse = await API.get(
        `/medical-records/patient/${patientId}`
      );

      if (recordResponse.data) {
        setRecord(recordResponse.data);
      }

    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleChange = (e) => {
    setRecord({
      ...record,
      [e.target.name]: e.target.value,
    });
  };

  const updateRecord = async () => {
    try {

      await API.put(
        `/medical-records/${record.recordId}`,
        {
          symptoms: record.symptoms,
          bloodPressure: record.bloodPressure,
          temperature: record.temperature,
          heartRate: record.heartRate,
          weight: record.weight,
          notes: record.notes
        }
      );

      alert("Medical record updated successfully.");

      navigate(`/risk-analysis/${patientId}`);

    } catch (error) {
      console.error(error);
      alert("Failed to update medical record.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3]">
      <Navbar />

      <div className="max-w-3xl mx-auto p-8">

        <h2 className="text-3xl font-semibold text-[#0E2A38] mb-6">
          Update Medical Record
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

          <textarea
            name="symptoms"
            value={record.symptoms || ""}
            onChange={handleChange}
            placeholder="Symptoms"
            rows="3"
            className="w-full border p-3 mb-3 rounded-xl"
          />

          <input
            type="text"
            name="bloodPressure"
            value={record.bloodPressure || ""}
            onChange={handleChange}
            placeholder="Blood Pressure"
            className="w-full border p-3 mb-3 rounded-xl"
          />

          <input
            type="number"
            step="0.1"
            name="temperature"
            value={record.temperature || ""}
            onChange={handleChange}
            placeholder="Temperature"
            className="w-full border p-3 mb-3 rounded-xl"
          />

          <input
            type="number"
            name="heartRate"
            value={record.heartRate || ""}
            onChange={handleChange}
            placeholder="Heart Rate"
            className="w-full border p-3 mb-3 rounded-xl"
          />

          <input
            type="number"
            name="weight"
            value={record.weight || ""}
            onChange={handleChange}
            placeholder="Weight"
            className="w-full border p-3 mb-3 rounded-xl"
          />

          <textarea
            name="notes"
            value={record.notes || ""}
            onChange={handleChange}
            placeholder="Notes"
            rows="4"
            className="w-full border p-3 mb-4 rounded-xl"
          />

          <button
            onClick={updateRecord}
            className="bg-[#1C6E74] hover:bg-[#15565B] text-black px-6 py-3 rounded-xl font-medium"
          >
            Update Record & Analyze Risk
          </button>

        </div>
      </div>
    </div>
  );
}

export default UpdateMedicalRecord;