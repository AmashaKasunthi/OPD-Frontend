import React, { useState } from "react";
import Navbar from "../components/Navbar";

/**
 * OPD Decision Support System — Dashboard
 *
 * Visual identity: same clinical-monitor language as Login.jsx.
 * Dark teal (#1C6E74) accents on warm off-white (#FBF8F3) canvas.
 * Space Grotesk for headings, Inter for body, JetBrains Mono for data/tags.
 *
 * Sections:
 *  • Greeting bar with live date/time, role badge
 *  • 4 KPI stat cards (Patients, Records, AI Predictions, Pending Reviews)
 *  • Recent Activity feed
 *  • Quick Actions panel
 *  • Upcoming Appointments table
 */

// ── static demo data (replace with real API calls) ──────────────────────────
const STATS = [
  {
    id: "patients",
    label: "Total Patients",
    value: "1,284",
    delta: "+12 today",
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
  {
    id: "records",
    label: "OPD Records",
    value: "5,761",
    delta: "+34 this week",
    deltaUp: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    accent: "#2D6A9F",
    bg: "#EAF1F8",
  },
  {
    id: "ai",
    label: "AI Predictions",
    value: "342",
    delta: "87% accuracy",
    deltaUp: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    accent: "#6B3FA0",
    bg: "#F0EAF8",
  },
  {
    id: "pending",
    label: "Pending Reviews",
    value: "18",
    delta: "3 urgent",
    deltaUp: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    accent: "#C0622A",
    bg: "#FAF0EA",
  },
];

const ACTIVITY = [
  { id: 1, type: "record",  text: "New OPD record added for Patient #P-1042",       time: "2 min ago",  tag: "Record",     tagColor: "#2D6A9F" },
  { id: 2, type: "ai",      text: "AI flagged high-risk: Patient #P-0987 (Diabetes)",time: "14 min ago", tag: "AI Alert",   tagColor: "#6B3FA0" },
  { id: 3, type: "patient", text: "Patient #P-1043 registered by Nurse Priya",       time: "28 min ago", tag: "New Patient", tagColor: "#1C6E74" },
  { id: 4, type: "review",  text: "Dr. Kumar reviewed Prediction #AI-0234",          time: "1 hr ago",   tag: "Review",     tagColor: "#C0622A" },
  { id: 5, type: "record",  text: "OPD Record #R-5760 updated",                      time: "2 hr ago",   tag: "Record",     tagColor: "#2D6A9F" },
];

const APPOINTMENTS = [
  { id: "P-1044", name: "Amara Perera",   age: 34, time: "10:00 AM", doctor: "Dr. Kumar",  status: "Confirmed" },
  { id: "P-1045", name: "Ravi Sandanam",  age: 52, time: "10:30 AM", doctor: "Dr. Fathima", status: "Waiting"   },
  { id: "P-1046", name: "Sita Mendis",    age: 28, time: "11:00 AM", doctor: "Dr. Kumar",  status: "Confirmed" },
  { id: "P-1047", name: "Hassan Rifai",   age: 61, time: "11:30 AM", doctor: "Dr. Fathima", status: "Urgent"    },
  { id: "P-1048", name: "Kumari Jayawardena", age: 45, time: "12:00 PM", doctor: "Dr. Kumar", status: "Confirmed" },
];

const STATUS_STYLE = {
  Confirmed: { bg: "#E9F5EE", text: "#1E6B3D" },
  Waiting:   { bg: "#EAF1F8", text: "#2D6A9F" },
  Urgent:    { bg: "#FDEDEB", text: "#9A2F23" },
};

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
    route: "/register-patient",
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
    route: "/new-record",
  },
  {
    label: "Run AI Analysis",
    desc: "Predict patient risk",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    color: "#6B3FA0",
    route: "/ai-analysis",
  },
  {
    label: "View Reports",
    desc: "OPD statistics & trends",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
    color: "#C0622A",
    route: "/reports",
  },
];

