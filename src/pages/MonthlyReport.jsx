import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

function MonthlyReport() {
  const currentDate = new Date();

  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);

  const [report, setReport] = useState({
    totalPatients: 0,
    totalMedicalRecords: 0,
    lowRisk: 0,
    mediumRisk: 0,
    highRisk: 0,
    diseaseCount: {},
  });

  const [loading, setLoading] = useState(true);
  const diseaseChartData = {
    labels: Object.keys(report.diseaseCount),
    datasets: [
      {
        label: "Disease Cases",
        data: Object.values(report.diseaseCount),
        backgroundColor: [
          "#1C6E74",
          "#6B3FA0",
          "#D9A343",
          "#E2685A",
          "#5FAE86",
          "#7E57C2",
          "#FF9800",
        ],
      },
    ],
  };

  const riskChartData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        data: [report.lowRisk, report.mediumRisk, report.highRisk],
        backgroundColor: ["#5FAE86", "#D9A343", "#E2685A"],
      },
    ],
  };

  useEffect(() => {
    loadReport();
  }, [year, month]);

  const loadReport = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        `/reports/monthly?year=${year}&month=${month}`,
      );

      setReport(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("OPD AI System", 14, 20);

    doc.setFontSize(15);
    doc.text("Monthly Report", 14, 30);

    doc.setFontSize(12);

    doc.text(`Year : ${year}`, 14, 40);
    doc.text(`Month : ${month}`, 70, 40);

    autoTable(doc, {
      startY: 50,
      head: [["Category", "Value"]],
      body: [
        ["Total Patients", report.totalPatients],
        ["Medical Records", report.totalMedicalRecords],
        ["Low Risk", report.lowRisk],
        ["Medium Risk", report.mediumRisk],
        ["High Risk", report.highRisk],
      ],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Disease", "Cases"]],
      body: Object.entries(report.diseaseCount),
    });

    doc.save(`Monthly_Report_${year}_${month}.pdf`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          Loading Monthly Report...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-[#0E4548] mb-8">
          Monthly Report
        </h1>

        {/* Filter */}

        <div className="bg-white rounded-xl shadow p-5 mb-8 flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Year</label>

            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Month</label>

            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border rounded-lg p-2"
            >
              {[...Array(12)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {
                    [
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ][index]
                  }
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}

        <div className="grid md:grid-cols-5 gap-5">
          <div className="bg-[#EAF6F5] rounded-xl p-6">
            <h3 className="text-gray-600">Total Patients</h3>

            <p className="text-3xl font-bold mt-2">{report.totalPatients}</p>
          </div>

          <div className="bg-[#F8F3E9] rounded-xl p-6">
            <h3 className="text-gray-600">Medical Records</h3>

            <p className="text-3xl font-bold mt-2">
              {report.totalMedicalRecords}
            </p>
          </div>

          <div className="bg-green-100 rounded-xl p-6">
            <h3 className="text-gray-600">Low Risk</h3>

            <p className="text-3xl font-bold mt-2">{report.lowRisk}</p>
          </div>

          <div className="bg-yellow-100 rounded-xl p-6">
            <h3 className="text-gray-600">Medium Risk</h3>

            <p className="text-3xl font-bold mt-2">{report.mediumRisk}</p>
          </div>

          <div className="bg-red-100 rounded-xl p-6">
            <h3 className="text-gray-600">High Risk</h3>

            <p className="text-3xl font-bold mt-2">{report.highRisk}</p>
          </div>
        </div>
        {/* Charts */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          {/* Disease Distribution */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-5 text-[#0E4548]">
              Disease Distribution
            </h2>

            <Bar data={diseaseChartData} />
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-5 text-[#0E4548]">
              Risk Distribution
            </h2>

            <Pie data={riskChartData} />
          </div>
        </div>
        {/* Download PDF Button */}

        <div className="flex justify-end mt-8">
          <button
            onClick={downloadPDF}
            className="bg-[#0E4548] hover:bg-[#15565B] text-white px-6 py-3 rounded-lg font-semibold"
          >
            Download PDF
          </button>
        </div>
      </div>
    </>
  );
}

export default MonthlyReport;
