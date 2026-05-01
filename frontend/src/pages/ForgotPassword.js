import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

if (typeof document !== "undefined" && !document.getElementById("poppins-font")) {
  const link = document.createElement("link");
  link.id = "poppins-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

const font = "'Poppins', sans-serif";

const inputStyle = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "11px 14px",
  fontSize: "14px",
  fontFamily: font,
  color: "#1f2937",
  background: "#f9fafb",
  outline: "none",
  boxSizing: "border-box",
  marginTop: "6px",
};

const btnStyle = {
  width: "100%",
  background: "#1f2937",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "12px",
  fontSize: "15px",
  fontWeight: 600,
  fontFamily: font,
  cursor: "pointer",
  marginTop: "8px",
  transition: "background 0.2s",
};

const ForgotPassword = () => {
  // step: 1 = enter email, 2 = enter OTP, 3 = enter new password, 4 = success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ── Step 1: Send OTP ────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!email.trim()) return setError("Please enter your email.");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Enter a valid email address.");

    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/forgot-password", { email });
      setStep(2);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otp.trim()) return setError("Please enter the OTP.");
    if (otp.length !== 6) return setError("OTP must be 6 digits.");

    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/verify-otp", { email, otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ──────────────────────────────────────────────────
  const handleResetPassword = async () => {
    if (!newPassword.trim()) return setError("Please enter a new password.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = {
    1: "Forgot Password",
    2: "Enter OTP",
    3: "New Password",
    4: "All Done!",
  };

  const stepSubtitles = {
    1: "Enter your email and we'll send you an OTP.",
    2: `We sent a 6-digit OTP to ${email}`,
    3: "Choose a strong new password.",
    4: "Your password has been reset successfully!",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f3f4f6",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: font, padding: "24px",
    }}>
      <div style={{
        background: "#fff", borderRadius: "16px", padding: "40px 36px",
        width: "100%", maxWidth: "420px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "28px" }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{
              width: "10px", height: "10px", borderRadius: "50%",
              background: step > s ? "#16a34a" : step === s ? "#dc2626" : "#e5e7eb",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {/* Title */}
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1f2937", fontFamily: font, marginBottom: "6px" }}>
          {stepTitles[step]}
        </h2>
        <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, marginBottom: "24px" }}>
          {stepSubtitles[step]}
        </p>

        {/* Error message */}
        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px",
            padding: "10px 14px", marginBottom: "16px",
            fontSize: "13px", color: "#dc2626", fontFamily: font,
          }}>
            {error}
          </div>
        )}

        {/* ── Step 1: Email ── */}
        {step === 1 && (
          <>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", fontFamily: font }}>
              Email address
            </label>
            <input
              style={inputStyle}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
            />
            <button
              style={btnStyle}
              onClick={handleSendOtp}
              disabled={loading}
              onMouseOver={(e) => e.target.style.background = "#dc2626"}
              onMouseOut={(e) => e.target.style.background = "#1f2937"}
            >
              {loading ? "Sending OTP..." : "Send OTP →"}
            </button>
            <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#6b7280", fontFamily: font }}>
              Remember your password?{" "}
              <span
                onClick={() => navigate("/login")}
                style={{ color: "#dc2626", cursor: "pointer", fontWeight: 600 }}
              >
                Sign in
              </span>
            </p>
          </>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 2 && (
          <>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", fontFamily: font }}>
              6-digit OTP
            </label>
            <input
              style={{ ...inputStyle, letterSpacing: "0.2em", fontSize: "20px", textAlign: "center" }}
              type="text"
              placeholder="• • • • • •"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
            />
            <button
              style={btnStyle}
              onClick={handleVerifyOtp}
              disabled={loading}
              onMouseOver={(e) => e.target.style.background = "#dc2626"}
              onMouseOut={(e) => e.target.style.background = "#1f2937"}
            >
              {loading ? "Verifying..." : "Verify OTP →"}
            </button>
            <p
              onClick={() => { setStep(1); setOtp(""); setError(""); }}
              style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: "#dc2626", cursor: "pointer", fontFamily: font }}
            >
              ← Resend OTP
            </p>
          </>
        )}

        {/* ── Step 3: New Password ── */}
        {step === 3 && (
          <>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", fontFamily: font }}>
              New Password
            </label>
            <input
              style={inputStyle}
              type="password"
              placeholder="Min. 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", fontFamily: font, display: "block", marginTop: "14px" }}>
              Confirm Password
            </label>
            <input
              style={inputStyle}
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
            />
            <button
              style={btnStyle}
              onClick={handleResetPassword}
              disabled={loading}
              onMouseOver={(e) => e.target.style.background = "#dc2626"}
              onMouseOut={(e) => e.target.style.background = "#1f2937"}
            >
              {loading ? "Resetting..." : "Reset Password →"}
            </button>
          </>
        )}

        {/* ── Step 4: Success ── */}
        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
            <p style={{ fontSize: "14px", color: "#374151", fontFamily: font, marginBottom: "24px" }}>
              You can now sign in with your new password.
            </p>
            <button
              style={btnStyle}
              onClick={() => navigate("/login")}
              onMouseOver={(e) => e.target.style.background = "#dc2626"}
              onMouseOut={(e) => e.target.style.background = "#1f2937"}
            >
              Go to Login →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;