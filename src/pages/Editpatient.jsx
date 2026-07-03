import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientNum:"",
    fullName: "",
    age: "",
    gender: "",
    contactNumber: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await API.get(`/patients/${id}`);
      const patient = response.data;
      setFormData({
        patientNum:patient.patientNum || "",
        fullName: patient.fullName || "",
        age: patient.age || "",
        gender: patient.gender || "",
        contactNumber: patient.contactNumber || "",
        address: patient.address || "",
      });
    } catch (err) {
      console.error("Error fetching patient:", err);
      setError("Could not load patient details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await API.put(`/patients/${id}`, {
        ...formData,
        age: Number(formData.age),
      });
      navigate("/patients");
    } catch (err) {
      console.error("Error updating patient:", err);
      setError("Failed to update patient. Please try again.");
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
          onClick={() => navigate("/patients")}
          className="group flex items-center gap-2 mb-6 text-sm font-medium text-[#6B7A7E] hover:text-[#1C6E74] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Patients
        </button>

        <h2
          className="text-2xl font-semibold text-[#0E2A38] mb-6"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Edit Patient Details
        </h2>

        {loading ? (
          <div className="bg-indigo-300 rounded-2xl border border-[#E8EDEC] p-8 text-center text-sm text-[#9AA6AA]">
            Loading patient details…
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-indigo-100 rounded-2xl border border-[#323534] p-6 space-y-4"
          >
            {error && (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "#FDEDEB", color: "#9A2F23" }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#6c6464] mb-1.5">
                Patient Number
              </label>
              <input
                type="text"
                name="patientNum"
                value={formData.patientNum}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#414544] text-sm text-[#0E2A38] focus:outline-none focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#9AA6AA] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#414544] text-sm text-[#0E2A38] focus:outline-none focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#9AA6AA] mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#414544] text-sm text-[#0E2A38] focus:outline-none focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#9AA6AA] mb-1.5">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#414544] text-sm text-[#0E2A38] focus:outline-none focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] transition-colors"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#9AA6AA] mb-1.5">
                Contact Number
              </label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#414544] text-sm text-[#0E2A38] focus:outline-none focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#9AA6AA] mb-1.5">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-[#414544] text-sm text-[#0E2A38] focus:outline-none focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/patients")}
                disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#6B7A7E] bg-[#F4F6F5] hover:bg-[#EAEDEC] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-black bg-[#1C6E74] hover:bg-[#175A5F] transition-colors disabled:opacity-50"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditPatient;