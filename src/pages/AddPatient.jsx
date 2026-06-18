import React, { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function AddPatient() {
    const [patient, setPatient] = useState({
        fullName: "",
        age: "",
        gender: "",
        contactNumber: "",
        address: ""
    });

    const handleChange = (e) => {
        setPatient({
            ...patient,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        await API.post("/patients", patient);
        alert("Patient added successfully");
    };

    return (
        <div>
            <Navbar />

            <div className="p-8 max-w-xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Add Patient</h2>

                <input name="fullName" placeholder="Full Name"
                    className="w-full border p-3 rounded mb-4"
                    onChange={handleChange} />

                <input name="age" placeholder="Age"
                    className="w-full border p-3 rounded mb-4"
                    onChange={handleChange} />

                <input name="gender" placeholder="Gender"
                    className="w-full border p-3 rounded mb-4"
                    onChange={handleChange} />

                <input name="contactNumber" placeholder="Contact Number"
                    className="w-full border p-3 rounded mb-4"
                    onChange={handleChange} />

                <input name="address" placeholder="Address"
                    className="w-full border p-3 rounded mb-4"
                    onChange={handleChange} />

                <button
                    onClick={handleSubmit}
                    className="bg-blue-700 text-white px-6 py-3 rounded"
                >
                    Save Patient
                </button>
            </div>
        </div>
    );
}

export default AddPatient;