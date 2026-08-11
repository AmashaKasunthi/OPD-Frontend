import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

/**
 * AdminLogin — Access Console
 * -----------------------------------------------------------------------
 * Design intent: this isn't a marketing "sign in" card, it's a restricted
 * system console. Left rail reads like a status terminal (monospace,
 * live clock, connection state); right rail is the actual credential
 * form. Amber is used as the single "signal" accent against a near-black
 * navy field — a caution/badge color rather than the usual violet or
 * acid-green defaults.
 * -----------------------------------------------------------------------
 */

const palette = {
  void: "#ced3de",
  panel: "#e4e7ee",
  panelAlt: "#f4f5f8",
  border: "#b8bfcc",
  borderStrong: "#98a2b3",
  textPrimary: "#1c2230",
  textMuted: "#5b6472",
  textFaint: "#828b99",
  accent: "#c8871a",
  accentDim: "#e0b25c",
  danger: "#c94a35",
};

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function StatusRow({ label, value, tone = "muted" }) {
  const color =
    tone === "accent" ? palette.accent : tone === "danger" ? palette.danger : palette.textMuted;
  return (
    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: palette.border }}>
      <span
        className="text-[11px] uppercase tracking-[0.14em]"
        style={{ color: palette.textFaint, fontFamily: "'JetBrains Mono', monospace" }}
      >
        {label}
      </span>
      <span
        className="text-[11px] tracking-wide"
        style={{ color, fontFamily: "'JetBrains Mono', monospace" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const time = useClock();

  const validate = () => {
    if (!email || !password) return "Email and password are required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email address.";
    return "";
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError("");
    setLoading(true);
    setAttempt((a) => a + 1);

    try {
      const response = await API.post("/admin/login", { email, password });

      localStorage.setItem("adminId", response.data.adminId);
      localStorage.setItem("adminName", response.data.fullName);

      navigate("/admin-dashboard");
    } catch (err) {
      setError("Access denied — invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-stretch"
      style={{ background: palette.void, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Left rail — system console */}
      <div
        className="hidden lg:flex flex-col justify-between w-[38%] px-12 py-12 relative overflow-hidden border-r"
        style={{ background: palette.panel, borderColor: palette.border }}
      >
        {/* subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        {/* scan line */}
        <div
          className="absolute left-0 right-0 h-px pointer-events-none animate-[scan_5s_linear_infinite]"
          style={{ background: `linear-gradient(90deg, transparent, ${palette.accent}55, transparent)` }}
        />
        <style>{`
          @keyframes scan {
            0% { top: 0%; }
            100% { top: 100%; }
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-\\[scan_5s_linear_infinite\\] { animation: none; }
          }
        `}</style>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: palette.accent }}
            />
            <span
              className="text-[11px] uppercase tracking-[0.2em]"
              style={{ color: palette.textMuted, fontFamily: "'JetBrains Mono', monospace" }}
            >
              Restricted system
            </span>
          </div>

          <h1
            className="text-[34px] leading-[1.1] font-semibold tracking-tight mb-4"
            style={{ color: palette.textPrimary }}
          >
            Admin
            <br />
            Console
          </h1>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: palette.textMuted }}>
            This area is limited to authorized operators. Every session is
            logged, timestamped, and tied to your credentials.
          </p>
        </div>

        <div className="relative z-10 space-y-1">
          <StatusRow label="Clock" value={time.toLocaleTimeString("en-US", { hour12: false })} />
          <StatusRow
            label="Attempts this session"
            value={String(attempt).padStart(2, "0")}
            tone={attempt > 2 ? "danger" : "muted"}
          />
        </div>
      </div>

      {/* Right rail — credential form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-2 lg:hidden">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: palette.accent }} />
            <span
              className="text-[11px] uppercase tracking-[0.2em]"
              style={{ color: palette.textMuted, fontFamily: "'JetBrains Mono', monospace" }}
            >
              Restricted system
            </span>
          </div>

          <h2
            className="text-2xl font-semibold tracking-tight mb-1"
            style={{ color: palette.textPrimary }}
          >
            Sign in to continue
          </h2>
          <p className="text-sm mb-8" style={{ color: palette.textMuted }}>
            Use your administrator credentials.
          </p>

          {error && (
            <div
              className="mb-5 flex items-start gap-2 text-[13px] px-3 py-2.5 rounded-md border"
              style={{
                color: palette.danger,
                background: "rgba(240,102,77,0.08)",
                borderColor: "rgba(240,102,77,0.25)",
              }}
              role="alert"
            >
              <span>{error}</span>
            </div>
          )}

          <label
            htmlFor="admin-email"
            className="block text-[11px] uppercase tracking-[0.12em] mb-1.5"
            style={{ color: palette.textFaint, fontFamily: "'JetBrains Mono', monospace" }}
          >
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoFocus
            autoComplete="username"
            disabled={loading}
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-5 px-3.5 py-3 rounded-md text-sm outline-none transition-colors disabled:opacity-50"
            style={{
              background: palette.panelAlt,
              border: `1px solid ${palette.border}`,
              color: palette.textPrimary,
            }}
            onFocus={(e) => (e.target.style.borderColor = palette.accent)}
            onBlur={(e) => (e.target.style.borderColor = palette.border)}
          />

          <label
            htmlFor="admin-password"
            className="block text-[11px] uppercase tracking-[0.12em] mb-1.5"
            style={{ color: palette.textFaint, fontFamily: "'JetBrains Mono', monospace" }}
          >
            Password
          </label>
          <div className="relative mb-2">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              disabled={loading}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-3 pr-11 rounded-md text-sm outline-none transition-colors disabled:opacity-50"
              style={{
                background: palette.panelAlt,
                border: `1px solid ${palette.border}`,
                color: palette.textPrimary,
              }}
              onFocus={(e) => (e.target.style.borderColor = palette.accent)}
              onBlur={(e) => (e.target.style.borderColor = palette.border)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded"
              style={{ color: palette.textFaint }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="flex justify-end mb-7">
            <button
              type="button"
              className="text-[12px] transition-colors"
              style={{ color: palette.textFaint }}
              onMouseEnter={(e) => (e.target.style.color = palette.accent)}
              onMouseLeave={(e) => (e.target.style.color = palette.textFaint)}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed"
            style={{
              background: loading ? palette.accentDim : palette.accent,
              color: "#151109",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Verifying credentials…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight size={15} />
              </>
            )}
          </button>

          <div
            className="mt-8 flex items-center gap-2 text-[11px]"
            style={{ color: palette.textFaint, fontFamily: "'JetBrains Mono', monospace" }}
          >
            <ShieldCheck size={13} />
            <span>All access attempts are recorded for audit.</span>
          </div>
        </form>
      </div>
    </div>
  );
}