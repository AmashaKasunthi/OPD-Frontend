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
import MonthlyReport from "../pages/MonthlyReport";
import AnnualReport from "../pages/AnnualReport";

import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import AddDoctor from "../pages/AddDoctor";
import AddNurse from "../pages/AddNurse";
import ViewUsers from "../pages/ViewUsers";
import EditUser from "../pages/EditUser";
import AdminReports from "../pages/AdminReports";


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
            <Route path="/reports" element={<MonthlyReport />} />
            <Route path="/annual-report" element={<AnnualReport/>} />

            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/add-nurse" element={<AddNurse />} />
            <Route path="/view-users" element={<ViewUsers />} />
            <Route path="/edit-user/:id" element={<EditUser />} />
            <Route path="/admin-reports" element={<AdminReports />} />
           
        </Routes>
    );
}

export default AppRoutes;