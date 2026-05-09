import React, { useState, useEffect } from "react";
import api from "../api/api";
import Spinner from "../components/Spinner";
import { FiUser, FiLock, FiMail, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";

if (typeof document !== "undefined" && !document.getElementById("poppins-font")) {
  const link = document.createElement("link");
  link.id = "poppins-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap";
  document.head.appendChild(link);
}

const font = "'Poppins', sans-serif";
const red = "#dc2626";
const darkRed = "#b91c1c";

const inputStyle = {
  width: "100%",
  padding: "11px 16px 11px 44px",
  background: "#fef2f2",
  border: "1.5px solid transparent",
  borderRadius: "50px",
  fontSize: "13px",
  fontFamily: font,
  color: "#1f2937",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const submitBtn = {
  width: "100%",
  padding: "11px",
  background: red,
  color: "#fff",
  border: "none",
  borderRadius: "50px",
  fontSize: "14px",
  fontWeight: 700,
  fontFamily: font,
  cursor: "pointer",
  marginTop: "6px",
  transition: "background 0.2s",
};

const outlineBtn = {
  padding: "9px 32px",
  background: "transparent",
  color: "#fff",
  border: "2px solid #fff",
  borderRadius: "50px",
  fontSize: "13px",
  fontWeight: 600,
  fontFamily: font,
  cursor: "pointer",
  marginTop: "18px",
  transition: "all 0.2s",
};

const eyeBtn = {
  position: "absolute", right: "14px", top: "50%",
  transform: "translateY(-50%)", cursor: "pointer",
  fontSize: "16px", color: "#9ca3af",
  background: "none", border: "none", padding: 0,
  display: "flex", alignItems: "center",
};

const whitePanel = {
  flex: 1,
  background: "#fff",
  padding: "48px 44px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const SpiceDecor = () => (
  <svg width="100%" height="100%" viewBox="0 0 280 420" fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", top: 0, left: 0, opacity: 0.15, pointerEvents: "none" }}
    preserveAspectRatio="xMidYMid slice">
    <ellipse cx="62" cy="118" rx="32" ry="16" stroke="#fff" strokeWidth="2.5" fill="none"/>
    <path d="M 30 118 Q 30 140 62 140 Q 94 140 94 118" stroke="#fff" strokeWidth="2.5" fill="none"/>
    <rect x="57" y="82" width="10" height="30" rx="5" stroke="#fff" strokeWidth="2.5" fill="none"/>
    <ellipse cx="62" cy="82" rx="7" ry="4" stroke="#fff" strokeWidth="2" fill="none"/>
    <circle cx="218" cy="68" r="6" stroke="#fff" strokeWidth="2" fill="none"/>
    <circle cx="218" cy="68" r="22" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 3" fill="none"/>
    <line x1="218" y1="46" x2="218" y2="90" stroke="#fff" strokeWidth="2"/>
    <line x1="196" y1="68" x2="240" y2="68" stroke="#fff" strokeWidth="2"/>
    <line x1="202" y1="52" x2="234" y2="84" stroke="#fff" strokeWidth="2"/>
    <line x1="234" y1="52" x2="202" y2="84" stroke="#fff" strokeWidth="2"/>
    <path d="M 28 320 Q 48 275 68 292 Q 84 306 62 334 Q 48 350 28 320 Z" stroke="#fff" strokeWidth="2.5" fill="none"/>
    <path d="M 66 290 Q 74 268 88 260" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M 240 360 Q 272 326 280 296 Q 252 310 240 360 Z" stroke="#fff" strokeWidth="2" fill="none"/>
    <line x1="240" y1="360" x2="272" y2="316" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M 185 390 Q 208 365 216 342" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M 198 376 Q 210 366 214 350" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <circle cx="130" cy="38" r="5" fill="#fff" opacity="0.6"/>
    <circle cx="178" cy="398" r="6" fill="#fff" opacity="0.5"/>
    <circle cx="20" cy="412" r="4" fill="#fff" opacity="0.45"/>
    <circle cx="268" cy="198" r="5" fill="#fff" opacity="0.5"/>
    <circle cx="100" cy="288" r="3" fill="#fff" opacity="0.4"/>
    <path d="M 100 155 L 104 146 L 108 155 L 117 159 L 108 163 L 104 172 L 100 163 L 91 159 Z" fill="#fff" opacity="0.65"/>
    <path d="M 252 422 L 255 415 L 258 422 L 265 425 L 258 428 L 255 435 L 252 428 L 245 425 Z" fill="#fff" opacity="0.55"/>
    <path d="M 10 196 L 13 189 L 16 196 L 23 199 L 16 202 L 13 209 L 10 202 L 3 199 Z" fill="#fff" opacity="0.5"/>
  </svg>
);

const InputWrapper = ({ icon: Icon, children }) => (
  <div style={{ position: "relative", marginBottom: "12px" }}>
    <span style={{
      position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
      color: "#dc2626", fontSize: "16px", pointerEvents: "none",
      display: "flex", alignItems: "center",
    }}>
      <Icon />
    </span>
    {children}
  </div>
);

const LoginModal = ({ isOpen, onClose, defaultMode = "login" }) => {
  const [mode, setMode] = useState(defaultMode);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regForm, setRegForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const [fpStep, setFpStep] = useState(1);
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpLoading, setFpLoading] = useState(false);

  const [toast, setToast] = useState({ visible: false, message: "", success: true });

  const showToast = (message, success = true) => {
    setToast({ visible: true, message, success });
    setTimeout(() => setToast({ visible: false, message: "", success: true }), 3000);
  };

  useEffect(() => {
    setMode(defaultMode);
    setLoginError("");
    setRegError("");
  }, [defaultMode, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await api.post("/auth/login", loginForm);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("user", JSON.stringify({
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      }));
      onClose();
      window.location.reload();
    } catch {
      setLoginError("Invalid email or password!");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    if (regForm.password !== regForm.confirmPassword) { setRegError("Passwords do not match!"); return; }
    if (regForm.password.length < 6) { setRegError("Password must be at least 6 characters!"); return; }
    setRegLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name: regForm.name, email: regForm.email,
        password: regForm.password, phone: regForm.phone,
      });
      const { token, name, email, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);
      localStorage.setItem("user", JSON.stringify({ name, email, role }));
      localStorage.removeItem("guestCart");
      onClose();
      window.location.reload();
    } catch (err) {
      setRegError(err.response?.data?.message || "Registration failed. Try again!");
    } finally {
      setRegLoading(false);
    }
  };

  const handleFpSendOtp = async () => {
    if (!fpEmail.trim() || !/\S+@\S+\.\S+/.test(fpEmail))
      return showToast("Enter a valid email address.", false);
    setFpLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: fpEmail });
      showToast("OTP sent to your email!", true);
      setFpStep(2);
    } catch {
      showToast("Something went wrong. Please try again.", false);
    } finally {
      setFpLoading(false);
    }
  };

  const handleFpVerifyOtp = async () => {
    if (fpOtp.length !== 6) return showToast("OTP must be 6 digits.", false);
    setFpLoading(true);
    try {
      await api.post("/auth/verify-otp", { email: fpEmail, otp: fpOtp });
      showToast("OTP verified successfully!", true);
      setFpStep(3);
    } catch (err) {
      showToast(err.response?.data?.message || "Invalid OTP. Please try again.", false);
    } finally {
      setFpLoading(false);
    }
  };

  const handleFpReset = async () => {
    if (fpNewPassword.length < 8) return showToast("Password must be at least 8 characters.", false);
    if (fpNewPassword !== fpConfirmPassword) return showToast("Passwords do not match.", false);
    setFpLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email: fpEmail, otp: fpOtp, newPassword: fpNewPassword,
      });
      showToast("Password reset successfully!", true);
      setFpStep(4);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to reset password. Please try again.", false);
    } finally {
      setFpLoading(false);
    }
  };

  const resetFpAndGoLogin = () => {
    setMode("login");
    setFpStep(1);
    setFpEmail(""); setFpOtp("");
    setFpNewPassword(""); setFpConfirmPassword("");
  };

  if (!isOpen) return null;

  const redPanel = {
    flex: "0 0 300px",
    background: `linear-gradient(145deg, ${red} 0%, ${darkRed} 100%)`,
    borderRadius: mode === "login" ? "16px 0 0 16px" : "0 16px 16px 0",
    padding: "48px 36px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    order: mode === "login" ? 0 : 1,
  };

  const loginWhitePanel = {
    ...whitePanel,
    borderRadius: mode === "login" ? "0 16px 16px 0" : "16px 0 0 16px",
  };

  const fpTitles    = { 1: "Forgot Password", 2: "Enter OTP", 3: "New Password", 4: "All Done!" };
  const fpSubtitles = {
    1: "Enter your Registered email and we'll send you an OTP.",
    2: `We sent a 6-digit OTP to ${fpEmail}`,
    3: "Choose a strong new password.",
    4: "Your password has been reset successfully!",
  };

  return (
    <>
      <style>{`
        @keyframes fpSlideIn {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .fp-toast {
          position: fixed; top: 28px; right: 28px; z-index: 9999;
          min-width: 280px; max-width: 400px; padding: 16px 20px;
          border-radius: 10px; font-family: 'Poppins', sans-serif;
          font-size: 14px; font-weight: 500; display: flex;
          align-items: center; gap: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12); animation: fpSlideIn 0.3s ease;
        }
        .fp-toast-success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
        .fp-toast-error   { background: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; }
        .modal-input:focus { border-color: #dc2626 !important; }
        .outline-btn:hover { background: rgba(255,255,255,0.15) !important; }
      `}</style>

      {toast.visible && (
        <div className={`fp-toast ${toast.success ? "fp-toast-success" : "fp-toast-error"}`}>
          {toast.message}
        </div>
      )}

      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px",
          backdropFilter: "blur(3px)",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            width: "100%",
            maxWidth: mode === "forgotPassword" ? "480px" : "820px",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
            minHeight: "500px",
            position: "relative",
            fontFamily: font,
            transition: "max-width 0.3s ease",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "14px", right: "16px", zIndex: 10,
              background: "transparent", border: "none", fontSize: "20px",
              color: "#6b7280", cursor: "pointer", lineHeight: 1,
            }}
            aria-label="Close"
          >
            ✕
          </button>

          {/* LOGIN MODE */}
          {mode === "login" && (<>
            <div style={redPanel}>
              <SpiceDecor />
              <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px", border: "2px solid rgba(255,255,255,0.4)",
                }}>
                  <FiUser style={{ fontSize: "28px", color: "#fff" }} />
                </div>
                <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", fontFamily: font, lineHeight: 1.2, marginBottom: "14px" }}>
                  New Here?
                </h2>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", fontFamily: font, lineHeight: 1.7, marginBottom: "28px" }}>
                  Thank you for shopping with us.<br />Create an account to get started.
                </p>
                <button
                  className="outline-btn"
                  style={outlineBtn}
                  onClick={() => { setMode("register"); setLoginError(""); }}
                >
                  Register
                </button>
              </div>
            </div>

            <div style={loginWhitePanel}>
              <div style={{ marginBottom: "8px", textAlign: "center" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: "#fef2f2", display: "flex", alignItems: "center",
                  justifyContent: "center", margin: "0 auto 12px",
                }}>
                  <FiLock style={{ fontSize: "20px", color: red }} />
                </div>
                <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1f2937", fontFamily: font, margin: "0 0 4px" }}>
                  Welcome Back
                </h2>
                <p style={{ fontSize: "13px", color: "#9ca3af", fontFamily: font, margin: "0 0 20px" }}>
                  Sign in to your account
                </p>
              </div>

              {loginError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: "8px", padding: "9px 13px", marginBottom: "14px", fontSize: "13px", fontFamily: font, width: "100%", boxSizing: "border-box" }}>
                  {loginError}
                </div>
              )}
              <form onSubmit={handleLogin} style={{ width: "100%" }}>
                <InputWrapper icon={FiMail}>
                  <input
                    className="modal-input"
                    style={inputStyle} type="email" placeholder="Email address"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                    onFocus={(e) => e.target.style.borderColor = red}
                    onBlur={(e) => e.target.style.borderColor = "transparent"}
                  />
                </InputWrapper>
                <InputWrapper icon={FiLock}>
                  <input
                    className="modal-input"
                    style={inputStyle} type={showPass ? "text" : "password"} placeholder="Password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    onFocus={(e) => e.target.style.borderColor = red}
                    onBlur={(e) => e.target.style.borderColor = "transparent"}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={eyeBtn}>
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </InputWrapper>

                <div style={{ textAlign: "right", marginBottom: "14px" }}>
                  <span
                    onClick={() => { setMode("forgotPassword"); setFpStep(1); }}
                    style={{ fontSize: "12px", color: red, cursor: "pointer", fontFamily: font }}
                  >
                    Forgot Password?
                  </span>
                </div>

                <button type="submit" disabled={loginLoading} style={submitBtn}
                  onMouseOver={(e) => e.currentTarget.style.background = darkRed}
                  onMouseOut={(e) => e.currentTarget.style.background = red}>
                  {loginLoading
                    ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><Spinner size="sm" color="white" /> Signing in...</span>
                    : "Sign In"}
                </button>
              </form>
            </div>
          </>)}

          {/* REGISTER MODE */}
          {mode === "register" && (<>
            <div style={loginWhitePanel}>
              <div style={{ marginBottom: "8px", textAlign: "center" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: "#fef2f2", display: "flex", alignItems: "center",
                  justifyContent: "center", margin: "0 auto 12px",
                }}>
                  <FiUser style={{ fontSize: "20px", color: red }} />
                </div>
                <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1f2937", fontFamily: font, margin: "0 0 4px" }}>
                  Create Account
                </h2>
                <p style={{ fontSize: "13px", color: "#9ca3af", fontFamily: font, margin: "0 0 16px" }}>
                  Join us and start shopping
                </p>
              </div>

              {regError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: "8px", padding: "9px 13px", marginBottom: "10px", fontSize: "13px", fontFamily: font, width: "100%", boxSizing: "border-box" }}>
                  {regError}
                </div>
              )}
              <form onSubmit={handleRegister} style={{ width: "100%" }}>
                <InputWrapper icon={FiUser}>
                  <input className="modal-input" style={inputStyle} type="text" placeholder="Full name"
                    value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} required
                    onFocus={(e) => e.target.style.borderColor = red}
                    onBlur={(e) => e.target.style.borderColor = "transparent"}
                  />
                </InputWrapper>
                <InputWrapper icon={FiMail}>
                  <input className="modal-input" style={inputStyle} type="email" placeholder="Email address"
                    value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} required
                    onFocus={(e) => e.target.style.borderColor = red}
                    onBlur={(e) => e.target.style.borderColor = "transparent"}
                  />
                </InputWrapper>
                <InputWrapper icon={FiPhone}>
                  <input className="modal-input" style={inputStyle} type="tel" placeholder="Phone number"
                    value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    maxLength={10} required
                    onFocus={(e) => e.target.style.borderColor = red}
                    onBlur={(e) => e.target.style.borderColor = "transparent"}
                  />
                </InputWrapper>
                <InputWrapper icon={FiLock}>
                  <input className="modal-input" style={inputStyle} type={showPass ? "text" : "password"} placeholder="Password"
                    value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} required
                    onFocus={(e) => e.target.style.borderColor = red}
                    onBlur={(e) => e.target.style.borderColor = "transparent"}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={eyeBtn}>
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </InputWrapper>
                <InputWrapper icon={FiLock}>
                  <input className="modal-input" style={inputStyle} type={showConfirm ? "text" : "password"} placeholder="Confirm password"
                    value={regForm.confirmPassword} onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })} required
                    onFocus={(e) => e.target.style.borderColor = red}
                    onBlur={(e) => e.target.style.borderColor = "transparent"}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={eyeBtn}>
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </InputWrapper>
                <button type="submit" disabled={regLoading} style={submitBtn}
                  onMouseOver={(e) => e.currentTarget.style.background = darkRed}
                  onMouseOut={(e) => e.currentTarget.style.background = red}>
                  {regLoading
                    ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><Spinner size="sm" color="white" /> Registering...</span>
                    : "Create Account"}
                </button>
              </form>
            </div>

            <div style={redPanel}>
              <SpiceDecor />
              <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px", border: "2px solid rgba(255,255,255,0.4)",
                }}>
                  <FiLock style={{ fontSize: "28px", color: "#fff" }} />
                </div>
                <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", fontFamily: font, lineHeight: 1.2, marginBottom: "14px" }}>
                  Welcome Back
                </h2>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", fontFamily: font, lineHeight: 1.7, marginBottom: "28px" }}>
                  Already have an account?<br />Sign in to continue.
                </p>
                <button
                  className="outline-btn"
                  style={outlineBtn}
                  onClick={() => { setMode("login"); setRegError(""); }}
                >
                  Sign In
                </button>
              </div>
            </div>
          </>)}

          {/* FORGOT PASSWORD MODE */}
          {mode === "forgotPassword" && (
            <div style={{
              flex: 1, background: "#fff", borderRadius: "16px",
              padding: "48px 44px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              {fpStep < 4 && (
                <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                  {[1, 2, 3].map((s) => (
                    <div key={s} style={{
                      width: "10px", height: "10px", borderRadius: "50%",
                      background: fpStep > s ? red : fpStep === s ? darkRed : "#e5e7eb",
                      transition: "background 0.3s",
                    }} />
                  ))}
                </div>
              )}

              <div style={{
                width: "48px", height: "48px", borderRadius: "50%",
                background: "#fef2f2", display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 16px",
              }}>
                <FiLock style={{ fontSize: "20px", color: red }} />
              </div>

              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1f2937", fontFamily: font, marginBottom: "6px" }}>
                {fpTitles[fpStep]}
              </h2>
              <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, marginBottom: "20px", textAlign: "center" }}>
                {fpSubtitles[fpStep]}
              </p>

              {fpStep === 1 && (
                <>
                  <InputWrapper icon={FiMail}>
                    <input className="modal-input" style={inputStyle} type="email" placeholder="you@example.com"
                      value={fpEmail} onChange={(e) => setFpEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleFpSendOtp()}
                      onFocus={(e) => e.target.style.borderColor = red}
                      onBlur={(e) => e.target.style.borderColor = "transparent"}
                    />
                  </InputWrapper>
                  <button onClick={handleFpSendOtp} disabled={fpLoading}
                    style={{ ...submitBtn, marginTop: "4px" }}
                    onMouseOver={(e) => e.currentTarget.style.background = darkRed}
                    onMouseOut={(e) => e.currentTarget.style.background = red}>
                    {fpLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                  <span onClick={() => setMode("login")}
                    style={{ marginTop: "16px", fontSize: "12px", color: red, cursor: "pointer", fontFamily: font }}>
                    Back to Sign In
                  </span>
                </>
              )}

              {fpStep === 2 && (
                <>
                  <input className="modal-input"
                    style={{ ...inputStyle, paddingLeft: "16px", letterSpacing: "0.25em", fontSize: "22px", textAlign: "center", width: "100%", marginBottom: "12px" }}
                    type="text" placeholder="• • • • • •"
                    value={fpOtp} maxLength={6}
                    onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => e.key === "Enter" && handleFpVerifyOtp()}
                    onFocus={(e) => e.target.style.borderColor = red}
                    onBlur={(e) => e.target.style.borderColor = "transparent"}
                  />
                  <button onClick={handleFpVerifyOtp} disabled={fpLoading} style={submitBtn}
                    onMouseOver={(e) => e.currentTarget.style.background = darkRed}
                    onMouseOut={(e) => e.currentTarget.style.background = red}>
                    {fpLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <span onClick={() => { setFpStep(1); setFpOtp(""); }}
                    style={{ marginTop: "14px", fontSize: "12px", color: red, cursor: "pointer", fontFamily: font }}>
                    Resend OTP
                  </span>
                </>
              )}

              {fpStep === 3 && (
                <>
                  <InputWrapper icon={FiLock}>
                    <input className="modal-input" style={inputStyle} type="password" placeholder="New password (min. 8 chars)"
                      value={fpNewPassword} onChange={(e) => setFpNewPassword(e.target.value)}
                      onFocus={(e) => e.target.style.borderColor = red}
                      onBlur={(e) => e.target.style.borderColor = "transparent"}
                    />
                  </InputWrapper>
                  <InputWrapper icon={FiLock}>
                    <input className="modal-input" style={inputStyle} type="password" placeholder="Confirm new password"
                      value={fpConfirmPassword} onChange={(e) => setFpConfirmPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleFpReset()}
                      onFocus={(e) => e.target.style.borderColor = red}
                      onBlur={(e) => e.target.style.borderColor = "transparent"}
                    />
                  </InputWrapper>
                  <button onClick={handleFpReset} disabled={fpLoading} style={submitBtn}
                    onMouseOver={(e) => e.currentTarget.style.background = darkRed}
                    onMouseOut={(e) => e.currentTarget.style.background = red}>
                    {fpLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </>
              )}

              {fpStep === 4 && (
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    background: "#fef2f2", display: "flex", alignItems: "center",
                    justifyContent: "center", margin: "0 auto 16px",
                    border: `2px solid ${red}`,
                  }}>
                    <FiLock style={{ fontSize: "28px", color: red }} />
                  </div>
                  <p style={{ fontSize: "14px", color: "#374151", fontFamily: font, marginBottom: "24px" }}>
                    You can now sign in with your new password.
                  </p>
                  <button onClick={resetFpAndGoLogin}
                    style={{ ...submitBtn, width: "auto", padding: "11px 36px" }}
                    onMouseOver={(e) => e.currentTarget.style.background = darkRed}
                    onMouseOut={(e) => e.currentTarget.style.background = red}>
                    Go to Sign In
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginModal;