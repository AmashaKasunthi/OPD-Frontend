import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const response = await API.get("/patients");
    setPatients(response.data);
  };

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;
    setDeleting(true);
    try {
      await API.delete(`/patients/${patientToDelete.patientId}`);
      setPatients((prev) =>
        prev.filter((p) => p.patientId !== patientToDelete.patientId)
      );
      setPatientToDelete(null);
    } catch (error) {
      console.error("Error deleting patient:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3]" style={{ fontFamily: "Inter, sans-serif" }}>
      <Navbar />

      <div className="max-w-5xl mx-auto p-8">
        {/* back button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="group flex items-center gap-2 mb-6 text-sm font-medium text-[#6B7A7E] hover:text-[#1C6E74] transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-0.5"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Dashboard
        </button>

        <h2
          className="text-2xl font-semibold text-[#0E2A38] mb-6"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Patients
        </h2>

        <div className="grid gap-4">
          {patients.map((patient) => (
            <div
              key={patient.patientId}
              className="bg-white rounded-2xl border border-[#E8EDEC] p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <h3
                  className="text-lg font-semibold text-[#0E2A38]"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {patient.fullName}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/edit-patient/${patient.patientId}`)}
                    className="p-2 rounded-lg text-[#9AA6AA] hover:text-[#1C6E74] hover:bg-[#E9F3F2] transition-colors"
                    title="Edit patient"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(patient)}
                    className="p-2 rounded-lg text-[#9AA6AA] hover:text-[#9A2F23] hover:bg-[#FDEDEB] transition-colors"
                    title="Delete patient"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-[#6B7A7E]">
                <p>
                  <span className="text-[#9AA6AA]">Patient Number:</span>{" "}
                  {patient.patientNum}
                </p>
                <p>
                  <span className="text-[#9AA6AA]">Age:</span> {patient.age}
                </p>
                <p>
                  <span className="text-[#9AA6AA]">Gender:</span> {patient.gender}
                </p>
                <p>
                  <span className="text-[#9AA6AA]">Contact:</span>{" "}
                  {patient.contactNumber}
                </p>
                <p className="col-span-2">
                  <span className="text-[#9AA6AA]">Address:</span>{" "}
                  {patient.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Delete confirmation modal ── */}
      {patientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#E8EDEC] shadow-xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="px-6 pt-6 pb-4 flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "#FDEDEB", color: "#9A2F23" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
              <div>
                <h3
                  className="text-base font-semibold text-[#0E2A38]"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Delete this patient?
                </h3>
                <p className="text-sm text-[#6B7A7E] mt-1">
                  <strong>{patientToDelete.fullName}</strong> and their
                  records will be permanently removed. This can't be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6 pt-2">
              <button
                onClick={() => setPatientToDelete(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#6B7A7E] bg-[#F4F6F5] hover:bg-[#EAEDEC] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#9A2F23] hover:bg-[#B23A2B] transition-colors disabled:opacity-50"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Patients;