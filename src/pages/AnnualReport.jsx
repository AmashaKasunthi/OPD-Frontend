import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { Bar, Doughnut } from "react-chartjs-2";
import API from "../services/api";
import Navbar from "../components/Navbar";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

/* =========================================================
   Design tokens — shared with MonthlyReport so the two
   report pages read as one system.
========================================================= */

const COLORS = {
    ink: "#0F2A28",
    inkSoft: "#4B615F",
    paper: "#F2F6F4",
    line: "#D8E4E1",
    card: "#FFFFFF",
    primary: "#0E4548",
    primaryHover: "#15565B",
    teal: "#1C6E74",
    purple: "#6B3FA0",
    green: "#4F9C74",
    gold: "#C9922E",
    red: "#C24B3F",
};

const DISEASE_COLORS = [
    COLORS.teal,
    COLORS.purple,
    COLORS.gold,
    COLORS.red,
    COLORS.green,
    "#7E57C2",
    "#B77A2E",
    "#3C7D80",
];

const FONT_DISPLAY = "'Space Grotesk', 'Segoe UI', sans-serif";
const FONT_BODY = "'Inter', 'Segoe UI', sans-serif";
const FONT_MONO = "'IBM Plex Mono', 'Courier New', monospace";

const EMPTY_REPORT = {
    totalPatients: 0,
    totalMedicalRecords: 0,
    lowRisk: 0,
    mediumRisk: 0,
    highRisk: 0,
    diseaseCount: {},
    monthlyRecords: {},
};

function useReportFonts() {
    useEffect(() => {
        const id = "opd-report-fonts";
        if (document.getElementById(id)) return;
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500&display=swap";
        document.head.appendChild(link);
    }, []);
}

/* =========================================================
   Signature element — a resting vital-sign trace, shared
   with MonthlyReport. On the annual page it runs the full
   twelve-month span, so the trace itself is a small nod to
   a year of readings rather than a single reading.
========================================================= */
function VitalTrace({ color = COLORS.teal, height = 34 }) {
    return (
        <svg viewBox="0 0 600 40" width="100%" height={height} preserveAspectRatio="none" aria-hidden="true">
            <polyline
                points="0,20 40,20 130,20 148,20 160,4 172,34 184,10 196,20 260,20 280,20 292,4 304,34 316,10 328,20 600,20"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity="0.55"
            />
        </svg>
    );
}

/* ===============================
   Vital card
================================ */
function VitalCard({ label, value, accent }) {
    return (
        <div style={{ background: COLORS.card, borderLeft: `4px solid ${accent}`, padding: "16px 18px" }}>
            <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.08em", color: COLORS.inkSoft, textTransform: "uppercase" }}>
                {label}
            </p>
            <p style={{ margin: "6px 0 0", fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 28, color: COLORS.ink }}>
                {value}
            </p>
        </div>
    );
}

/* ===============================
   Chart card
================================ */
function ChartCard({ eyebrow, title, children }) {
    return (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, padding: "22px 24px 24px" }}>
            <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.08em", color: COLORS.teal, textTransform: "uppercase" }}>
                {eyebrow}
            </p>
            <h2 style={{ margin: "4px 0 18px", fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 18, color: COLORS.ink }}>
                {title}
            </h2>
            {children}
        </div>
    );
}

/* ===============================
   Record table — replaces the
   original DataTable
================================ */
function RecordTable({ eyebrow, title, columns, rows }) {
    return (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, padding: "22px 24px 8px", marginTop: 24 }}>
            <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.08em", color: COLORS.teal, textTransform: "uppercase" }}>
                {eyebrow}
            </p>
            <h2 style={{ margin: "4px 0 16px", fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 18, color: COLORS.ink }}>
                {title}
            </h2>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_MONO, fontSize: 13 }}>
                    <thead>
                        <tr>
                            {columns.map((col, i) => (
                                <th
                                    key={col}
                                    style={{
                                        textAlign: i === 0 ? "left" : "right",
                                        padding: "10px 4px",
                                        borderBottom: `2px solid ${COLORS.ink}`,
                                        color: COLORS.inkSoft,
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        fontSize: 11,
                                    }}
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(([key, value]) => (
                            <tr key={key}>
                                <td style={{ padding: "10px 4px", borderBottom: `1px solid ${COLORS.line}`, color: COLORS.ink }}>
                                    {key}
                                </td>
                                <td style={{ padding: "10px 4px", borderBottom: `1px solid ${COLORS.line}`, color: COLORS.ink, textAlign: "right" }}>
                                    {value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ===============================
   Annual Report
================================ */
export default function AnnualReport() {
    useReportFonts();

    const navigate = useNavigate();
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
        return () => { cancelled = true; };
    }, [year]);

    const monthlyChartData = {
        labels: Object.keys(report.monthlyRecords),
        datasets: [
            {
                label: "Medical records",
                data: Object.values(report.monthlyRecords),
                backgroundColor: COLORS.primary,
                borderRadius: 3,
                maxBarThickness: 28,
            },
        ],
    };

    const diseaseLabels = Object.keys(report.diseaseCount);
    const diseaseChartData = {
        labels: diseaseLabels,
        datasets: [
            {
                label: "Cases",
                data: Object.values(report.diseaseCount),
                backgroundColor: diseaseLabels.map((_, i) => DISEASE_COLORS[i % DISEASE_COLORS.length]),
                borderRadius: 3,
                maxBarThickness: 34,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: COLORS.ink,
                titleFont: { family: FONT_MONO, size: 11 },
                bodyFont: { family: FONT_MONO, size: 12 },
                padding: 10,
            },
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { family: FONT_BODY, size: 11 }, color: COLORS.inkSoft } },
            y: { grid: { color: COLORS.line }, ticks: { font: { family: FONT_MONO, size: 11 }, color: COLORS.inkSoft }, beginAtZero: true },
        },
    };

    const riskChartData = {
        labels: ["Low", "Medium", "High"],
        datasets: [
            {
                data: [report.lowRisk, report.mediumRisk, report.highRisk],
                backgroundColor: [COLORS.green, COLORS.gold, COLORS.red],
                borderColor: COLORS.card,
                borderWidth: 3,
            },
        ],
    };

    const riskChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: {
            legend: {
                position: "bottom",
                labels: { font: { family: FONT_BODY, size: 12 }, color: COLORS.ink, usePointStyle: true, pointStyle: "rectRounded", padding: 16 },
            },
            tooltip: { backgroundColor: COLORS.ink, bodyFont: { family: FONT_MONO, size: 12 }, padding: 10 },
        },
    };

    const vitalCards = [
        { label: "Total patients", value: report.totalPatients, accent: COLORS.primary },
        { label: "Medical records", value: report.totalMedicalRecords, accent: COLORS.teal },
        { label: "Low risk", value: report.lowRisk, accent: COLORS.green },
        { label: "Medium risk", value: report.mediumRisk, accent: COLORS.gold },
        { label: "High risk", value: report.highRisk, accent: COLORS.red },
        { label: "Diseases tracked", value: Object.keys(report.diseaseCount).length, accent: COLORS.purple },
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

    const pageBg = {
        background: COLORS.paper,
        backgroundImage: `linear-gradient(${COLORS.line} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.line} 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
        minHeight: "100vh",
        fontFamily: FONT_BODY,
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ ...pageBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontFamily: FONT_MONO, color: COLORS.inkSoft, fontSize: 13, letterSpacing: "0.06em" }}>
                        LOADING ANNUAL REPORT…
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div style={pageBg}>
                <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 32px 64px" }}>

                    {/* Back */}
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{
                            fontFamily: FONT_MONO,
                            fontSize: 12,
                            letterSpacing: "0.04em",
                            color: COLORS.primary,
                            background: "transparent",
                            border: "none",
                            padding: "6px 0",
                            marginBottom: 24,
                            cursor: "pointer",
                        }}
                    >
                        ← BACK TO DASHBOARD
                    </button>

                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                        <div>
                            <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 12, letterSpacing: "0.12em", color: COLORS.teal }}>
                                OPD · AI SYSTEM
                            </p>
                            <h1 style={{ margin: "6px 0 0", fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 34, color: COLORS.ink }}>
                                Annual report
                            </h1>
                        </div>

                        <button
                            onClick={downloadPDF}
                            style={{
                                fontFamily: FONT_BODY,
                                fontWeight: 500,
                                fontSize: 14,
                                color: "#F2F6F4",
                                background: COLORS.primary,
                                border: "none",
                                padding: "12px 22px",
                                cursor: "pointer",
                                transition: "background-color 0.15s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.primaryHover)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.primary)}
                        >
                            Download PDF
                        </button>
                    </div>

                    <VitalTrace color={COLORS.teal} />

                    {/* Year selector */}
                    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, padding: "18px 20px", marginBottom: 32, maxWidth: 220 }}>
                        <label
                            htmlFor="year"
                            style={{ display: "block", fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.08em", color: COLORS.inkSoft, marginBottom: 8, textTransform: "uppercase" }}
                        >
                            Year
                        </label>
                        <input
                            id="year"
                            type="number"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            style={{
                                fontFamily: FONT_MONO,
                                fontSize: 15,
                                color: COLORS.ink,
                                border: `1px solid ${COLORS.line}`,
                                padding: "8px 10px",
                                width: "100%",
                                outline: "none",
                            }}
                        />
                    </div>

                    {/* Vital cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 1, background: COLORS.line, border: `1px solid ${COLORS.line}`, marginBottom: 40 }}>
                        {vitalCards.map((card) => (
                            <VitalCard key={card.label} {...card} />
                        ))}
                    </div>

                    {/* Monthly + risk */}
                    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24, marginBottom: 24 }}>
                        <ChartCard eyebrow="By month" title="Medical records">
                            <div style={{ height: 280 }}>
                                <Bar data={monthlyChartData} options={barOptions} />
                            </div>
                        </ChartCard>

                        <ChartCard eyebrow="By severity" title="Risk distribution">
                            <div style={{ height: 280 }}>
                                <Doughnut data={riskChartData} options={riskChartOptions} />
                            </div>
                        </ChartCard>
                    </div>

                    {/* Disease chart */}
                    <ChartCard eyebrow="By condition" title="Disease distribution">
                        <div style={{ height: 300 }}>
                            <Bar data={diseaseChartData} options={barOptions} />
                        </div>
                    </ChartCard>

                    {/* Tables */}
                    <RecordTable
                        eyebrow="Full breakdown"
                        title="Disease statistics"
                        columns={["Disease", "Cases"]}
                        rows={Object.entries(report.diseaseCount)}
                    />

                    <RecordTable
                        eyebrow="Full breakdown"
                        title="Monthly record summary"
                        columns={["Month", "Records"]}
                        rows={Object.entries(report.monthlyRecords)}
                    />

                    <p style={{ margin: "24px 0 0", fontFamily: FONT_MONO, fontSize: 11, color: COLORS.inkSoft, letterSpacing: "0.04em" }}>
                        GENERATED {new Date().toLocaleDateString()} · OPD AI SYSTEM
                    </p>

                </div>
            </div>
        </>
    );
}