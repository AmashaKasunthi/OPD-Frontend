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
   Design tokens
   — Subject: an OPD monthly report read by clinicians and
     admin staff. The system leans on the vocabulary of a
     lab report / patient chart rather than a generic SaaS
     dashboard: mono record numbers, tab-indexed months,
     a vital-sign trace as the page's signature mark.
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
];

const FONT_DISPLAY = "'Space Grotesk', 'Segoe UI', sans-serif";
const FONT_BODY = "'Inter', 'Segoe UI', sans-serif";
const FONT_MONO = "'IBM Plex Mono', 'Courier New', monospace";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const MONTH_SHORT = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

const EMPTY_REPORT = {
    totalPatients: 0,
    totalMedicalRecords: 0,
    lowRisk: 0,
    mediumRisk: 0,
    highRisk: 0,
    diseaseCount: {},
};

/* Loads the two display fonts once. Safe to leave in the
   component — the browser dedupes repeated <link> tags. */
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
   Signature element — a resting vital-sign trace.
   Purely decorative, ties the "OPD" clinical subject to the
   page without leaning on medical iconography clichés.
========================================================= */
function VitalTrace({ color = COLORS.teal, height = 34 }) {
    return (
        <svg
            viewBox="0 0 600 40"
            width="100%"
            height={height}
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <polyline
                points="0,20 130,20 148,20 160,4 172,34 184,10 196,20 220,20 600,20"
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
   Vital card — summary metric
================================ */
function VitalCard({ label, value, accent }) {
    return (
        <div
            style={{
                background: COLORS.card,
                borderLeft: `4px solid ${accent}`,
                borderRadius: 0,
                padding: "16px 18px",
            }}
        >
            <p
                style={{
                    margin: 0,
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    color: COLORS.inkSoft,
                    textTransform: "uppercase",
                }}
            >
                {label}
            </p>
            <p
                style={{
                    margin: "6px 0 0",
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 600,
                    fontSize: 30,
                    color: COLORS.ink,
                }}
            >
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
        <div
            style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.line}`,
                padding: "22px 24px 24px",
            }}
        >
            <p
                style={{
                    margin: 0,
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    color: COLORS.teal,
                    textTransform: "uppercase",
                }}
            >
                {eyebrow}
            </p>
            <h2
                style={{
                    margin: "4px 0 18px",
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 600,
                    fontSize: 18,
                    color: COLORS.ink,
                }}
            >
                {title}
            </h2>
            {children}
        </div>
    );
}

/* ===============================
   Monthly Report
================================ */
export default function MonthlyReport() {
    useReportFonts();

    const navigate = useNavigate();
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
                const { data } = await API.get(
                    `/reports/monthly?year=${year}&month=${month}`
                );
                if (!cancelled) setReport(data);
            } catch (error) {
                console.error("Error loading monthly report:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadReport();
        return () => { cancelled = true; };
    }, [year, month]);

    const diseaseLabels = Object.keys(report.diseaseCount);
    const diseaseValues = Object.values(report.diseaseCount);

    const diseaseChartData = {
        labels: diseaseLabels,
        datasets: [
            {
                label: "Cases",
                data: diseaseValues,
                backgroundColor: diseaseLabels.map(
                    (_, i) => DISEASE_COLORS[i % DISEASE_COLORS.length]
                ),
                borderRadius: 3,
                maxBarThickness: 34,
            },
        ],
    };

    const diseaseChartOptions = {
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
            x: {
                grid: { display: false },
                ticks: { font: { family: FONT_BODY, size: 11 }, color: COLORS.inkSoft },
            },
            y: {
                grid: { color: COLORS.line },
                ticks: { font: { family: FONT_MONO, size: 11 }, color: COLORS.inkSoft },
                beginAtZero: true,
            },
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
                labels: {
                    font: { family: FONT_BODY, size: 12 },
                    color: COLORS.ink,
                    usePointStyle: true,
                    pointStyle: "rectRounded",
                    padding: 16,
                },
            },
            tooltip: {
                backgroundColor: COLORS.ink,
                bodyFont: { family: FONT_MONO, size: 12 },
                padding: 10,
            },
        },
    };

    const vitalCards = [
        { label: "Total patients", value: report.totalPatients, accent: COLORS.primary },
        { label: "Medical records", value: report.totalMedicalRecords, accent: COLORS.teal },
        { label: "Low risk", value: report.lowRisk, accent: COLORS.green },
        { label: "Medium risk", value: report.mediumRisk, accent: COLORS.gold },
        { label: "High risk", value: report.highRisk, accent: COLORS.red },
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
                        LOADING MONTHLY REPORT…
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
                                Monthly report
                            </h1>
                        </div>

                        <div style={{ textAlign: "right", fontFamily: FONT_MONO, fontSize: 12, color: COLORS.inkSoft }}>
                            <div>RPT-{year}{String(month).padStart(2, "0")}</div>
                            <div style={{ color: COLORS.inkSoft }}>{MONTH_NAMES[month - 1].toUpperCase()} {year}</div>
                        </div>
                    </div>

                    <VitalTrace color={COLORS.teal} />

                    {/* Selection */}
                    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, padding: "18px 20px", marginBottom: 32 }}>
                        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-end" }}>
                            <div>
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
                                        width: 100,
                                        outline: "none",
                                    }}
                                />
                            </div>

                            <div style={{ flex: 1, minWidth: 280 }}>
                                <label
                                    style={{ display: "block", fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.08em", color: COLORS.inkSoft, marginBottom: 8, textTransform: "uppercase" }}
                                >
                                    Month
                                </label>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {MONTH_SHORT.map((short, index) => {
                                        const active = index + 1 === month;
                                        return (
                                            <button
                                                key={short}
                                                type="button"
                                                onClick={() => setMonth(index + 1)}
                                                aria-pressed={active}
                                                style={{
                                                    fontFamily: FONT_MONO,
                                                    fontSize: 11,
                                                    letterSpacing: "0.05em",
                                                    padding: "7px 10px",
                                                    border: `1px solid ${active ? COLORS.primary : COLORS.line}`,
                                                    background: active ? COLORS.primary : "transparent",
                                                    color: active ? "#F2F6F4" : COLORS.inkSoft,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {short}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vital cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, background: COLORS.line, border: `1px solid ${COLORS.line}`, marginBottom: 40 }}>
                        {vitalCards.map((card) => (
                            <VitalCard key={card.label} {...card} />
                        ))}
                    </div>

                    {/* Charts */}
                    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24, marginBottom: 40 }}>
                        <ChartCard eyebrow="By condition" title="Disease distribution">
                            <div style={{ height: 280 }}>
                                <Bar data={diseaseChartData} options={diseaseChartOptions} />
                            </div>
                        </ChartCard>

                        <ChartCard eyebrow="By severity" title="Risk distribution">
                            <div style={{ height: 280 }}>
                                <Doughnut data={riskChartData} options={riskChartOptions} />
                            </div>
                        </ChartCard>
                    </div>

                    {/* Footer / export */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${COLORS.line}`, paddingTop: 20, flexWrap: "wrap", gap: 12 }}>
                        <p style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 11, color: COLORS.inkSoft, letterSpacing: "0.04em" }}>
                            GENERATED {now.toLocaleDateString()} · OPD AI SYSTEM
                        </p>

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

                </div>
            </div>
        </>
    );
}