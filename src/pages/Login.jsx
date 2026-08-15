import React, { useState, useEffect, useRef } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

/**
 * OPD Decision Support System — Login
 *
 * Visual identity: a clinical-monitor split screen. The left panel carries
 * a continuously animated ECG waveform (the product's signature element —
 * a decision-support system runs on signal, this is the one screen where
 * that's made literal). The right panel is the actual sign-in surface.
 *
 * New functional additions vs. the original:
 *  - Segmented role selector (Doctor / Nurse) instead of a <select>, so the
 *    active role is visually obvious at a glance.
 *  - Inline error banner instead of alert() — alerts block the thread and
 *    look unprofessional in a clinical tool.
 *  - Password visibility toggle.
 *  - Caps Lock warning on the password field (a real source of failed
 *    logins in shared hospital workstations).
 *  - "Remember my email & role" — persists non-sensitive fields only.
 *  - Loading state on the button so double-submits can't happen while the
 *    request is in flight.
 *  - "Forgot password?" link (wire to your reset route).
 */

const ROLES = [
  { value: "DOCTOR", label: "Doctor", tag: "MD" },
  { value: "NURSE", label: "Nurse", tag: "RN" },
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const mountedRef = useRef(false);

  // Restore remembered (non-sensitive) fields on mount
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const savedEmail = localStorage.getItem("opd_remember_email");
    const savedRole = localStorage.getItem("opd_remember_role");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    if (savedRole) setRole(savedRole);
  }, []);

  const handleCapsLock = (e) => {
    if (typeof e.getModifierState === "function") {
      setCapsLockOn(e.getModifierState("CapsLock"));
    }
  };

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    if (!role) {
      setError("Select whether you're signing in as a Doctor or Nurse.");
      return;
    }

    setLoading(true);
    try {
      // Doctor/Nurse accounts live in the "users" table — this is a
      // separate endpoint from the Admin Console login, which checks the
      // "admin" table instead. Don't point this at /auth/login.
      const response = await API.post("/auth/staff-login", {
        email,
        password,
        role,
      });

      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.userId);
      // DEBUG (IMPORTANT)
      console.log("userId:", response.data.userId);

      if (rememberMe) {
        localStorage.setItem("opd_remember_email", email);
        localStorage.setItem("opd_remember_role", role);
      } else {
        localStorage.removeItem("opd_remember_email");
        localStorage.removeItem("opd_remember_role");
      }

      if (response.data.role === "DOCTOR" || response.data.role === "NURSE") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid email, password, or role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FBF8F3] font-[Inter]">
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

                @keyframes ecg-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.35; transform: scale(0.85); }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .opd-ecg-track {
                    animation: ecg-scroll 4.5s linear infinite;
                }
                .opd-pulse-dot {
                    animation: pulse-dot 1.8s ease-in-out infinite;
                }
                .opd-fade-in {
                    animation: fade-in-up 0.4s ease-out;
                }
                .opd-grid-bg {
                    background-image:
                        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
                    background-size: 28px 28px;
                }
            `}</style>

      {/* LEFT — signal panel */}
      <div className="hidden lg:flex lg:w-[44%] relative flex-col justify-between bg-[#0E2A38] opd-grid-bg overflow-hidden px-12 py-12">
        <div>
          <div className="flex items-center gap-2 text-[#9FD8D6]">
            <span className="w-2 h-2 rounded-full bg-[#FF6F61] opd-pulse-dot" />
            <span className="text-xs tracking-[0.18em] uppercase font-[JetBrains_Mono] text-[#9FD8D6]/80">
              Live clinical signal
            </span>
          </div>

          <h1 className="mt-8 text-4xl leading-tight font-[Space_Grotesk] font-semibold text-white">
            Clarity when
            <br />
            minutes matter.
          </h1>
          <p className="mt-4 text-[#C9D9DA] text-sm leading-relaxed max-w-xs">
            The OPD Decision Support System surfaces what's relevant for each
            patient before the next one walks in.
          </p>
        </div>

        {/* ECG waveform — signature element */}
        <div className="relative w-full h-24 overflow-hidden">
          <div
            className="absolute top-1/2 -translate-y-1/2 flex opd-ecg-track"
            style={{ width: "200%" }}
          >
            <svg
              viewBox="0 0 600 100"
              className="w-1/2 h-24"
              preserveAspectRatio="none"
            >
              <path
                d="M0,55 L120,55 L140,20 L160,90 L180,10 L200,55 L600,55"
                fill="none"
                stroke="#FF6F61"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              viewBox="0 0 600 100"
              className="w-1/2 h-24"
              preserveAspectRatio="none"
            >
              <path
                d="M0,55 L120,55 L140,20 L160,90 L180,10 L200,55 L600,55"
                fill="none"
                stroke="#FF6F61"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <p className="text-[11px] font-[JetBrains_Mono] text-[#6E8B90] tracking-wide">
          OPD · DECISION SUPPORT SYSTEM
        </p>
      </div>

      {/* RIGHT — sign-in surface */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm opd-fade-in">
          <h2 className="text-2xl font-[Space_Grotesk] font-semibold text-[#0E2A38]">
            Sign in to OPD
          </h2>
          <p className="mt-1.5 text-sm text-[#6B7A7E] mb-8">
            Enter your clinical credentials to continue.
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-[#FDEDEB] border border-[#F3B9B2] text-sm text-[#9A2F23] opd-fade-in">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {ROLES.map((r) => {
              const active = role === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex items-center gap-2 justify-center py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    active
                      ? "border-[#1C6E74] bg-[#E9F3F2] text-[#0E2A38]"
                      : "border-[#E1E6E5] text-[#6B7A7E] hover:border-[#B9CACA]"
                  }`}
                >
                  <span
                    className={`text-[10px] font-[JetBrains_Mono] px-1.5 py-0.5 rounded ${
                      active
                        ? "bg-[#1C6E74] text-white"
                        : "bg-[#F1F3F2] text-[#8A9498]"
                    }`}
                  >
                    {r.tag}
                  </span>
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Email */}
          <label className="block text-xs font-medium text-[#52606A] mb-1.5">
            Email
          </label>
          <input
            type="email"
            placeholder="you@hospital.org"
            value={email}
            onKeyDown={handleKeyDown}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#E1E6E5] focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] outline-none p-3 rounded-lg mb-4 text-sm bg-white"
          />

          {/* Password */}
          <label className="block text-xs font-medium text-[#52606A] mb-1.5">
            Password
          </label>
          <div className="relative mb-1.5">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onKeyUp={handleCapsLock}
              onKeyDown={(e) => {
                handleCapsLock(e);
                handleKeyDown(e);
              }}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#E1E6E5] focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] outline-none p-3 pr-11 rounded-lg text-sm bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA6AA] hover:text-[#52606A]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.5 5.4A10.5 10.5 0 0112 5c5 0 9 4 10.5 7-.5 1-1.2 2.1-2.1 3.1M6.3 6.3C4 7.9 2.3 10 1.5 12c1.5 3 5.5 7 10.5 7 1.1 0 2.2-.2 3.2-.5" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {capsLockOn && (
            <p className="text-xs text-[#B5762B] mb-3">Caps Lock is on.</p>
          )}

          <div className="flex items-center justify-between mt-3 mb-6">
            <label className="flex items-center gap-2 text-xs text-[#52606A] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#1C6E74]"
              />
              Remember my email & role
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs font-medium text-[#1C6E74] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#1C6E74] text-black py-3 rounded-lg font-medium hover:bg-[#155458] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading && (
              <svg
                className="animate-spin"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeOpacity="0.3"
                  strokeWidth="3"
                />
                <path
                  d="M22 12a10 10 0 00-10-10"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="mt-6 text-center text-xs text-[#9AA6AA]">
            Don't have access? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;