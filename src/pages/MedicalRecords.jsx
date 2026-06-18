import React, { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function MedicalRecords() {
    const [record, setRecord] = useState({
        symptoms: "",
        bloodPressure: "",
        temperature: "",
        heartRate: "",
        diagnosis: "",
        riskLevel: ""
    });

    const handleChange = (e) => {
        setRecord({
            ...record,
            [e.target.name]: e.target.value
        });
    };

    const submitRecord = async () => {
        await API.post("/medical-records/1/2", record);
        alert("Medical record added successfully");
    };

    return (
        <div>
            <Navbar />

            <div className="p-8 max-w-xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Medical Record</h2>

                <input name="symptoms" placeholder="Symptoms"
                    className="w-full border p-3 rounded mb-4"
                    onChange={handleChange} />

                <input name="bloodPressure" placeholder="Blood Pressure"
                    className="w-full border p-3 rounded mb-4"
                    onChange={handleChange} />

                <input name="temperature" placeholder="Temperature"
                    className="w-full border p-3 rounded mb-4"
                    onChange={handleChange} />

                <input name="heartRate" placeholder="Heart Rate"
                    className="w-full border p-3 rounded mb-4"
                    onChange={handleChange} />

                <input name="diagnosis" placeholder="Diagnosis"
                    className="w-full border p-3 rounded mb-4"
                    onChange={handleChange} />

                <input name="riskLevel" placeholder="Risk Level"
                    className="w-full border p-3 rounded mb-4"
                    onChange={handleChange} />

                <button
                    onClick={submitRecord}
                    className="bg-blue-700 text-white px-6 py-3 rounded"
                >
                    Save Record
                </button>
            </div>
        </div>
    );
}

export default MedicalRecords;