// ── live clock ────────────────────────────────────────────────────────────────
function useClock() {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const role = localStorage.getItem("role") || "STAFF";
  const now  = useClock();
  const [activeTab, setActiveTab] = useState("today");

  const greeting = (() => {
    const h = now.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const dateStr = now.toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", second:"2-digit" });

  const roleLabel = role === "DOCTOR" ? "Doctor" : role === "NURSE" ? "Nurse" : role;
  const roleColor = role === "DOCTOR" ? { bg:"#E9F3F2", text:"#1C6E74" } : { bg:"#EAF1F8", text:"#2D6A9F" };

  return (
    <div className="min-h-screen bg-[#FBF8F3]" style={{ fontFamily:"Inter, sans-serif" }}>
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

      <div className="max-w-[1280px] mx-auto px-6 py-8">

        {/* ── Greeting bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 opd-card">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#FF6F61] opd-pulse" />
              <span className="text-xs tracking-[.16em] uppercase text-[#9AA6AA]" style={{ fontFamily:"JetBrains Mono, monospace" }}>
                Live · OPD System
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-[#0E2A38]" style={{ fontFamily:"Space Grotesk, sans-serif" }}>
              {greeting}, <span className="text-[#1C6E74]">{roleLabel}</span>
            </h1>
            <p className="text-sm text-[#6B7A7E] mt-0.5">{dateStr}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* live clock */}
            <div className="bg-[#0E2A38] text-[#9FD8D6] rounded-xl px-5 py-3 text-center" style={{ fontFamily:"JetBrains Mono, monospace" }}>
              <div className="text-xl font-medium tracking-widest">{timeStr}</div>
              <div className="text-[10px] text-[#6E8B90] tracking-widest mt-0.5 uppercase">Local Time</div>
            </div>
            {/* role badge */}
            <div className="rounded-xl px-4 py-3 text-center" style={{ background: roleColor.bg }}>
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: roleColor.text, fontFamily:"JetBrains Mono, monospace" }}>
                {role}
              </div>
              <div className="text-[10px] text-[#9AA6AA] mt-0.5 uppercase tracking-wide">Role</div>
            </div>
          </div>
        </div>

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s, i) => (
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
              <div className="text-3xl font-bold text-[#0E2A38] mb-1" style={{ fontFamily:"Space Grotesk, sans-serif" }}>
                {s.value}
              </div>
              <div className="text-sm text-[#6B7A7E]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Main grid: Activity + Quick Actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Recent Activity — 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8EDEC] opd-card" style={{ animationDelay:"240ms" }}>
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F0F3F2]">
              <h2 className="font-semibold text-[#0E2A38]" style={{ fontFamily:"Space Grotesk, sans-serif" }}>
                Recent Activity
              </h2>
              <div className="flex gap-1">
                {["today","week"].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className="text-xs px-3 py-1 rounded-lg capitalize transition-colors"
                    style={{
                      background: activeTab===t ? "#1C6E74" : "#F4F6F5",
                      color: activeTab===t ? "white" : "#6B7A7E",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-[#F4F6F5]">
              {ACTIVITY.map((a) => (
                <div key={a.id} className="flex items-start gap-4 px-6 py-4 opd-row transition-colors">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: a.tagColor + "18", color: a.tagColor }}
                  >
                    <span className="text-xs font-bold" style={{ fontFamily:"JetBrains Mono, monospace" }}>
                      {a.tag[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0E2A38]">{a.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: a.tagColor + "18", color: a.tagColor, fontFamily:"JetBrains Mono, monospace" }}
                      >
                        {a.tag}
                      </span>
                      <span className="text-[11px] text-[#9AA6AA]">{a.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-3 border-t border-[#F0F3F2]">
              <button className="text-sm text-[#1C6E74] font-medium hover:underline">
                View all activity →
              </button>
            </div>
          </div>

          {/* Quick Actions — 1/3 width */}
          <div className="bg-white rounded-2xl border border-[#E8EDEC] opd-card" style={{ animationDelay:"300ms" }}>
            <div className="px-6 pt-5 pb-4 border-b border-[#F0F3F2]">
              <h2 className="font-semibold text-[#0E2A38]" style={{ fontFamily:"Space Grotesk, sans-serif" }}>
                Quick Actions
              </h2>
            </div>
            <div className="p-4 grid grid-cols-1 gap-3">
              {QUICK_ACTIONS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => window.location.href = q.route}
                  className="opd-action flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl border border-[#E8EDEC] bg-white"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
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

        {/* ── Appointments table ── */}
        <div className="bg-white rounded-2xl border border-[#E8EDEC] opd-card" style={{ animationDelay:"360ms" }}>
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F0F3F2]">
            <h2 className="font-semibold text-[#0E2A38]" style={{ fontFamily:"Space Grotesk, sans-serif" }}>
              Today's Appointments
            </h2>
            <span
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ background:"#E9F3F2", color:"#1C6E74", fontFamily:"JetBrains Mono, monospace" }}
            >
              {APPOINTMENTS.length} scheduled
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F0F3F2]">
                  {["Patient ID","Name","Age","Time","Doctor","Status"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-[#9AA6AA] font-medium uppercase tracking-wider px-6 py-3"
                      style={{ fontFamily:"JetBrains Mono, monospace" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F6F5]">
                {APPOINTMENTS.map((a) => {
                  const s = STATUS_STYLE[a.status];
                  return (
                    <tr key={a.id} className="opd-row transition-colors cursor-pointer">
                      <td className="px-6 py-4 font-medium text-[#1C6E74]" style={{ fontFamily:"JetBrains Mono, monospace" }}>
                        {a.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#0E2A38]">{a.name}</td>
                      <td className="px-6 py-4 text-[#6B7A7E]">{a.age}</td>
                      <td className="px-6 py-4 text-[#0E2A38]" style={{ fontFamily:"JetBrains Mono, monospace" }}>
                        {a.time}
                      </td>
                      <td className="px-6 py-4 text-[#52606A]">{a.doctor}</td>
                      <td className="px-6 py-4">
                        <span
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{ background: s.bg, color: s.text, fontFamily:"JetBrains Mono, monospace" }}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 border-t border-[#F0F3F2]">
            <button className="text-sm text-[#1C6E74] font-medium hover:underline">
              View full schedule →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}