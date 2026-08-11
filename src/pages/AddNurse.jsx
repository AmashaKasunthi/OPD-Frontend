import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddNurse() {
  const navigate = useNavigate();

  const [nurse, setNurse] = useState({
    fullName: "",
    email: "",
    password: "",
    specialization: "",
    contactNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setNurse({
      ...nurse,
      [e.target.name]: e.target.value,
    });
  };

  const saveNurse = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await API.post("/admin/users", {
        ...nurse,
        role: "Nurse",
      });

      alert("Nurse added successfully.");

      navigate("/view-users");
    } catch (error) {
      console.error("Error adding nurse:", error);

      alert("Failed to add nurse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="w-[50%] mx-auto py-10">
        {/* Back to Dashboard */}
        <button
          type="button"
          onClick={() => navigate("/admin-dashboard")}
          className="mb-6 bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
        >
          ← Back to Dashboard
        </button>

        <div className="w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-8">
            Add Nurse
          </h2>

          <form onSubmit={saveNurse}>
            {/* Full Name */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Full Name</label>

              <input
                type="text"
                name="fullName"
                value={nurse.fullName}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Email</label>

              <input
                type="email"
                name="email"
                value={nurse.email}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Password</label>

              <input
                type="password"
                name="password"
                value={nurse.password}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            {/* Specialization */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Specialization</label>

              <input
                type="text"
                name="specialization"
                value={nurse.specialization}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            {/* Contact Number */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">Contact Number</label>

              <input
                type="text"
                name="contactNumber"
                value={nurse.contactNumber}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-black py-3 rounded-lg font-semibold"
              >
                {loading ? "Saving..." : "Save Nurse"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin-dashboard")}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-black py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNurse;
