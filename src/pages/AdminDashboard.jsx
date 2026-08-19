import React from "react";
import { useNavigate } from "react-router-dom";
import opdImage from "../assets/opd-admin.png";

const CARDS = [
  {
    title: "Add doctor",
    description: "Register a new doctor",
    route: "/add-doctor",
    code: "DR",
    accent: "#1C6E74",
    tint: "#E4F0EF",
  },
  {
    title: "Add nurse",
    description: "Register a new nurse",
    route: "/add-nurse",
    code: "NR",
    accent: "#3F7F5C",
    tint: "#E5F1E9",
  },
  {
    title: "View users",
    description: "View, edit and delete users",
    route: "/view-users",
    code: "US",
    accent: "#4C6B8A",
    tint: "#E6ECF2",
  },
  {
    title: "Reports",
    description: "Monthly & annual reports",
    route: "/admin-reports",
    code: "RP",
    accent: "#B4763A",
    tint: "#F3E9DC",
  },
];

function AdminDashboard() {
  const navigate = useNavigate();

  const adminName = localStorage.getItem("adminName") || "Administrator";

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      localStorage.removeItem("adminId");
      localStorage.removeItem("adminName");

      // Store logout success message
      sessionStorage.setItem("logoutMessage", "Successfully logged out.");

      navigate("/admin-login");
    }
  };

  const fonts = (
    <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

            .ad-display {
                font-family: 'Fraunces', serif;
                font-optical-sizing: auto;
            }

            .ad-body {
                font-family: 'IBM Plex Sans', sans-serif;
            }

            .ad-mono {
                font-family: 'IBM Plex Mono', monospace;
            }
        `}</style>
  );

  return (
    <div className="ad-body w-full min-h-screen bg-[#F6F4EF]">
      {fonts}

      {/* =========================
                HEADER
            ========================== */}
      <div className="bg-[#0E4548] text-white">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="ad-display text-3xl text-white leading-tight">
              Admin dashboard
            </h1>

            <p className="text-[#CFE3E1] mt-1 text-sm">Welcome, {adminName}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="
                            ad-body
                            text-sm
                            font-medium
                            text-black
                            bg-white
                            border
                            border-white
                            hover:bg-gray-100
                            hover:border-gray-200
                            transition-colors
                            px-5
                            py-2.5
                            rounded-lg
                        "
          >
            Log out
          </button>
        </div>
      </div>

      {/* =========================
                HERO IMAGE
            ========================== */}
      <div className="max-w-7xl mx-auto px-8 pt-8">
        <div className="relative h-64 md:h-72 rounded-2xl overflow-hidden shadow-md">
          {/* Image */}
          <img
            src={opdImage}
            alt="OPD Administration"
            className="w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Hero Text */}
          <div className="absolute inset-0 flex items-center">
            <div className="px-8 md:px-12 text-white">
              <p className="ad-mono text-xs uppercase tracking-[0.2em] text-[#CFE3E1] mb-3">
                Clinical Management
              </p>

              <h2 className="ad-display text-3xl md:text-4xl font-medium">
                OPD Resource Management
              </h2>

              <p className="mt-3 text-white/90 text-sm md:text-base max-w-xl">
                Manage doctors, nurses, users and clinical reports from one
                central administration dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
                DASHBOARD MODULES
            ========================== */}
      <div className="max-w-7xl mx-auto px-8 py-10">
        <h2 className="text-[11px] uppercase tracking-[0.14em] text-[#16302F]/45 mb-6">
          Modules
        </h2>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CARDS.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.route)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(card.route);
                }
              }}
              className="
                                group
                                bg-white
                                rounded-2xl
                                border
                                border-[#E4DFD1]
                                hover:border-[#C9C2AE]
                                hover:shadow-md
                                transition-all
                                cursor-pointer
                                overflow-hidden
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#1C6E74]
                                focus:ring-offset-2
                                focus:ring-offset-[#F6F4EF]
                            "
            >
              {/* Card Accent */}
              <div
                className="h-1.5"
                style={{
                  backgroundColor: card.accent,
                }}
              />

              <div className="p-6">
                {/* Card Code */}
                <div
                  className="
                                        ad-mono
                                        inline-flex
                                        items-center
                                        justify-center
                                        h-11
                                        w-11
                                        rounded-lg
                                        text-sm
                                        font-medium
                                        mb-5
                                    "
                  style={{
                    backgroundColor: card.tint,
                    color: card.accent,
                  }}
                >
                  {card.code}
                </div>

                {/* Card Title */}
                <h3 className="ad-display text-lg text-[#16302F] mb-1">
                  {card.title}
                </h3>

                {/* Card Description */}
                <p className="text-sm text-[#16302F]/60 leading-relaxed">
                  {card.description}
                </p>

                {/* Open */}
                <div
                  className="
                                        ad-mono
                                        mt-5
                                        flex
                                        items-center
                                        gap-1.5
                                        text-xs
                                        uppercase
                                        tracking-wide
                                    "
                  style={{
                    color: card.accent,
                  }}
                >
                  Open
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
