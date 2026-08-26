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

import ProtectedRoute from "./ProtectedRoute";


function AppRoutes() {
    return (
        <Routes>

            {/* =========================
                PUBLIC ROUTES
            ========================== */}

            <Route path="/" element={<Login />} />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
                path="/admin-login"
                element={<AdminLogin />}
            />


            {/* =========================
                DOCTOR / NURSE ROUTES
            ========================== */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["DOCTOR", "NURSE"]}>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/patients"
                element={
                    <ProtectedRoute allowedRoles={["DOCTOR", "NURSE"]}>
                        <Patients />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/add-patient"
                element={
                    <ProtectedRoute allowedRoles={["DOCTOR", "NURSE"]}>
                        <AddPatient />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/medical-records"
                element={
                    <ProtectedRoute allowedRoles={["DOCTOR", "NURSE"]}>
                        <MedicalRecords />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/edit-patient/:id"
                element={
                    <ProtectedRoute allowedRoles={["DOCTOR", "NURSE"]}>
                        <EditPatient />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/medical-records/:patientId"
                element={
                    <ProtectedRoute allowedRoles={["DOCTOR", "NURSE"]}>
                        <MedicalRecords />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/risk-analysis/:patientId"
                element={
                    <ProtectedRoute allowedRoles={["DOCTOR", "NURSE"]}>
                        <RiskAnalysis />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/update-medical-record/:patientId"
                element={
                    <ProtectedRoute allowedRoles={["DOCTOR", "NURSE"]}>
                        <UpdateMedicalRecord />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/help"
                element={
                    <ProtectedRoute allowedRoles={["DOCTOR", "NURSE"]}>
                        <Help />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/reports"
                element={
                    <ProtectedRoute allowedRoles={["DOCTOR", "NURSE"]}>
                        <MonthlyReport />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/annual-report"
                element={
                    <ProtectedRoute allowedRoles={["DOCTOR", "NURSE"]}>
                        <AnnualReport />
                    </ProtectedRoute>
                }
            />


            {/* =========================
                ADMIN ROUTES
            ========================== */}

            <Route
                path="/admin-dashboard"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/add-doctor"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AddDoctor />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/add-nurse"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AddNurse />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/view-users"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <ViewUsers />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/edit-user/:id"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <EditUser />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-reports"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminReports />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default AppRoutes;