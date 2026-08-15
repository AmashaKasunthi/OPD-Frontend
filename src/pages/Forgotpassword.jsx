import React, { useState, useRef, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const RESEND_COOLDOWN = 60;

// ============================================================
// INPUT FIELD
// ============================================================

function InputField({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-[#52606A] mb-1.5">
        {label}
      </label>

      <input
        className="w-full border border-[#E1E6E5] focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] outline-none p-3 rounded-lg text-sm bg-white"
        {...props}
      />
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ForgotPassword() {
  const navigate = useNavigate();

  // ========================================================
  // SHARED STATE
  // ========================================================

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [info, setInfo] = useState("");

  // ========================================================
  // OTP STATE
  // ========================================================

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const otpRefs = useRef([]);

  const [countdown, setCountdown] = useState(0);

  const timerRef = useRef(null);

  // ========================================================
  // PASSWORD STATE
  // ========================================================

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNew, setShowNew] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [capsLock, setCapsLock] = useState(false);

  // ========================================================
  // CLEANUP TIMER
  // ========================================================

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  // ========================================================
  // COUNTDOWN
  // ========================================================

  const startCountdown = () => {
    setCountdown(RESEND_COOLDOWN);

    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current);

          return 0;
        }

        return c - 1;
      });
    }, 1000);
  };

  // ========================================================
  // PASSWORD STRENGTH
  // ========================================================

  const strength = (() => {
    if (!newPassword) {
      return null;
    }

    let score = 0;

    if (newPassword.length >= 8) {
      score++;
    }

    if (/[A-Z]/.test(newPassword)) {
      score++;
    }

    if (/[0-9]/.test(newPassword)) {
      score++;
    }

    if (/[^A-Za-z0-9]/.test(newPassword)) {
      score++;
    }

    return score;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength ?? 0];

  const strengthColor = ["", "#D64C3A", "#D69A3A", "#2D8C5E", "#1C6E74"][
    strength ?? 0
  ];

  // ========================================================
  // STEP 1
  // SEND OTP
  // ========================================================

  const handleSendOtp = async () => {
    setError("");
    setInfo("");

    if (!email.trim()) {
      setError("Enter your registered email.");

      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/staff/forgot-password", {
        email: email.trim(),
      });

      setInfo(
        `If the email is registered, a 6-digit code has been sent to ${email}.`,
      );

      setStep(2);

      startCountdown();
    } catch (err) {
      console.error("Forgot password error:", err);

      setError("Unable to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // RESEND OTP
  // ========================================================

  const handleResendOtp = async () => {
    if (countdown > 0) {
      return;
    }

    setError("");
    setInfo("");

    setLoading(true);

    try {
      await API.post("/auth/staff/forgot-password", {
        email: email.trim(),
      });

      setInfo("A new verification code has been sent.");

      setOtp(["", "", "", "", "", ""]);

      otpRefs.current[0]?.focus();

      startCountdown();
    } catch (err) {
      console.error("Resend OTP error:", err);

      setError("Could not resend the code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // VERIFY OTP
  // ========================================================

  const handleVerifyOtp = async () => {
    setError("");
    setInfo("");

    const code = otp.join("");

    if (code.length < 6) {
      setError("Enter all 6 digits.");
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/verify-otp", {
        email,
        otp: code,
      });

      setStep(3);
    } catch (error) {
      console.error(error);
      setError("Incorrect or expired code. Request a new one.");
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // RESET PASSWORD
  // ========================================================

const handleResetPassword = async () => {
    setError("");
    setInfo("");

    if (!newPassword) {
        setError("Enter a new password.");
        return;
    }

    if (newPassword !== confirmPassword) {
        setError("Passwords don't match.");
        return;
    }

    if ((strength ?? 0) < 2) {
        setError("Choose a stronger password.");
        return;
    }

    const code = otp.join("");

    setLoading(true);

    try {
        await API.post("/auth/reset-password", {
            email,
            otp: code,
            newPassword
        });

        setInfo("Password updated. Redirecting to sign in…");

        setTimeout(() => {
            navigate("/");
        }, 2000);

    } catch (error) {
        console.error(error);
        setError("Unable to reset password. Please request a new OTP.");
    } finally {
        setLoading(false);
    }
};

  // ========================================================
  // OTP CHANGE
  // ========================================================

  const handleOtpChange = (idx, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const next = [...otp];

    next[idx] = digit;

    setOtp(next);

    if (digit && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  // ========================================================
  // OTP KEYBOARD
  // ========================================================

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }

    if (e.key === "Enter") {
      handleVerifyOtp();
    }
  };

  // ========================================================
  // OTP PASTE
  // ========================================================

  const handleOtpPaste = (e) => {
    e.preventDefault();

    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");

    const next = ["", "", "", "", "", ""];

    digits.forEach((digit, index) => {
      next[index] = digit;
    });

    setOtp(next);

    const focusIndex = Math.min(digits.length, 5);

    otpRefs.current[focusIndex]?.focus();
  };

  // ========================================================
  // STEP INFORMATION
  // ========================================================

  const stepMeta = [
    {
      n: 1,
      label: "Enter email",
    },

    {
      n: 2,
      label: "Verify code",
    },

    {
      n: 3,
      label: "New password",
    },
  ];

  // ========================================================
  // UI
  // ========================================================

  return (
    <div className="min-h-screen w-full flex bg-[#FBF8F3] font-[Inter]">
      <style>{`

                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

                @keyframes ecg-scroll {

                    from {
                        transform: translateX(0);
                    }

                    to {
                        transform: translateX(-50%);
                    }
                }

                @keyframes pulse-dot {

                    0%,100% {
                        opacity:1;
                        transform:scale(1);
                    }

                    50% {
                        opacity:.35;
                        transform:scale(.85);
                    }
                }

                @keyframes fade-in-up {

                    from {
                        opacity:0;
                        transform:translateY(6px);
                    }

                    to {
                        opacity:1;
                        transform:translateY(0);
                    }
                }

                .opd-ecg-track {
                    animation:
                        ecg-scroll
                        4.5s
                        linear
                        infinite;
                }

                .opd-pulse-dot {
                    animation:
                        pulse-dot
                        1.8s
                        ease-in-out
                        infinite;
                }

                .opd-fade-in {
                    animation:
                        fade-in-up
                        .35s
                        ease-out;
                }

                .opd-grid-bg {

                    background-image:
                        linear-gradient(
                            rgba(255,255,255,.05)
                            1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            rgba(255,255,255,.05)
                            1px,
                            transparent 1px
                        );

                    background-size:28px 28px;
                }

            `}</style>

      {/* ==================================================
                LEFT PANEL
            ================================================== */}

      <div className="hidden lg:flex lg:w-[44%] relative flex-col justify-between bg-[#0E2A38] opd-grid-bg overflow-hidden px-12 py-12">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6F61] opd-pulse-dot" />

            <span className="text-xs tracking-[.18em] uppercase font-[JetBrains_Mono] text-[#9FD8D6]/80">
              Secure reset flow
            </span>
          </div>

          <h1 className="mt-8 text-4xl leading-tight font-[Space_Grotesk] font-semibold text-white">
            Reset your
            <br />
            credentials.
          </h1>

          <p className="mt-4 text-[#C9D9DA] text-sm leading-relaxed max-w-xs">
            We'll send a one-time code to your registered email. Use it to set a
            new password — the code expires in 10 minutes.
          </p>

          {/* STEP INDICATORS */}

          <div className="mt-10 space-y-3">
            {stepMeta.map(({ n, label }) => {
              const done = step > n;

              const active = step === n;

              return (
                <div key={n} className="flex items-center gap-3">
                  <span
                    className={`
                                                w-6 h-6
                                                rounded-full
                                                flex
                                                items-center
                                                justify-center
                                                text-xs
                                                font-[JetBrains_Mono]
                                                shrink-0
                                                transition-colors

                                                ${
                                                  done
                                                    ? "bg-[#1C6E74] text-white"
                                                    : active
                                                      ? "bg-white text-[#0E2A38]"
                                                      : "bg-white/10 text-white/40"
                                                }
                                            `}
                  >
                    {done ? "✓" : n}
                  </span>

                  <span
                    className={`
                                                text-sm

                                                ${
                                                  active
                                                    ? "text-white font-medium"
                                                    : done
                                                      ? "text-[#9FD8D6]"
                                                      : "text-white/30"
                                                }
                                            `}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ECG */}

        <div className="relative w-full h-24 overflow-hidden">
          <div
            className="absolute top-1/2 -translate-y-1/2 flex opd-ecg-track"
            style={{
              width: "200%",
            }}
          >
            {[0, 1].map((k) => (
              <svg
                key={k}
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
            ))}
          </div>
        </div>

        <p className="text-[11px] font-[JetBrains_Mono] text-[#6E8B90] tracking-wide">
          OPD · DECISION SUPPORT SYSTEM
        </p>
      </div>

      {/* ==================================================
                RIGHT PANEL
            ================================================== */}

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm opd-fade-in">
          {/* BACK */}

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs text-[#1C6E74] hover:underline mb-6"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M19 12H5M12 5l-7 7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to sign in
          </button>

          {/* ==================================================
                        STEP 1
                    ================================================== */}

          {step === 1 && (
            <>
              <h2 className="text-2xl font-[Space_Grotesk] font-semibold text-[#0E2A38]">
                Forgot password?
              </h2>

              <p className="mt-1.5 text-sm text-[#6B7A7E] mb-7">
                We'll send a 6-digit verification code to your email.
              </p>

              {error && <Banner type="error">{error}</Banner>}

              <InputField
                label="Registered email"
                type="email"
                placeholder="you@hospital.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendOtp();
                  }
                }}
              />

              <SubmitButton loading={loading} onClick={handleSendOtp}>
                Send verification code
              </SubmitButton>
            </>
          )}

          {/* ==================================================
                        STEP 2
                    ================================================== */}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-[Space_Grotesk] font-semibold text-[#0E2A38]">
                Enter the code
              </h2>

              <p className="mt-1.5 text-sm text-[#6B7A7E] mb-7">
                Sent to{" "}
                <span className="font-medium text-[#0E2A38]">{email}</span>
              </p>

              {error && <Banner type="error">{error}</Banner>}

              {info && <Banner type="info">{info}</Banner>}

              {/* OTP BOXES */}

              <div
                className="flex gap-2.5 justify-between mb-6"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-xl font-[JetBrains_Mono] font-medium border border-[#E1E6E5] focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] outline-none rounded-lg bg-white text-[#0E2A38]"
                  />
                ))}
              </div>

              <SubmitButton loading={loading} onClick={handleVerifyOtp}>
                Verify code
              </SubmitButton>

              <p className="mt-4 text-center text-xs text-[#9AA6AA]">
                Didn't receive it?{" "}
                <button
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || loading}
                  className="font-medium text-[#1C6E74] disabled:text-[#9AA6AA] hover:underline disabled:no-underline disabled:cursor-default"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
                </button>
              </p>

              <p className="mt-2 text-center text-xs text-[#9AA6AA]">
                Wrong email?{" "}
                <button
                  onClick={() => {
                    setStep(1);
                    setError("");
                    setInfo("");
                  }}
                  className="text-[#1C6E74] hover:underline font-medium"
                >
                  Go back
                </button>
              </p>
            </>
          )}

          {/* ==================================================
                        STEP 3
                    ================================================== */}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-[Space_Grotesk] font-semibold text-[#0E2A38]">
                Set new password
              </h2>

              <p className="mt-1.5 text-sm text-[#6B7A7E] mb-7">
                Choose something you haven't used before.
              </p>

              {error && <Banner type="error">{error}</Banner>}

              {info && <Banner type="success">{info}</Banner>}

              {/* NEW PASSWORD */}

              <label className="block text-xs font-medium text-[#52606A] mb-1.5">
                New password
              </label>

              <div className="relative mb-1.5">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={newPassword}
                  onKeyUp={(e) =>
                    setCapsLock(e.getModifierState?.("CapsLock") ?? false)
                  }
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-[#E1E6E5] focus:border-[#1C6E74] focus:ring-1 focus:ring-[#1C6E74] outline-none p-3 pr-11 rounded-lg text-sm bg-white"
                />

                <EyeToggle
                  show={showNew}
                  onToggle={() => setShowNew((s) => !s)}
                />
              </div>

              {/* PASSWORD STRENGTH */}

              {newPassword && (
                <div className="mb-4">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="flex-1 h-1 rounded-full transition-colors"
                        style={{
                          backgroundColor:
                            (strength ?? 0) >= n ? strengthColor : "#E1E6E5",
                        }}
                      />
                    ))}
                  </div>

                  <p
                    className="text-[11px]"
                    style={{
                      color: strengthColor,
                    }}
                  >
                    {strengthLabel}

                    {
                      " — use uppercase, numbers & symbols for a stronger password."
                    }
                  </p>
                </div>
              )}

              {/* CAPS LOCK */}

              {capsLock && (
                <p className="text-xs text-[#B5762B] mb-2">Caps Lock is on.</p>
              )}

              {/* CONFIRM PASSWORD */}

              <label className="block text-xs font-medium text-[#52606A] mb-1.5">
                Confirm new password
              </label>

              <div className="relative mb-6">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleResetPassword();
                    }
                  }}
                  className={`
                                        w-full
                                        border
                                        focus:ring-1
                                        outline-none
                                        p-3
                                        pr-11
                                        rounded-lg
                                        text-sm
                                        bg-white

                                        ${
                                          confirmPassword &&
                                          confirmPassword !== newPassword
                                            ? "border-[#D64C3A] focus:border-[#D64C3A] focus:ring-[#D64C3A]"
                                            : "border-[#E1E6E5] focus:border-[#1C6E74] focus:ring-[#1C6E74]"
                                        }
                                    `}
                />

                <EyeToggle
                  show={showConfirm}
                  onToggle={() => setShowConfirm((s) => !s)}
                />
              </div>

              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-[#D64C3A] -mt-4 mb-4">
                  Passwords don't match.
                </p>
              )}

              <SubmitButton loading={loading} onClick={handleResetPassword}>
                Save new password
              </SubmitButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// BANNER
// ============================================================

function Banner({ type = "error", children }) {
  const styles = {
    error: "bg-[#FDEDEB] border-[#F3B9B2] text-[#9A2F23]",

    info: "bg-[#EBF2FD] border-[#B2CFF3] text-[#1D4E89]",

    success: "bg-[#E9F5EE] border-[#A8D8B8] text-[#1E6B3D]",
  };

  return (
    <div
      className={`
                mb-5
                px-4
                py-3
                rounded-lg
                border
                text-sm
                opd-fade-in
                ${styles[type]}
            `}
    >
      {children}
    </div>
  );
}

// ============================================================
// SUBMIT BUTTON
// ============================================================

function SubmitButton({ loading, onClick, children }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full bg-[#1C6E74] text-white py-3 rounded-lg font-medium hover:bg-[#155458] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
            strokeOpacity=".3"
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

      {loading ? "Please wait..." : children}
    </button>
  );
}

// ============================================================
// PASSWORD EYE TOGGLE
// ============================================================

function EyeToggle({ show, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA6AA] hover:text-[#52606A]"
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.5 5.4A10.5 10.5 0 0112 5c5 0 10.5 7 10.5 7-.5 1-1.2 2.1-2.1 3.1M6.3 6.3C4 7.9 2.3 10 1.5 12c1.5 3 5.5 7 10.5 7 1.1 0 2.2-.2 3.2-.5" />
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
  );
}
