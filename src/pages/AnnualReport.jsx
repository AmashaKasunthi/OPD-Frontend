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
    Legend
);

function AnnualReport() {

    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [loading, setLoading] = useState(true);

    const [report, setReport] = useState({
        totalPatients: 0,
        totalMedicalRecords: 0,
        lowRisk: 0,
        mediumRisk: 0,
        highRisk: 0,
        diseaseCount: {},
        monthlyRecords: {}
    });

    useEffect(() => {
        loadAnnualReport();
    }, [year]);

    const loadAnnualReport = async () => {

        try {

            setLoading(true);

            const response = await API.get(
                `/reports/annual?year=${year}`
            );

            setReport(response.data);

        } catch (error) {

            console.error("Error loading annual report:", error);

        } finally {

            setLoading(false);

        }

    };

    

    const monthlyChartData = {

        labels: Object.keys(report.monthlyRecords),

        datasets: [
            {
                label: "Medical Records",
                data: Object.values(report.monthlyRecords),
                backgroundColor: "#1C6E74"
            }
        ]

    };

    const diseaseChartData = {

        labels: Object.keys(report.diseaseCount),

        datasets: [
            {
                label: "Disease Cases",

                data: Object.values(report.diseaseCount),

                backgroundColor: [
                    "#1C6E74",
                    "#6B3FA0",
                    "#5FAE86",
                    "#D9A343",
                    "#E2685A",
                    "#FF9800",
                    "#7E57C2",
                    "#009688"
                ]
            }
        ]

    };

    const riskChartData = {

        labels: ["Low", "Medium", "High"],

        datasets: [
            {
                data: [
                    report.lowRisk,
                    report.mediumRisk,
                    report.highRisk
                ],

                backgroundColor: [
                    "#5FAE86",
                    "#D9A343",
                    "#E2685A"
                ]
            }
        ]

    };

    const downloadPDF = () => {

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
                ["High Risk", report.highRisk]
            ]
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [["Disease", "Cases"]],
            body: Object.entries(report.diseaseCount)
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [["Month", "Medical Records"]],
            body: Object.entries(report.monthlyRecords)
        });

        doc.save(`Annual_Report_${year}.pdf`);

    };

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="flex justify-center items-center h-screen">
                    Loading Annual Report...
                </div>
            </>
        );

    }

            return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto p-8">

                {/* Header */}

                <div className="flex justify-between items-center mb-8">

                    <h1 className="text-3xl font-bold text-[#0E4548]">
                        Annual Report
                    </h1>

                    <button
                        onClick={downloadPDF}
                        className="bg-[#0E4548] hover:bg-[#15565B] text-white px-6 py-3 rounded-lg font-semibold"
                    >
                        Download PDF
                    </button>

                </div>

                {/* Year Filter */}

                <div className="bg-white rounded-xl shadow p-6 mb-8 w-64">

                    <label className="block text-sm font-semibold mb-2">
                        Select Year
                    </label>

                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full border rounded-lg p-2"
                    />

                </div>

                {/* Summary Cards */}

                <div className="grid md:grid-cols-6 gap-5 mb-10">

                    <div className="bg-[#EAF6F5] rounded-xl p-6">

                        <h3 className="text-gray-600">
                            Total Patients
                        </h3>

                        <p className="text-3xl font-bold mt-2">
                            {report.totalPatients}
                        </p>

                    </div>

                    <div className="bg-[#F8F3E9] rounded-xl p-6">

                        <h3 className="text-gray-600">
                            Medical Records
                        </h3>

                        <p className="text-3xl font-bold mt-2">
                            {report.totalMedicalRecords}
                        </p>

                    </div>

                    <div className="bg-green-100 rounded-xl p-6">

                        <h3 className="text-gray-600">
                            Low Risk
                        </h3>

                        <p className="text-3xl font-bold mt-2">
                            {report.lowRisk}
                        </p>

                    </div>

                    <div className="bg-yellow-100 rounded-xl p-6">

                        <h3 className="text-gray-600">
                            Medium Risk
                        </h3>

                        <p className="text-3xl font-bold mt-2">
                            {report.mediumRisk}
                        </p>

                    </div>

                    <div className="bg-red-100 rounded-xl p-6">

                        <h3 className="text-gray-600">
                            High Risk
                        </h3>

                        <p className="text-3xl font-bold mt-2">
                            {report.highRisk}
                        </p>

                    </div>

                    <div className="bg-blue-100 rounded-xl p-6">

                        <h3 className="text-gray-600">
                            Diseases
                        </h3>

                        <p className="text-3xl font-bold mt-2">
                            {Object.keys(report.diseaseCount).length}
                        </p>

                    </div>

                </div>

                {/* Charts */}

                <div className="grid lg:grid-cols-2 gap-8">

                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-xl font-semibold mb-5 text-[#0E4548]">
                            Monthly Medical Records
                        </h2>

                        <Bar data={monthlyChartData} />

                    </div>

                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-xl font-semibold mb-5 text-[#0E4548]">
                            Risk Distribution
                        </h2>

                        <Pie data={riskChartData} />

                    </div>

                </div>

                {/* Disease Chart */}

                <div className="bg-white rounded-xl shadow p-6 mt-8">

                    <h2 className="text-xl font-semibold mb-5 text-[#0E4548]">
                        Disease Distribution
                    </h2>

                    <Bar data={diseaseChartData} />

                </div>

                {/* Disease Table */}

                <div className="bg-white rounded-xl shadow p-6 mt-8">

                    <h2 className="text-xl font-semibold mb-5 text-[#0E4548]">
                        Disease Statistics
                    </h2>

                    <table className="w-full border-collapse">

                        <thead>

                            <tr className="bg-[#EAF6F5]">

                                <th className="border p-3 text-left">
                                    Disease
                                </th>

                                <th className="border p-3">
                                    Cases
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {Object.entries(report.diseaseCount).map(([disease, count]) => (

                                <tr key={disease}>

                                    <td className="border p-3">
                                        {disease}
                                    </td>

                                    <td className="border p-3 text-center">
                                        {count}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                {/* Monthly Records Table */}

                <div className="bg-white rounded-xl shadow p-6 mt-8">

                    <h2 className="text-xl font-semibold mb-5 text-[#0E4548]">
                        Monthly Record Summary
                    </h2>

                    <table className="w-full border-collapse">

                        <thead>

                            <tr className="bg-[#EAF6F5]">

                                <th className="border p-3 text-left">
                                    Month
                                </th>

                                <th className="border p-3">
                                    Records
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {Object.entries(report.monthlyRecords).map(([month, count]) => (

                                <tr key={month}>

                                    <td className="border p-3">
                                        {month}
                                    </td>

                                    <td className="border p-3 text-center">
                                        {count}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </>
    );
}

export default AnnualReport;
