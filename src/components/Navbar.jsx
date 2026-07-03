import React from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Patients", to: "/patients" },
  { label: "Add Patient", to: "/add-patient" },
  { label: "Medical Records", to: "/medical-records" },
];

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-[#0E2A38] px-8 py-4 flex justify-between items-center border-b border-[#1C3E4E]">
      {/* Logo / brand */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "#1C6E74" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9FD8D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        </div>
        <h1
          className="text-lg font-semibold text-white tracking-tight"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          OPD AI System
        </h1>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: isActive ? "#9FD8D6" : "#8FA3AB",
                background: isActive ? "#15384780" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "#D5E4E6";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "#8FA3AB";
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;