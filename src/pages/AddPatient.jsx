import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function AddPatient() {
  const [patient, setPatient] = useState({
    patientNum: "",
    fullName: "",
    age: "",
    gender: "",
    contactNumber: "",
    address: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await API.post("/patients", {
        ...patient,
        age: Number(patient.age),
      });
      navigate("/patients");
    } catch (err) {
      console.error("Error adding patient:", err);
      setError("Failed to add patient. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3]" style={{ fontFamily: "Inter, sans-serif" }}>
      <Navbar />

      <div className="max-w-xl mx-auto p-8">
        {/* back button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="group flex items-center gap-2 mb-6 text-sm font-medium text-[#6B7A7E] hover:text-[#1C6E74] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Dashboard
        </button>

        <h2
          className="text-2xl font-semibold text-[#0E2A38] mb-6"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Add Patient
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-sky-200 rounded-2xl border border-[#40a893] p-6 space-y-4"
        >
          {error && (
            <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "#FDEDEB", color: "#9A2F23" }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[#0b0c0c] mb-1.5">
              Patient Number
            </label>
            <input
              type="text"
              name="patientNum"
              value={patient.patientNum}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#3f4141] text-sm text-[#0E2A38] focus:outline-none focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[#0b0c0c] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={patient.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#3f4141] text-sm text-[#0E2A38] focus:outline-none focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#0b0c0c] mb-1.5">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={patient.age}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2.5 rounded-xl border border-[#3f4141] text-sm text-[#0E2A38] focus:outline-none focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#0b0c0c] mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                value={patient.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#3f4141] text-sm text-[#0E2A38] focus:outline-none focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] transition-colors"
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[#0b0c0c] mb-1.5">
              Contact Number
            </label>
            <input
              type="text"
              name="contactNumber"
              value={patient.contactNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#3f4141] text-sm text-[#0E2A38] focus:outline-none focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[#0b0c0c] mb-1.5">
              Address
            </label>
            <textarea
              name="address"
              value={patient.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-[#3f4141] text-sm text-[#0E2A38] focus:outline-none focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#6B7A7E] bg-[#ec6d6d] hover:bg-[#edeaea] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-black bg-[#1C6E74] hover:bg-[#175A5F] transition-colors disabled:opacity-50"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {saving ? "Saving…" : "Save Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPatient;