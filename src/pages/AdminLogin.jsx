import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

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
  const [view, setView] = useState("login"); // "login" | "forgot" | "otp" | "done"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const time = useClock();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

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
      const response = await API.post("/auth/login", { email, password });

      localStorage.setItem("adminId", response.data.adminId);
      localStorage.setItem("adminName", response.data.fullName);

      navigate("/admin-dashboard");
    } catch (err) {
      setError("Access denied — invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const openForgot = () => {
    setResetEmail(email); // carry over whatever they already typed
    setResetError("");
    setOtpError("");
    setError("");
    setView("forgot");
  };

  const backToLogin = () => {
    setResetError("");
    setOtpError("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setView("login");
  };

  // STEP 1 — request an OTP by email
  const requestOtp = async () => {
    if (!resetEmail) {
      setResetError("Enter your email address.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(resetEmail)) {
      setResetError("Enter a valid email address.");
      return false;
    }
    setResetError("");
    setResetLoading(true);

    try {
      // Backend always returns a generic message whether or not the
      // email is registered — see PasswordResetService.sendOtp.
      await API.post("/auth/forgot-password", { email: resetEmail });
      setResendCooldown(30);
      return true;
    } catch (err) {
      setResetError("Something went wrong. Please try again.");
      return false;
    } finally {
      setResetLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e?.preventDefault();
    const ok = await requestOtp();
    if (ok) setView("otp");
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    await requestOtp();
  };

  // STEP 2 — verify OTP + set new password in one submit
  const handleResetSubmit = async (e) => {
    e?.preventDefault();

    if (!otp || otp.length !== 6) {
      setOtpError("Enter the 6-digit code from your email.");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setOtpError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setOtpError("Passwords don't match.");
      return;
    }

    setOtpError("");
    setOtpLoading(true);

    try {
      const response = await API.post("/auth/reset-password", {
        email: resetEmail,
        otp,
        newPassword,
      });

      // Your Spring endpoint returns a plain String body, not a JSON
      // object, so response.data IS the message — not response.data.message.
      if (response.data === "Password reset successful") {
        setView("done");
      } else {
        setOtpError(response.data || "Invalid or expired code.");
      }
    } catch (err) {
      setOtpError("Invalid or expired code. Try again or resend it.");
    } finally {
      setOtpLoading(false);
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
              Secure access · OPD · ADMINISTRATION
            </span>
          </div>

          <h1
            className="text-[34px] leading-[1.1] font-semibold tracking-tight mb-4"
            style={{ color: palette.textPrimary }}
          >
            System
            <br />
            Control Center
          </h1>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: palette.textMuted }}>
            Manage authorized users, clinical services, and
             OPD system operations from one secure workspace.
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
        {view === "login" && (
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
              onClick={openForgot}
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
        )}

        {view === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="w-full max-w-sm">
            <button
              type="button"
              onClick={backToLogin}
              className="flex items-center gap-1.5 text-[12px] mb-6 transition-colors"
              style={{ color: palette.textFaint }}
              onMouseEnter={(e) => (e.currentTarget.style.color = palette.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = palette.textFaint)}
            >
              <ArrowLeft size={14} />
              Back to sign in
            </button>

            <h2
              className="text-2xl font-semibold tracking-tight mb-1"
              style={{ color: palette.textPrimary }}
            >
              Reset your password
            </h2>
            <p className="text-sm mb-8" style={{ color: palette.textMuted }}>
              Enter the email tied to your admin account. We'll send a link
              to reset your password if it matches one on file.
            </p>

            {resetError && (
              <div
                className="mb-5 flex items-start gap-2 text-[13px] px-3 py-2.5 rounded-md border"
                style={{
                  color: palette.danger,
                  background: "rgba(240,102,77,0.08)",
                  borderColor: "rgba(240,102,77,0.25)",
                }}
                role="alert"
              >
                <span>{resetError}</span>
              </div>
            )}

            <label
              htmlFor="reset-email"
              className="block text-[11px] uppercase tracking-[0.12em] mb-1.5"
              style={{ color: palette.textFaint, fontFamily: "'JetBrains Mono', monospace" }}
            >
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              autoFocus
              disabled={resetLoading}
              placeholder="you@company.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full mb-6 px-3.5 py-3 rounded-md text-sm outline-none transition-colors disabled:opacity-50"
              style={{
                background: palette.panelAlt,
                border: `1px solid ${palette.border}`,
                color: palette.textPrimary,
              }}
              onFocus={(e) => (e.target.style.borderColor = palette.accent)}
              onBlur={(e) => (e.target.style.borderColor = palette.border)}
            />

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed"
              style={{
                background: resetLoading ? palette.accentDim : palette.accent,
                color: "#151109",
              }}
            >
              {resetLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Sending code…
                </>
              ) : (
                <>
                  <Mail size={15} />
                  Send code
                </>
              )}
            </button>
          </form>
        )}

        {view === "otp" && (
          <form onSubmit={handleResetSubmit} className="w-full max-w-sm">
            <button
              type="button"
              onClick={backToLogin}
              className="flex items-center gap-1.5 text-[12px] mb-6 transition-colors"
              style={{ color: palette.textFaint }}
              onMouseEnter={(e) => (e.currentTarget.style.color = palette.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = palette.textFaint)}
            >
              <ArrowLeft size={14} />
              Back to Sign in
            </button>

            <h2
              className="text-2xl font-semibold tracking-tight mb-1"
              style={{ color: palette.textPrimary }}
            >
              Enter your code
            </h2>
            <p className="text-sm mb-8" style={{ color: palette.textMuted }}>
              If <span style={{ color: palette.textPrimary }}>{resetEmail}</span> matches an
              admin account, a 6-digit code was sent. It expires in 10
              minutes.
            </p>

            {otpError && (
              <div
                className="mb-5 flex items-start gap-2 text-[13px] px-3 py-2.5 rounded-md border"
                style={{
                  color: palette.danger,
                  background: "rgba(240,102,77,0.08)",
                  borderColor: "rgba(240,102,77,0.25)",
                }}
                role="alert"
              >
                <span>{otpError}</span>
              </div>
            )}

            <label
              htmlFor="otp-code"
              className="block text-[11px] uppercase tracking-[0.12em] mb-1.5"
              style={{ color: palette.textFaint, fontFamily: "'JetBrains Mono', monospace" }}
            >
              6-digit code
            </label>
            <input
              id="otp-code"
              type="text"
              inputMode="numeric"
              autoFocus
              maxLength={6}
              disabled={otpLoading}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full mb-5 px-3.5 py-3 rounded-md text-lg tracking-[0.4em] text-center outline-none transition-colors disabled:opacity-50"
              style={{
                background: palette.panelAlt,
                border: `1px solid ${palette.border}`,
                color: palette.textPrimary,
                fontFamily: "'JetBrains Mono', monospace",
              }}
              onFocus={(e) => (e.target.style.borderColor = palette.accent)}
              onBlur={(e) => (e.target.style.borderColor = palette.border)}
            />

            <label
              htmlFor="new-password"
              className="block text-[11px] uppercase tracking-[0.12em] mb-1.5"
              style={{ color: palette.textFaint, fontFamily: "'JetBrains Mono', monospace" }}
            >
              New password
            </label>
            <div className="relative mb-5">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                disabled={otpLoading}
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                onClick={() => setShowNewPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded"
                style={{ color: palette.textFaint }}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <label
              htmlFor="confirm-password"
              className="block text-[11px] uppercase tracking-[0.12em] mb-1.5"
              style={{ color: palette.textFaint, fontFamily: "'JetBrains Mono', monospace" }}
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              type={showNewPassword ? "text" : "password"}
              autoComplete="new-password"
              disabled={otpLoading}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-6 px-3.5 py-3 rounded-md text-sm outline-none transition-colors disabled:opacity-50"
              style={{
                background: palette.panelAlt,
                border: `1px solid ${palette.border}`,
                color: palette.textPrimary,
              }}
              onFocus={(e) => (e.target.style.borderColor = palette.accent)}
              onBlur={(e) => (e.target.style.borderColor = palette.border)}
            />

            <button
              type="submit"
              disabled={otpLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed mb-4"
              style={{
                background: otpLoading ? palette.accentDim : palette.accent,
                color: "#151109",
              }}
            >
              {otpLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Resetting…
                </>
              ) : (
                <>
                  Reset password
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || resetLoading}
              className="w-full text-center text-[12px] transition-colors disabled:cursor-not-allowed"
              style={{ color: resendCooldown > 0 ? palette.textFaint : palette.accent }}
            >
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
            </button>
          </form>
        )}

        {view === "done" && (
          <div className="w-full max-w-sm">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center mb-6"
              style={{ background: "rgba(240,180,41,0.12)" }}
            >
              <CheckCircle2 size={22} style={{ color: palette.accent }} />
            </div>

            <h2
              className="text-2xl font-semibold tracking-tight mb-2"
              style={{ color: palette.textPrimary }}
            >
              Password reset
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: palette.textMuted }}>
              Your password has been updated. Sign in with your new
              password.
            </p>

            <button
              type="button"
              onClick={backToLogin}
              className="flex items-center gap-1.5 text-[13px] transition-colors"
              style={{ color: palette.accent }}
            >
              <ArrowLeft size={14} />
              Back to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}