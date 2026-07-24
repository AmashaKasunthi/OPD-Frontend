import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddNurse() {

  const navigate = useNavigate();

  const [nurse, setNurse] = useState({
    fullName: "",
    email: "",
    password: "",
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
        specialization: ""
      });

      alert("Nurse added successfully.");

      navigate("/view-users");

    } catch (error) {

      console.error(error);

      alert("Failed to add nurse.");

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-gray-100">

      <div className="max-w-3xl mx-auto py-10">

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-3xl font-bold text-green-700 text-center mb-8">
            Add Nurse
          </h2>

          <form onSubmit={saveNurse}>

            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={nurse.fullName}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={nurse.email}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={nurse.password}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Specialization
              </label>

              <input
                type="text"
                name="specialization"
                value={doctor.specialization}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2">
                Contact Number
              </label>

              <input
                type="text"
                name="contactNumber"
                value={nurse.contactNumber}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            <div className="flex gap-4">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? "Saving..." : "Save Nurse"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin-dashboard")}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold"
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