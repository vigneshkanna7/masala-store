import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

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
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", success: true });
  const navigate = useNavigate();

  const showToast = (message, success = true) => {
    setToast({ visible: true, message, success });
    setTimeout(() => setToast({ visible: false, message: "", success: true }), 3000);
  };

  // ── Step 1: Send OTP ──
  const handleSendOtp = async () => {
    if (!email.trim()) return showToast("Please enter your email.", false);
    if (!/\S+@\S+\.\S+/.test(email)) return showToast("Enter a valid email address.", false);
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      showToast("OTP sent to your email!", true);
      setStep(2);
    } catch {
      showToast("Something went wrong. Please try again.", false);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──
  const handleVerifyOtp = async () => {
    if (!otp.trim()) return showToast("Please enter the OTP.", false);
    if (otp.length !== 6) return showToast("OTP must be 6 digits.", false);
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      showToast("OTP verified successfully!", true);
      setStep(3);
    } catch (err) {
      showToast(err.response?.data?.message || "Invalid OTP. Please try again.", false);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ──
  const handleResetPassword = async () => {
    if (!newPassword.trim()) return showToast("Please enter a new password.", false);
    if (newPassword.length < 8) return showToast("Password must be at least 8 characters.", false);
    if (newPassword !== confirmPassword) return showToast("Passwords do not match.", false);
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      showToast("Password reset successfully!", true);
      setStep(4);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to reset password. Please try again.", false);
    } finally {
      setLoading(false);
    }
  };

  const stepTitles    = { 1: "Forgot Password", 2: "Enter OTP", 3: "New Password", 4: "All Done!" };
  const stepSubtitles = {
    1: "Enter your email and we'll send you an OTP.",
    2: `We sent a 6-digit OTP to ${email}`,
    3: "Choose a strong new password.",
    4: "Your password has been reset successfully!",
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .toast {
          position: fixed; top: 28px; right: 28px; z-index: 9999;
          min-width: 280px; max-width: 400px; padding: 16px 20px;
          border-radius: 10px; font-family: 'Poppins', sans-serif;
          font-size: 14px; font-weight: 500; display: flex;
          align-items: center; gap: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12); animation: slideIn 0.3s ease;
        }
        .toast-success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
        .toast-error   { background: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; }
      `}</style>

      {/* ── Toast ── */}
      {toast.visible && (
        <div className={`toast ${toast.success ? "toast-success" : "toast-error"}`}>
          <span style={{ fontSize: "18px" }}>{toast.success ? "✅" : "❌"}</span>
          {toast.message}
        </div>
      )}

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

          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1f2937", fontFamily: font, marginBottom: "6px" }}>
            {stepTitles[step]}
          </h2>
          <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, marginBottom: "24px" }}>
            {stepSubtitles[step]}
          </p>

          {/* ── Step 1: Email ── */}
          {step === 1 && (
            <>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", fontFamily: font }}>
                Email address
              </label>
              <input style={inputStyle} type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
              />
              <button style={btnStyle} onClick={handleSendOtp} disabled={loading}
                onMouseOver={(e) => e.target.style.background = "#dc2626"}
                onMouseOut={(e) => e.target.style.background = "#1f2937"}>
                {loading ? "Sending OTP..." : "Send OTP →"}
              </button>
              <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#6b7280", fontFamily: font }}>
                Remember your password?{" "}
                <span onClick={() => navigate("/")}
                  style={{ color: "#dc2626", cursor: "pointer", fontWeight: 600 }}>
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
              <input style={{ ...inputStyle, letterSpacing: "0.2em", fontSize: "20px", textAlign: "center" }}
                type="text" placeholder="• • • • • •"
                value={otp} maxLength={6}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
              />
              <button style={btnStyle} onClick={handleVerifyOtp} disabled={loading}
                onMouseOver={(e) => e.target.style.background = "#dc2626"}
                onMouseOut={(e) => e.target.style.background = "#1f2937"}>
                {loading ? "Verifying..." : "Verify OTP →"}
              </button>
              <p onClick={() => { setStep(1); setOtp(""); }}
                style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: "#dc2626", cursor: "pointer", fontFamily: font }}>
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
              <input style={inputStyle} type="password" placeholder="Min. 8 characters"
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              />
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", fontFamily: font, display: "block", marginTop: "14px" }}>
                Confirm Password
              </label>
              <input style={inputStyle} type="password" placeholder="Repeat your password"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
              />
              <button style={btnStyle} onClick={handleResetPassword} disabled={loading}
                onMouseOver={(e) => e.target.style.background = "#dc2626"}
                onMouseOut={(e) => e.target.style.background = "#1f2937"}>
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
              <button style={btnStyle} onClick={() => navigate("/")}
                onMouseOver={(e) => e.target.style.background = "#dc2626"}
                onMouseOut={(e) => e.target.style.background = "#1f2937"}>
                Go to Login →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;