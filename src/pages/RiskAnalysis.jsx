import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

// --- Signature element -----------------------------------------------
// Builds an ECG-style waveform whose spikiness encodes the risk level.
// This is the one "loud" element on the page; everything else stays quiet.
function buildWaveformPath(riskLevel) {
    const amp =
        riskLevel === "HIGH" ? 26 : riskLevel === "MEDIUM" ? 15 : 7;

    const unit = `l 14,0 l 6,${-amp * 0.25} l 6,${amp * 0.25} l 9,${-amp} l 7,${amp * 1.7} l 9,${-amp * 0.65} l 18,0 `;

    let d = "M -20,30 ";
    for (let i = 0; i < 9; i++) {
        d += unit;
    }
    return d;
}

const RISK_STYLES = {
    HIGH: {
        label: "High risk",
        text: "text-[#F3D9D5]",
        dot: "bg-[#E2685A]",
        pill: "bg-[#7A2A22] text-[#F6E3DF] border border-[#B4453A]/60",
        stroke: "#E2685A",
    },
    MEDIUM: {
        label: "Medium risk",
        text: "text-[#F1E1C4]",
        dot: "bg-[#D9A343]",
        pill: "bg-[#6B4A16] text-[#F5E9D2] border border-[#BE8A2E]/60",
        stroke: "#D9A343",
    },
    LOW: {
        label: "Low risk",
        text: "text-[#CFE8DA]",
        dot: "bg-[#5FAE86]",
        pill: "bg-[#204A38] text-[#DFF1E6] border border-[#3F7F5C]/60",
        stroke: "#5FAE86",
    },
};

function RiskAnalysis() {
    const { patientId } = useParams();
    const navigate = useNavigate();

    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadResult();
    }, []);

    const loadResult = async () => {
        try {
            const response = await API.get(
                `/medical-records/patient/${patientId}`
            );
            console.log("API Response:", response.data);
            setRecord(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fonts = (
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
            .ra-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
            .ra-body { font-family: 'IBM Plex Sans', sans-serif; }
            .ra-mono { font-family: 'IBM Plex Mono', monospace; }
        `}</style>
    );

    if (loading) {
        return (
            <>
                {fonts}
                <Navbar />
                <div className="ra-body min-h-screen bg-[#F6F4EF] flex items-center justify-center">
                    <div className="flex items-center gap-3 text-[#16302F]/70">
                        <span className="h-2 w-2 rounded-full bg-[#1C6E74] animate-pulse" />
                        <span className="text-sm tracking-wide">
                            Reading vitals…
                        </span>
                    </div>
                </div>
            </>
        );
    }

    if (!record) {
        return (
            <>
                {fonts}
                <Navbar />
                <div className="ra-body min-h-screen bg-[#F6F4EF] flex flex-col items-center justify-center gap-2 px-6 text-center">
                    <h2 className="ra-display text-2xl text-[#16302F]">
                        No result on file
                    </h2>
                    <p className="text-sm text-[#16302F]/60 max-w-sm">
                        This patient doesn&apos;t have an AI risk assessment
                        yet. Run an analysis from their record to see it
                        here.
                    </p>

                    {/* Edit Medical Record */}
    <button
        onClick={() => navigate(`/update-medical-record/${patientId}`)}
        className="ra-body inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 transition-colors text-black text-sm font-medium px-6 py-3 rounded-lg"
    >
        ✏ Edit Medical Record
    </button>
                    <button
                        onClick={() => navigate("/medical-records")}
                        className="mt-4 text-sm font-medium text-[#1C6E74] hover:text-[#0E4548] underline underline-offset-4"
                    >
                        Back to dashboard
                    </button>
                </div>
            </>
        );
    }

    // Normalize risk level from backend (Medium -> MEDIUM)
const riskLevel = (record.riskLevel || "").trim().toUpperCase();

console.log("Risk from API:", record.riskLevel);
console.log("Normalized Risk:", riskLevel);

const risk = RISK_STYLES[riskLevel] || RISK_STYLES.LOW;
const waveform = buildWaveformPath(riskLevel);

    const vitals = [
        { label: "Blood pressure", value: record.bloodPressure, unit: "" },
        { label: "Temperature", value: record.temperature, unit: "°C" },
        { label: "Heart rate", value: record.heartRate, unit: "BPM" },
        { label: "Weight", value: record.weight, unit: "kg" },
    ];

    return (
        <div className="ra-body min-h-screen bg-[#F6F4EF]">
            {fonts}
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* ---- Risk banner: the signature element ---- */}
                <div className="relative overflow-hidden rounded-2xl bg-[#0E4548]">
                    <svg
                        className="absolute inset-x-0 bottom-0 w-full h-16 opacity-40"
                        viewBox="0 0 600 60"
                        preserveAspectRatio="none"
                    >
                        <path
                            d={waveform}
                            fill="none"
                            stroke={risk.stroke}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    <div className="relative px-8 py-10">
                        <p className="ra-mono text-[11px] tracking-[0.2em] uppercase text-[#9FC7C4] mb-4">
                            AI risk assessment · Patient {patientId}
                        </p>

                        <div className="flex items-start justify-between gap-6 flex-wrap">
                            <div>
                                <h1 className="ra-display text-3xl md:text-4xl text-white leading-tight">
                                    {record.predictedDisease}
                                </h1>
                            </div>

                            <span
                                className={`ra-mono inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-wide uppercase ${risk.pill}`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${risk.dot}`}
                                />
                                {risk.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ---- Vitals strip ---- */}
                <div className="mt-6 rounded-2xl bg-white border border-[#E4DFD1] divide-y sm:divide-y-0 sm:divide-x divide-[#E4DFD1] grid grid-cols-2 sm:grid-cols-4">
                    {vitals.map((v) => (
                        <div key={v.label} className="px-6 py-5">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-[#16302F]/45 mb-1">
                                {v.label}
                            </p>
                            <p className="ra-mono text-xl text-[#16302F]">
                                {v.value}
                                {v.unit && (
                                    <span className="text-sm text-[#16302F]/50 ml-1">
                                        {v.unit}
                                    </span>
                                )}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ---- Symptoms / Notes ---- */}
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div className="rounded-2xl bg-white border border-[#E4DFD1] px-6 py-5">
                        <h3 className="text-[11px] uppercase tracking-[0.14em] text-[#16302F]/45 mb-2">
                            Symptoms
                        </h3>
                        <p className="text-[15px] text-[#16302F] leading-relaxed">
                            {record.symptoms}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white border border-[#E4DFD1] px-6 py-5">
                        <h3 className="text-[11px] uppercase tracking-[0.14em] text-[#16302F]/45 mb-2">
                            Notes
                        </h3>
                        <p className="text-[15px] text-[#16302F] leading-relaxed">
                            {record.notes}
                        </p>
                    </div>
                </div>

                {/* ---- Precautions ---- */}
                <div className="mt-6 rounded-2xl bg-white border border-[#E4DFD1] px-6 py-6">
                    <h2 className="ra-display text-xl text-[#0E4548] mb-4">
                        Recommended precautions
                    </h2>
                    <p className="text-[15px] text-[#16302F] leading-relaxed whitespace-pre-line">
                        {record.precautions}
                    </p>
                </div>

                {/* ---- Back ---- */}
                <div className="mt-8 flex justify-start">
                    <button
                        onClick={() => navigate("/medical-records")}
                        className="ra-body inline-flex items-center gap-2 bg-[#1C6E74] hover:bg-[#0E4548] transition-colors text-black text-sm font-medium px-6 py-3 rounded-lg"
                    >
                        ← Back to dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RiskAnalysis;