import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Patients from "../pages/Patients";
import AddPatient from "../pages/AddPatient";
import MedicalRecords from "../pages/MedicalRecords";
import ForgotPassword from "../pages/Forgotpassword";
import EditPatient from "../pages/Editpatient";
import RiskAnalysis from "../pages/RiskAnalysis";
import UpdateMedicalRecord from "../pages/UpdateMedicalRecord";
import Help from "../pages/Help";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/add-patient" element={<AddPatient />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/edit-patient/:id" element={<EditPatient />} />
            <Route path="/medical-records/:patientId" element={<MedicalRecords />}/>
            <Route path="/risk-analysis/:patientId" element={<RiskAnalysis />}/>
            <Route path="/update-medical-record/:patientId" element={<UpdateMedicalRecord />}/>
            <Route path="/help" element={<Help />} />
            
        </Routes>
    );
}

export default AppRoutes;