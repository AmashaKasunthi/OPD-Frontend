import React from "react";
import Navbar from "../components/Navbar";

function Dashboard() {
    const role = localStorage.getItem("role");

    return (
        <div>
            <Navbar />

            <div className="p-8">
                <h1 className="text-4xl font-bold mb-4">
                    Dashboard
                </h1>

                <p className="text-lg text-gray-600">
                    Logged in as: {role}
                </p>

                <div className="grid grid-cols-3 gap-6 mt-8">

                    <div className="bg-white shadow-lg p-6 rounded-xl">
                        <h2 className="text-xl font-bold">Patients</h2>
                        <p>Total Registered Patients</p>
                    </div>

                    <div className="bg-white shadow-lg p-6 rounded-xl">
                        <h2 className="text-xl font-bold">Medical Records</h2>
                        <p>Stored OPD Records</p>
                    </div>

                    <div className="bg-white shadow-lg p-6 rounded-xl">
                        <h2 className="text-xl font-bold">AI Predictions</h2>
                        <p>Risk Analysis Results</p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;