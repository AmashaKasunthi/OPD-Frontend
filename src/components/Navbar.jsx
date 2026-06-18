import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-blue-700 text-white px-8 py-4 flex justify-between items-center shadow-md">
            <h1 className="text-2xl font-bold">OPD AI System</h1>

            <div className="space-x-6">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/patients">Patients</Link>
                <Link to="/add-patient">Add Patient</Link>
                <Link to="/medical-records">Medical Records</Link>
            </div>
        </nav>
    );
}

export default Navbar;