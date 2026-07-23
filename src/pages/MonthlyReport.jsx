import React, { useEffect, useState } from "react";
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
import API from "../services/api";
import Navbar from "../components/Navbar";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const COLORS = {
  primary: "#0E4548",
  primaryHover: "#15565B",
  teal: "#1C6E74",
  purple: "#6B3FA0",
  green: "#5FAE86",
  gold: "#D9A343",
  red: "#E2685A",
};

const PIE_COLORS = [COLORS.teal, COLORS.purple, COLORS.gold, COLORS.red, COLORS.green, "#7E57C2", "#FF9800"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const EMPTY_REPORT = {
  totalPatients: 0,
  totalMedicalRecords: 0,
  lowRisk: 0,
  mediumRisk: 0,
  highRisk: 0,
  diseaseCount: {},
};

// Shared presentational helpers, kept consistent with AnnualReport.
function SummaryCard({ label, value, bg }) {
  return (
    <div className={`rounded-xl p-6 ${bg}`}>
      <h3 className="text-gray-600">{label}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-5" style={{ color: COLORS.primary }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function MonthlyReport() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [report, setReport] = useState(EMPTY_REPORT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      setLoading(true);
      try {
        const { data } = await API.get(`/reports/monthly?year=${year}&month=${month}`);
        if (!cancelled) setReport(data);
      } catch (error) {
        console.error("Error loading monthly report:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadReport();
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const diseaseChartData = {
    labels: Object.keys(report.diseaseCount),
    datasets: [{ label: "Disease Cases", data: Object.values(report.diseaseCount), backgroundColor: PIE_COLORS }],
  };

  const riskChartData = {
    labels: ["Low", "Medium", "High"],
    datasets: [{ data: [report.lowRisk, report.mediumRisk, report.highRisk], backgroundColor: [COLORS.green, COLORS.gold, COLORS.red] }],
  };

  const summaryCards = [
    { label: "Total Patients", value: report.totalPatients, bg: "bg-[#EAF6F5]" },
    { label: "Medical Records", value: report.totalMedicalRecords, bg: "bg-[#F8F3E9]" },
    { label: "Low Risk", value: report.lowRisk, bg: "bg-green-100" },
    { label: "Medium Risk", value: report.mediumRisk, bg: "bg-yellow-100" },
    { label: "High Risk", value: report.highRisk, bg: "bg-red-100" },
  ];

  function downloadPDF() {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("OPD AI System", 14, 20);
    doc.setFontSize(15);
    doc.text("Monthly Report", 14, 30);
    doc.setFontSize(12);
    doc.text(`Year : ${year}`, 14, 40);
    doc.text(`Month : ${MONTH_NAMES[month - 1]}`, 70, 40);

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
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">Loading Monthly Report...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8" style={{ color: COLORS.primary }}>
          Monthly Report
        </h1>

        <div className="bg-white rounded-xl shadow p-5 mb-8 flex gap-4">
          <div>
            <label htmlFor="year" className="block text-sm font-medium mb-2">
              Year
            </label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border rounded-lg p-2"
            />
          </div>

          <div>
            <label htmlFor="month" className="block text-sm font-medium mb-2">
              Month
            </label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border rounded-lg p-2"
            >
              {MONTH_NAMES.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-5">
          {summaryCards.map((card) => (
            <SummaryCard key={card.label} {...card} />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          <ChartCard title="Disease Distribution">
            <Bar data={diseaseChartData} />
          </ChartCard>
          <ChartCard title="Risk Distribution">
            <Pie data={riskChartData} />
          </ChartCard>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={downloadPDF}
            className="text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: COLORS.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.primaryHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.primary)}
          >
            Download PDF
          </button>
        </div>
      </div>
    </>
  );
}