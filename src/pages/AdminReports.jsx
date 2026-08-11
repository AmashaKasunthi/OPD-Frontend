import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminReports() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await API.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const totalDoctors = users.filter((user) => user.role === "Doctor").length;

  const totalNurses = users.filter((user) => user.role === "NURSE").length;

  return (
    <div className="min-h-screen bg-[#F6F8FA] p-8">
      {/* Back to Dashboard */}
      <button
        type="button"
        onClick={() => navigate("/admin-dashboard")}
        className="mb-6 bg-[#0E4548] hover:bg-[#176066] text-white px-5 py-2.5 rounded-lg font-semibold transition"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold text-[#0E4548] mb-8">Admin Reports</h1>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-600">Total Doctors</h2>

          <p className="text-4xl font-bold text-[#1C6E74] mt-4">
            {totalDoctors}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-600">Total Nurses</h2>

          <p className="text-4xl font-bold text-[#1C6E74] mt-4">
            {totalNurses}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-600">Total Users</h2>

          <p className="text-4xl font-bold text-[#1C6E74] mt-4">
            {users.length}
          </p>
        </div>
      </div>

      {/* Report Buttons */}

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-bold mb-3">Monthly Report</h2>

          <p className="text-gray-600 mb-6">
            View and download monthly patient reports.
          </p>

          <button
            onClick={() => navigate("/reports")}
            className="bg-[#0E4548] text-white px-6 py-3 rounded-lg hover:bg-[#176066]"
          >
            Open Monthly Report
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-bold mb-3">Annual Report</h2>

          <p className="text-gray-600 mb-6">
            View and download annual reports.
          </p>

          <button
            onClick={() => navigate("/annual-report")}
            className="bg-[#0E4548] text-white px-6 py-3 rounded-lg hover:bg-[#176066]"
          >
            Open Annual Report
          </button>
        </div>
      </div>

      {/* User Table */}

      <div className="mt-12 bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-5">User Summary</h2>

        <table className="w-full border">
          <thead className="bg-[#0E4548] text-white">
            <tr>
              <th className="p-3">Name</th>

              <th>Email</th>

              <th>Role</th>

              <th>Specialization</th>

              <th>Contact</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.userId} className="text-center border-b">
                <td className="p-3">{user.fullName}</td>

                <td>{user.email}</td>

                <td>{user.role}</td>

                <td>{user.specialization}</td>

                <td>{user.contactNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminReports;
