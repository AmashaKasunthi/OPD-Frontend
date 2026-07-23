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

const PIE_COLORS = [COLORS.teal, COLORS.purple, COLORS.green, COLORS.gold, COLORS.red, "#FF9800", "#7E57C2", "#009688"];

const EMPTY_REPORT = {
  totalPatients: 0,
  totalMedicalRecords: 0,
  lowRisk: 0,
  mediumRisk: 0,
  highRisk: 0,
  diseaseCount: {},
  monthlyRecords: {},
};

// Small presentational helpers, defined once instead of repeated per card/table.
function SummaryCard({ label, value, bg }) {
  return (
    <div className={`rounded-xl p-6 ${bg}`}>
      <h3 className="text-gray-600">{label}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function DataTable({ title, columns, rows }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-5" style={{ color: COLORS.primary }}>
        {title}
      </h2>
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ backgroundColor: "#EAF6F5" }}>
            {columns.map((col) => (
              <th key={col} className="border p-3 text-left">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([key, value]) => (
            <tr key={key}>
              <td className="border p-3">{key}</td>
              <td className="border p-3 text-center">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default function AnnualReport() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState(EMPTY_REPORT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAnnualReport() {
      setLoading(true);
      try {
        const { data } = await API.get(`/reports/annual?year=${year}`);
        if (!cancelled) setReport(data);
      } catch (error) {
        console.error("Error loading annual report:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAnnualReport();
    return () => {
      cancelled = true;
    };
  }, [year]);

  const monthlyChartData = {
    labels: Object.keys(report.monthlyRecords),
    datasets: [{ label: "Medical Records", data: Object.values(report.monthlyRecords), backgroundColor: COLORS.teal }],
  };

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
    { label: "Diseases", value: Object.keys(report.diseaseCount).length, bg: "bg-blue-100" },
  ];

  function downloadPDF() {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("OPD AI System", 14, 20);
    doc.setFontSize(16);
    doc.text("Annual Report", 14, 32);
    doc.setFontSize(12);
    doc.text(`Year : ${year}`, 14, 42);

    autoTable(doc, {
      startY: 52,
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
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Disease", "Cases"]],
      body: Object.entries(report.diseaseCount),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Month", "Medical Records"]],
      body: Object.entries(report.monthlyRecords),
    });

    doc.save(`Annual_Report_${year}.pdf`);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">Loading Annual Report...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
            Annual Report
          </h1>

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

        <div className="bg-white rounded-xl shadow p-6 mb-8 w-64">
          <label htmlFor="year" className="block text-sm font-semibold mb-2">
            Select Year
          </label>
          <input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="grid md:grid-cols-6 gap-5 mb-10">
          {summaryCards.map((card) => (
            <SummaryCard key={card.label} {...card} />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <ChartCard title="Monthly Medical Records">
            <Bar data={monthlyChartData} />
          </ChartCard>
          <ChartCard title="Risk Distribution">
            <Pie data={riskChartData} />
          </ChartCard>
        </div>

        <div className="mt-8">
          <ChartCard title="Disease Distribution">
            <Bar data={diseaseChartData} />
          </ChartCard>
        </div>

        <DataTable title="Disease Statistics" columns={["Disease", "Cases"]} rows={Object.entries(report.diseaseCount)} />
        <DataTable title="Monthly Record Summary" columns={["Month", "Records"]} rows={Object.entries(report.monthlyRecords)} />
      </div>
    </>
  );
}