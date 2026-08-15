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
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setNurse((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const saveNurse = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            // Do not send role from frontend.
            // Backend automatically sets role = NURSE.
            const nurseData = {
                fullName: nurse.fullName.trim(),
                email: nurse.email.trim(),
                password: nurse.password,
                specialization: nurse.specialization.trim(),
                contactNumber: nurse.contactNumber.trim(),
            };

            console.log("Adding nurse:", nurseData);

            const response = await API.post(
                "/admin/nurse",
                nurseData
            );

            console.log("Nurse added successfully:", response.data);

            alert("Nurse added successfully.");

            setNurse({
                fullName: "",
                email: "",
                password: "",
                specialization: "",
                contactNumber: "",
            });

            navigate("/view-users");

        } catch (error) {
            console.error("Error adding nurse:", error);

            if (error.response) {
                console.error(
                    "Backend response:",
                    error.response.data
                );

                if (error.response.data?.message) {
                    setError(error.response.data.message);
                } else if (typeof error.response.data === "string") {
                    setError(error.response.data);
                } else {
                    setError("Failed to add nurse.");
                }
            } else if (error.request) {
                setError(
                    "Cannot connect to the server. Please make sure the Spring Boot backend is running."
                );
            } else {
                setError("Failed to add nurse.");
            }

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

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={saveNurse}>

                        {/* Full Name */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="fullName"
                                value={nurse.fullName}
                                onChange={handleChange}
                                placeholder="Enter nurse full name"
                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={nurse.email}
                                onChange={handleChange}
                                placeholder="Enter nurse email"
                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={nurse.password}
                                onChange={handleChange}
                                placeholder="Enter temporary password"
                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Specialization */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">
                                Specialization
                            </label>

                            <input
                                type="text"
                                name="specialization"
                                value={nurse.specialization}
                                onChange={handleChange}
                                placeholder="e.g. General Nursing"
                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Contact Number */}
                        <div className="mb-6">
                            <label className="block font-semibold mb-2">
                                Contact Number
                            </label>

                            <input
                                type="text"
                                name="contactNumber"
                                value={nurse.contactNumber}
                                onChange={handleChange}
                                placeholder="+94 71 234 5678"
                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
                            >
                                {loading
                                    ? "Saving..."
                                    : "Save Nurse"}
                            </button>

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                    navigate("/admin-dashboard")
                                }
                                className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition"
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