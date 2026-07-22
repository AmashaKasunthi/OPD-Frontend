import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const STATS = [];
const QUICK_ACTIONS = [
  {
    label: "Register Patient",
    desc: "Add a new OPD patient",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
        <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
      </svg>
    ),
    color: "#1C6E74",
    route: "/add-patient",
  },
  {
    label: "New OPD Record",
    desc: "Create a medical record",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    ),
    color: "#2D6A9F",
    route: "/medical-records",
  },
  {
  label: "Monthly Report",
  desc: "View patient statistics",
  icon: (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 19h16M7 16V8M12 16V5M17 16v-3" />
    </svg>
  ),
  color: "#1C6E74",
  route: "/reports",
},
{
  label: "Annual Report",
  desc: "View yearly patient statistics",
  icon: (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 19h16M6 15l3-3 2 2 5-5 2 2" />
    </svg>
  ),
  color: "#0F766E",
  route: "/annual-report",
},
  {
  label: "Help Section",
  desc: "View user guide and system instructions",
  icon: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  color: "#6B3FA0",
  route: "/help",
}
];

// ── live clock ────────────────────────────────────────────────────────────────
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const role = localStorage.getItem("role") || "STAFF";
  const now = useClock();
  const [activeTab, setActiveTab] = useState("today");
  const [patients, setPatients] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const [totalRecords, setTotalRecords] = useState(0);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/");
  };

  const dashboardStats = [
    {
      id: "patients",
      label: "Total Patients",
      value: totalPatients,
      delta: `${recentPatients.length} recent`,
      deltaUp: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      accent: "#1C6E74",
      bg: "#E9F3F2",
    },
    ...STATS.filter((s) => s.id !== "patients"),
    {
  id: "records",
  label: "Medical Records",
  value: totalRecords,
  delta: "Total OPD Records",
  deltaUp: true,
  icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  accent: "#2D6A9F",
  bg: "#EAF1F8",
},
  ];

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/patients");

      const patientData = response.data;

      setPatients(patientData);
      setTotalPatients(patientData.length);

      const recent = [...patientData]
        .sort((a, b) => b.patientId - a.patientId)
        .slice(0, 5);

      setRecentPatients(recent);
      // Fetch medical records
    const recordResponse = await axios.get(
      "http://localhost:8080/api/medical-records"
    );

    setTotalRecords(recordResponse.data.length);

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};


  const greeting = (() => {
    const h = now.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const roleLabel = role === "DOCTOR" ? "Doctor" : role === "NURSE" ? "Nurse" : role;
  const roleColor = role === "DOCTOR" ? { bg: "#E9F3F2", text: "#1C6E74" } : { bg: "#EAF1F8", text: "#2D6A9F" };

  return (
    <div className="min-h-screen bg-[#FBF8F3]" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
        @keyframes fade-in-up {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%     { opacity:.4; transform:scale(.85); }
        }
        .opd-card { animation: fade-in-up .35s ease-out both; }
        .opd-pulse { animation: pulse-dot 1.8s ease-in-out infinite; }
        .opd-action:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.08); }
        .opd-action { transition: transform .18s ease, box-shadow .18s ease; }
        .opd-row:hover { background: #F4F8F7; }
      `}</style>

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Greeting bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 opd-card">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#FF6F61] opd-pulse" />
              <span className="text-xs tracking-[.16em] uppercase text-[#9AA6AA]" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                Live · OPD System
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-[#0E2A38]" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              {greeting}, <span className="text-[#1C6E74]">{roleLabel}</span>
            </h1>
            <p className="text-sm text-[#6B7A7E] mt-0.5">{dateStr}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* live clock */}
            <div className="bg-[#0E2A38] text-[#9FD8D6] rounded-xl px-5 py-3 text-center" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              <div className="text-xl font-medium tracking-widest">{timeStr}</div>
              <div className="text-[10px] text-[#6E8B90] tracking-widest mt-0.5 uppercase">Local Time</div>
            </div>
            {/* role badge */}
            <div className="rounded-xl px-4 py-3 text-center" style={{ background: roleColor.bg }}>
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: roleColor.text, fontFamily: "JetBrains Mono, monospace" }}>
                {role}
              </div>
              <div className="text-[10px] text-[#9AA6AA] mt-0.5 uppercase tracking-wide">Role</div>
            </div>
            {/* logout button */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 rounded-xl px-4 py-3 border border-[#3A1E22] bg-[#2A1418] text-[#E38B93] hover:bg-[#3A1A1F] hover:border-[#E38B93]/40 transition-colors"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              <LogOut className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Logout
              </span>
            </button>
          </div>
        </div>

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dashboardStats.map((s, i) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-5 border border-[#E8EDEC] opd-card"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg, color: s.accent }}>
                  {s.icon}
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    background: s.deltaUp ? "#E9F5EE" : "#FDEDEB",
                    color: s.deltaUp ? "#1E6B3D" : "#9A2F23",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {s.delta}
                </span>
              </div>
              <div className="text-3xl font-bold text-[#0E2A38] mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                {s.value}
              </div>
              <div className="text-sm text-[#6B7A7E]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Main grid: Activity + Quick Actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Recent Activity — 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8EDEC] opd-card" style={{ animationDelay: "240ms" }}>
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F0F3F2]">
              <h2 className="font-semibold text-[#0E2A38]" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Recent Activity
              </h2>
              <div className="flex gap-1">
                {["today", "week"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className="text-xs px-3 py-1 rounded-lg capitalize transition-colors"
                    style={{
                      background: activeTab === t ? "#1C6E74" : "#F4F6F5",
                      color: activeTab === t ? "white" : "#6B7A7E",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-[#F4F6F5]">
              {recentPatients.length > 0 ? (
                recentPatients.map((patient) => (
                  <div
                    key={patient.patientId}
                    className="flex items-start gap-4 px-6 py-4 opd-row transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: "#1C6E7418",
                        color: "#1C6E74",
                      }}
                    >
                      <span
                        className="text-xs font-bold"
                        style={{ fontFamily: "JetBrains Mono, monospace" }}
                      >
                        P
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#0E2A38]">
                        New Patient Added
                        <strong>
                          {" "}
                          {patient.firstName} {patient.lastName}
                        </strong>
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: "#1C6E7418",
                            color: "#1C6E74",
                            fontFamily: "JetBrains Mono, monospace",
                          }}
                        >
                          Patient
                        </span>

                        <span className="text-[11px] text-[#9AA6AA]">
                          ID : {patient.patientId}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No Recent Activity
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/patients")}
              className="text-sm text-[#1C6E74] font-medium hover:underline"
            >
              View all activity →
            </button>
          </div>

          {/* Quick Actions — 1/3 width */}
          <div className="bg-white rounded-2xl border border-[#E8EDEC] opd-card" style={{ animationDelay: "300ms" }}>
            <div className="px-6 pt-5 pb-4 border-b border-[#F0F3F2]">
              <h2 className="font-semibold text-[#0E2A38]" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Quick Actions
              </h2>
            </div>
            <div className="p-4 grid grid-cols-1 gap-3">
              {QUICK_ACTIONS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => (window.location.href = q.route)}
                  className="opd-action flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl border border-[#E8EDEC] bg-white"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: q.color + "15", color: q.color }}
                  >
                    {q.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0E2A38]">{q.label}</div>
                    <div className="text-xs text-[#9AA6AA]">{q.desc}</div>
                  </div>
                  <svg className="ml-auto text-[#C9D4D5]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Logout confirmation modal ── */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          style={{ animation: "fade-in-up .2s ease-out both" }}
        >
          <div className="bg-amber-200 rounded-2xl border border-[#E8EDEC] shadow-xl w-full max-w-sm mx-4 overflow-hidden">
            {/* header */}
            <div className="px-6 pt-6 pb-4 flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "#FDEDEB", color: "#9A2F23" }}
              >
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3
                  className="text-base font-semibold text-[#0E2A38]"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Log out of OPD System?
                </h3>
                <p className="text-sm text-[#6B7A7E] mt-1">
                  You'll need to sign in again to access the dashboard.
                </p>
              </div>
            </div>

            {/* actions */}
            <div className="flex gap-3 px-6 pb-6 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#6B7A7E] bg-[#bce9d2] hover:bg-[#5f8e7f] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-500 bg-[#0E2A38] hover:bg-[#163B4D] transition-colors"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}