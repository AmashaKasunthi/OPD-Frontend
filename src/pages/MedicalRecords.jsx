import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function MedicalRecords() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  // ============================================================
  // PATIENT
  // ============================================================

  const [patient, setPatient] = useState(null);

  // ============================================================
  // ALL MEDICAL RECORDS
  // ============================================================

  const [medicalRecords, setMedicalRecords] = useState([]);

  const [loadingRecords, setLoadingRecords] = useState(true);

  // ============================================================
  // NEW MEDICAL RECORD
  // ============================================================

  const [record, setRecord] = useState({
    symptoms: "",
    bloodPressure: "",
    temperature: "",
    heartRate: "",
    notes: "",
    weight: ""
  });

  const [saving, setSaving] = useState(false);

  // ============================================================
  // LOAD PATIENT + MEDICAL RECORDS
  // ============================================================

  useEffect(() => {
    if (patientId) {
      fetchPatient();
      fetchMedicalRecords();
    }
  }, [patientId]);

  // ============================================================
  // FETCH PATIENT
  // ============================================================

  const fetchPatient = async () => {
    try {
      const response = await API.get(`/patients/${patientId}`);

      setPatient(response.data);

    } catch (error) {
      console.error("Error loading patient:", error);

      alert("Unable to load patient information.");
    }
  };

  // ============================================================
  // FETCH ALL MEDICAL RECORDS FOR PATIENT
  // ============================================================

  const fetchMedicalRecords = async () => {
    try {
      setLoadingRecords(true);

      const response = await API.get(
        `/medical-records/patient/${patientId}`
      );

      // Make sure the response is an array
      if (Array.isArray(response.data)) {
        setMedicalRecords(response.data);
      } else {
        setMedicalRecords([]);
      }

    } catch (error) {
      console.error(
        "Error loading medical records:",
        error
      );

      setMedicalRecords([]);

    } finally {
      setLoadingRecords(false);
    }
  };

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRecord((previousRecord) => ({
      ...previousRecord,
      [name]: value
    }));
  };

  // ============================================================
  // SAVE MEDICAL RECORD
  // ============================================================

  const submitRecord = async () => {
    try {
      const userId = localStorage.getItem("userId");

      // --------------------------------------------------------
      // SESSION VALIDATION
      // --------------------------------------------------------

      if (
        !userId ||
        userId === "null" ||
        userId === "undefined"
      ) {
        alert("Session expired. Please login again.");

        navigate("/login");

        return;
      }

      // --------------------------------------------------------
      // BASIC VALIDATION
      // --------------------------------------------------------

      if (!record.symptoms.trim()) {
        alert("Please enter the patient's symptoms.");

        return;
      }

      setSaving(true);

      // --------------------------------------------------------
      // SAVE RECORD
      // --------------------------------------------------------

      await API.post(
        `/medical-records/${patientId}/${userId}`,
        record
      );

      alert("Medical record added successfully.");

      // --------------------------------------------------------
      // CLEAR FORM
      // --------------------------------------------------------

      setRecord({
        symptoms: "",
        bloodPressure: "",
        temperature: "",
        heartRate: "",
        notes: "",
        weight: ""
      });

      // --------------------------------------------------------
      // REFRESH MEDICAL HISTORY
      // --------------------------------------------------------

      await fetchMedicalRecords();

      // --------------------------------------------------------
      // GO TO AI RISK ANALYSIS
      // --------------------------------------------------------

      navigate(`/risk-analysis/${patientId}`);

    } catch (error) {
      console.error(
        "Error saving medical record:",
        error
      );

      if (error.response) {
        console.error(
          "Backend response:",
          error.response.data
        );
      }

      alert("Failed to save medical record.");

    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    try {
      return new Date(date).toLocaleString();

    } catch (error) {
      return "Date not available";
    }
  };

  // ============================================================
  // RISK BADGE
  // ============================================================

  const getRiskStyle = (riskLevel) => {
    if (!riskLevel) {
      return "bg-gray-100 text-gray-600";
    }

    const risk = riskLevel.toUpperCase();

    if (risk === "HIGH") {
      return "bg-red-100 text-red-700 border border-red-200";
    }

    if (risk === "MEDIUM") {
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }

    if (risk === "LOW") {
      return "bg-green-100 text-green-700 border border-green-200";
    }

    return "bg-gray-100 text-gray-600";
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-[#FBF8F3]">

      <Navbar />

      <div className="max-w-5xl mx-auto p-6 md:p-8">

        {/* ======================================================
            PAGE TITLE
        ====================================================== */}

        <div className="mb-6">

          <h2 className="text-3xl font-semibold text-[#0E2A38]">
            Medical Records
          </h2>

          <p className="text-sm text-[#52606A] mt-1">
            Add a new medical record and view the patient's
            previous medical history.
          </p>

        </div>


        {/* ======================================================
            PATIENT INFORMATION
        ====================================================== */}

        {patient && (

          <div className="bg-white border border-[#E8EDEC] rounded-2xl p-5 mb-6 shadow-sm">

            <div className="flex items-center justify-between mb-4">

              <h3 className="text-xl font-semibold text-[#0E2A38]">
                Patient Information
              </h3>

              <span className="text-xs px-3 py-1 rounded-full bg-[#E8F3F3] text-[#1C6E74]">
                Patient
              </span>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">

              <p>
                <strong className="text-[#52606A]">
                  Name:
                </strong>{" "}
                {patient.fullName || "Not available"}
              </p>

              <p>
                <strong className="text-[#52606A]">
                  Patient No:
                </strong>{" "}
                {patient.patientNum || "Not available"}
              </p>

              <p>
                <strong className="text-[#52606A]">
                  Age:
                </strong>{" "}
                {patient.age ?? "Not available"}
              </p>

              <p>
                <strong className="text-[#52606A]">
                  Gender:
                </strong>{" "}
                {patient.gender || "Not available"}
              </p>

              <p>
                <strong className="text-[#52606A]">
                  Contact:
                </strong>{" "}
                {patient.contactNumber || "Not available"}
              </p>

              <p>
                <strong className="text-[#52606A]">
                  Address:
                </strong>{" "}
                {patient.address || "Not available"}
              </p>

            </div>

          </div>
        )}


        {/* ======================================================
            ADD NEW MEDICAL RECORD
        ====================================================== */}

        <div className="bg-white border border-[#E8EDEC] rounded-2xl p-6 shadow-sm">

          <h3 className="text-xl font-semibold text-[#0E2A38] mb-5">
            Add Medical Record
          </h3>


          {/* ----------------------------------------------------
              SYMPTOMS
          ---------------------------------------------------- */}

          <div className="mb-4">

            <label className="block text-sm font-medium text-[#52606A] mb-1.5">
              Symptoms
            </label>

            <textarea
              name="symptoms"
              value={record.symptoms}
              onChange={handleChange}
              placeholder="Enter symptoms, e.g. headache, fever, cough"
              rows={3}
              className="w-full border border-[#D9E0E0] p-3 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#1C6E74]
                         resize-none"
            />

            <p className="text-xs text-gray-400 mt-1">
              Enter symptoms using the names supported by your AI model.
            </p>

          </div>


          {/* ----------------------------------------------------
              BLOOD PRESSURE
          ---------------------------------------------------- */}

          <div className="mb-4">

            <label className="block text-sm font-medium text-[#52606A] mb-1.5">
              Blood Pressure
            </label>

            <input
              type="text"
              name="bloodPressure"
              value={record.bloodPressure}
              onChange={handleChange}
              placeholder="120/80"
              className="w-full border border-[#D9E0E0] p-3 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#1C6E74]"
            />

          </div>


          {/* ----------------------------------------------------
              TEMPERATURE
          ---------------------------------------------------- */}

          <div className="mb-4">

            <label className="block text-sm font-medium text-[#52606A] mb-1.5">
              Temperature (°C)
            </label>

            <input
              type="number"
              step="0.1"
              name="temperature"
              value={record.temperature}
              onChange={handleChange}
              placeholder="37.0"
              className="w-full border border-[#D9E0E0] p-3 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#1C6E74]"
            />

          </div>


          {/* ----------------------------------------------------
              HEART RATE
          ---------------------------------------------------- */}

          <div className="mb-4">

            <label className="block text-sm font-medium text-[#52606A] mb-1.5">
              Heart Rate (BPM)
            </label>

            <input
              type="number"
              name="heartRate"
              value={record.heartRate}
              onChange={handleChange}
              placeholder="72"
              className="w-full border border-[#D9E0E0] p-3 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#1C6E74]"
            />

          </div>


          {/* ----------------------------------------------------
              WEIGHT
          ---------------------------------------------------- */}

          <div className="mb-4">

            <label className="block text-sm font-medium text-[#52606A] mb-1.5">
              Weight (KG)
            </label>

            <input
              type="number"
              name="weight"
              value={record.weight}
              onChange={handleChange}
              placeholder="65"
              className="w-full border border-[#D9E0E0] p-3 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#1C6E74]"
            />

          </div>


          {/* ----------------------------------------------------
              NOTES
          ---------------------------------------------------- */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-[#52606A] mb-1.5">
              Notes
            </label>

            <textarea
              name="notes"
              value={record.notes}
              onChange={handleChange}
              placeholder="Enter additional clinical notes"
              rows={4}
              className="w-full border border-[#D9E0E0] p-3 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#1C6E74]
                         resize-none"
            />

          </div>


          {/* ----------------------------------------------------
              SAVE BUTTON
          ---------------------------------------------------- */}

          <button
            onClick={submitRecord}
            disabled={saving}
            className={`px-6 py-3 rounded-xl font-medium transition ${
              saving
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-[#1C6E74] hover:bg-[#15565B] text-white"
            }`}
          >

            {saving
              ? "Saving Record..."
              : "Save Record & Analyze Risk"}

          </button>

        </div>


        {/* ======================================================
            MEDICAL HISTORY
        ====================================================== */}

        <div className="bg-white border border-[#E8EDEC] rounded-2xl p-6 mt-6 shadow-sm">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-5">

            <div>

              <h3 className="text-2xl font-semibold text-[#0E2A38]">
                Medical History
              </h3>

              <p className="text-sm text-[#52606A] mt-1">
                Previous medical records for this patient
              </p>

            </div>

            <span className="text-sm text-[#52606A]">
              {medicalRecords.length}{" "}
              {medicalRecords.length === 1
                ? "record"
                : "records"}
            </span>

          </div>


          {/* ----------------------------------------------------
              LOADING
          ---------------------------------------------------- */}

          {loadingRecords ? (

            <div className="py-8 text-center">

              <p className="text-gray-500">
                Loading medical records...
              </p>

            </div>

          ) : medicalRecords.length === 0 ? (

            /* --------------------------------------------------
               NO RECORDS
            -------------------------------------------------- */

            <div className="py-8 text-center">

              <p className="text-gray-500">
                No previous medical records found.
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Add the first medical record using the form above.
              </p>

            </div>

          ) : (

            /* --------------------------------------------------
               RECORD LIST
            -------------------------------------------------- */

            <div className="space-y-5">

              {medicalRecords.map(
                (medicalRecord, index) => (

                  <div
                    key={
                      medicalRecord.recordId ||
                      index
                    }
                    className="border border-[#E8EDEC] rounded-xl p-5
                               hover:border-[#B8CCCC] transition"
                  >

                    {/* ------------------------------------------
                        RECORD HEADER
                    ------------------------------------------ */}

                    <div className="flex flex-col md:flex-row
                                    md:items-center
                                    md:justify-between
                                    gap-2 mb-5">

                      <div>

                        <h4 className="text-lg font-semibold text-[#0E2A38]">

                          Medical Record #
                          {medicalRecords.length - index}

                        </h4>

                        <p className="text-xs text-gray-500 mt-1">

                          Consultation Date:{" "}

                          {formatDate(
                            medicalRecord.consultationDate
                          )}

                        </p>

                      </div>


                      {/* RISK */}

                      <span
                        className={`inline-flex w-fit px-3 py-1 rounded-full
                                   text-xs font-semibold
                                   ${getRiskStyle(
                                     medicalRecord.riskLevel
                                   )}`}
                      >

                        {medicalRecord.riskLevel
                          ? medicalRecord.riskLevel.toUpperCase()
                          : "NOT ANALYZED"}

                      </span>

                    </div>


                    {/* ------------------------------------------
                        MEDICAL INFORMATION
                    ------------------------------------------ */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                      {/* Symptoms */}

                      <div className="bg-[#FBF8F3] rounded-xl p-4">

                        <p className="text-xs font-medium
                                      text-gray-500 mb-1">
                          Symptoms
                        </p>

                        <p className="text-sm font-medium
                                      text-[#0E2A38]">
                          {medicalRecord.symptoms ||
                            "Not recorded"}
                        </p>

                      </div>


                      {/* Blood Pressure */}

                      <div className="bg-[#FBF8F3] rounded-xl p-4">

                        <p className="text-xs font-medium
                                      text-gray-500 mb-1">
                          Blood Pressure
                        </p>

                        <p className="text-sm font-medium
                                      text-[#0E2A38]">
                          {medicalRecord.bloodPressure ||
                            "Not recorded"}
                        </p>

                      </div>


                      {/* Temperature */}

                      <div className="bg-[#FBF8F3] rounded-xl p-4">

                        <p className="text-xs font-medium
                                      text-gray-500 mb-1">
                          Temperature
                        </p>

                        <p className="text-sm font-medium
                                      text-[#0E2A38]">

                          {medicalRecord.temperature !==
                            null &&
                          medicalRecord.temperature !==
                            undefined
                            ? `${medicalRecord.temperature} °C`
                            : "Not recorded"}

                        </p>

                      </div>


                      {/* Heart Rate */}

                      <div className="bg-[#FBF8F3] rounded-xl p-4">

                        <p className="text-xs font-medium
                                      text-gray-500 mb-1">
                          Heart Rate
                        </p>

                        <p className="text-sm font-medium
                                      text-[#0E2A38]">

                          {medicalRecord.heartRate !==
                            null &&
                          medicalRecord.heartRate !==
                            undefined
                            ? `${medicalRecord.heartRate} BPM`
                            : "Not recorded"}

                        </p>

                      </div>


                      {/* Weight */}

                      <div className="bg-[#FBF8F3] rounded-xl p-4">

                        <p className="text-xs font-medium
                                      text-gray-500 mb-1">
                          Weight
                        </p>

                        <p className="text-sm font-medium
                                      text-[#0E2A38]">

                          {medicalRecord.weight !==
                            null &&
                          medicalRecord.weight !==
                            undefined
                            ? `${medicalRecord.weight} KG`
                            : "Not recorded"}

                        </p>

                      </div>


                      {/* Predicted Disease */}

                      <div className="bg-[#FBF8F3] rounded-xl p-4">

                        <p className="text-xs font-medium
                                      text-gray-500 mb-1">
                          Predicted Condition
                        </p>

                        <p className="text-sm font-medium
                                      text-[#0E2A38]">

                          {medicalRecord.predictedDisease ||
                            "Not analyzed"}

                        </p>

                      </div>

                    </div>


                    {/* ------------------------------------------
                        NOTES
                    ------------------------------------------ */}

                    {medicalRecord.notes && (

                      <div className="mt-4">

                        <p className="text-xs font-medium
                                      text-gray-500 mb-1">
                          Clinical Notes
                        </p>

                        <div className="bg-[#FBF8F3] rounded-xl p-4">

                          <p className="text-sm text-[#0E2A38] whitespace-pre-line">

                            {medicalRecord.notes}

                          </p>

                        </div>

                      </div>

                    )}


                    {/* ------------------------------------------
                        PRECAUTIONS
                    ------------------------------------------ */}

                    {medicalRecord.precautions && (

                      <div className="mt-4">

                        <p className="text-xs font-medium
                                      text-gray-500 mb-1">
                          AI Precautions
                        </p>

                        <div className="bg-[#FBF8F3] rounded-xl p-4">

                          <p className="text-sm text-[#0E2A38] whitespace-pre-line">

                            {medicalRecord.precautions}

                          </p>

                        </div>

                      </div>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default MedicalRecords;