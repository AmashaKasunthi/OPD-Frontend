import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Patients from "../pages/Patients";
import AddPatient from "../pages/AddPatient";
import MedicalRecords from "../pages/MedicalRecords";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/add-patient" element={<AddPatient />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
        </Routes>
    );
}

export default AppRoutes;