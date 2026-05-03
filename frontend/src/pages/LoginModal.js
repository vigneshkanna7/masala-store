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

// ── Moved outside component to avoid recreation on every render ──
const inputStyle = {
  width: "100%",
  padding: "11px 16px 11px 44px",
  background: "#f1f5f0",
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
  background: "#6abf5e",
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
  color: "#1f2937",
  border: "2px solid #1f2937",
  borderRadius: "50px",
  fontSize: "13px",
  fontWeight: 600,
  fontFamily: font,
  cursor: "pointer",
  marginTop: "18px",
  transition: "background 0.2s",
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
    style={{ position: "absolute", top: 0, left: 0, opacity: 0.28, pointerEvents: "none" }}
    preserveAspectRatio="xMidYMid slice">
    <ellipse cx="62" cy="118" rx="32" ry="16" stroke="#3a6a2a" strokeWidth="2.5" fill="none"/>
    <path d="M 30 118 Q 30 140 62 140 Q 94 140 94 118" stroke="#3a6a2a" strokeWidth="2.5" fill="none"/>
    <rect x="57" y="82" width="10" height="30" rx="5" stroke="#3a6a2a" strokeWidth="2.5" fill="none"/>
    <ellipse cx="62" cy="82" rx="7" ry="4" stroke="#3a6a2a" strokeWidth="2" fill="none"/>
    <circle cx="218" cy="68" r="6" stroke="#3a6a2a" strokeWidth="2" fill="none"/>
    <circle cx="218" cy="68" r="22" stroke="#3a6a2a" strokeWidth="1.5" strokeDasharray="3 3" fill="none"/>
    <line x1="218" y1="46" x2="218" y2="90" stroke="#3a6a2a" strokeWidth="2"/>
    <line x1="196" y1="68" x2="240" y2="68" stroke="#3a6a2a" strokeWidth="2"/>
    <line x1="202" y1="52" x2="234" y2="84" stroke="#3a6a2a" strokeWidth="2"/>
    <line x1="234" y1="52" x2="202" y2="84" stroke="#3a6a2a" strokeWidth="2"/>
    <path d="M 28 320 Q 48 275 68 292 Q 84 306 62 334 Q 48 350 28 320 Z" stroke="#3a6a2a" strokeWidth="2.5" fill="none"/>
    <path d="M 66 290 Q 74 268 88 260" stroke="#3a6a2a" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M 240 360 Q 272 326 280 296 Q 252 310 240 360 Z" stroke="#3a6a2a" strokeWidth="2" fill="none"/>
    <line x1="240" y1="360" x2="272" y2="316" stroke="#3a6a2a" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M 185 390 Q 208 365 216 342" stroke="#3a6a2a" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M 198 376 Q 210 366 214 350" stroke="#3a6a2a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <circle cx="130" cy="38" r="5" fill="#dc2626" opacity="0.6"/>
    <circle cx="178" cy="398" r="6" fill="#dc2626" opacity="0.5"/>
    <circle cx="20" cy="412" r="4" fill="#dc2626" opacity="0.45"/>
    <circle cx="268" cy="198" r="5" fill="#dc2626" opacity="0.5"/>
    <circle cx="100" cy="288" r="3" fill="#dc2626" opacity="0.4"/>
    <path d="M 100 155 L 104 146 L 108 155 L 117 159 L 108 163 L 104 172 L 100 163 L 91 159 Z" fill="#3a6a2a" opacity="0.65"/>
    <path d="M 252 422 L 255 415 L 258 422 L 265 425 L 258 428 L 255 435 L 252 428 L 245 425 Z" fill="#3a6a2a" opacity="0.55"/>
    <path d="M 10 196 L 13 189 L 16 196 L 23 199 L 16 202 L 13 209 L 10 202 L 3 199 Z" fill="#dc2626" opacity="0.5"/>
  </svg>
);

const InputWrapper = ({ icon: Icon, children }) => (
  <div style={{ position: "relative", marginBottom: "12px" }}>
    <span style={{
      position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
      color: "#9ca3af", fontSize: "16px", pointerEvents: "none",
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

  // ── Login state ──
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Register state ──
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // ── Forgot Password state ──
  const [fpStep, setFpStep] = useState(1);
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError] = useState("");

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

  // ── Handlers ──
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
      return setFpError("Enter a valid email address.");
    setFpError(""); setFpLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: fpEmail });
      setFpStep(2);
    } catch {
      setFpError("Something went wrong. Please try again.");
    } finally {
      setFpLoading(false);
    }
  };

  const handleFpVerifyOtp = async () => {
    if (fpOtp.length !== 6) return setFpError("OTP must be 6 digits.");
    setFpError(""); setFpLoading(true);
    try {
      await api.post("/auth/verify-otp", { email: fpEmail, otp: fpOtp });
      setFpStep(3);
    } catch (err) {
      setFpError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setFpLoading(false);
    }
  };

  const handleFpReset = async () => {
    if (fpNewPassword.length < 6) return setFpError("Password must be at least 6 characters.");
    if (fpNewPassword !== fpConfirmPassword) return setFpError("Passwords do not match.");
    setFpError(""); setFpLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email: fpEmail, otp: fpOtp, newPassword: fpNewPassword,
      });
      setFpStep(4);
    } catch (err) {
      setFpError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setFpLoading(false);
    }
  };

  const resetFpAndGoLogin = () => {
    setMode("login");
    setFpStep(1);
    setFpEmail(""); setFpOtp("");
    setFpNewPassword(""); setFpConfirmPassword("");
    setFpError("");
  };

  if (!isOpen) return null;

  // ── Mode-dependent styles (depend on mode so stay inside) ──
  const greenPanel = {
    flex: "0 0 320px",
    background: "#c6dfb4",
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
    1: "Enter your email and we'll send you an OTP.",
    2: `We sent a 6-digit OTP to ${fpEmail}`,
    3: "Choose a strong new password.",
    4: "Your password has been reset successfully!",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          width: "100%",
          maxWidth: mode === "forgotPassword" ? "480px" : "860px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
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

        {/* ══ LOGIN MODE ══ */}
        {mode === "login" && (<>
          <div style={greenPanel}>
            <SpiceDecor />
            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#1a2e1a", fontFamily: font, lineHeight: 1.2, marginBottom: "14px" }}>
                Hey Buddy!
              </h2>
              <p style={{ fontSize: "13px", color: "#4b5563", fontFamily: font, lineHeight: 1.7, marginBottom: "28px" }}>
                Thank you for shopping with us,<br />please register your account :)
              </p>
              <button style={outlineBtn} onClick={() => { setMode("register"); setLoginError(""); }}>
                Register
              </button>
            </div>
          </div>

          <div style={loginWhitePanel}>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1f2937", fontFamily: font, marginBottom: "20px" }}>
              Sign In
            </h2>
            {loginError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: "8px", padding: "9px 13px", marginBottom: "14px", fontSize: "13px", fontFamily: font, width: "100%", boxSizing: "border-box" }}>
                {loginError}
              </div>
            )}
            <form onSubmit={handleLogin} style={{ width: "100%" }}>
              <InputWrapper icon={FiUser}>
                <input style={inputStyle} type="email" placeholder="Email address"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                  onFocus={(e) => e.target.style.borderColor = "#6abf5e"}
                  onBlur={(e) => e.target.style.borderColor = "transparent"}
                />
              </InputWrapper>
              <InputWrapper icon={FiLock}>
                <input style={inputStyle} type={showPass ? "text" : "password"} placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                  onFocus={(e) => e.target.style.borderColor = "#6abf5e"}
                  onBlur={(e) => e.target.style.borderColor = "transparent"}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={eyeBtn}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </InputWrapper>

              <div style={{ textAlign: "right", marginBottom: "14px" }}>
                <span
                  onClick={() => { setMode("forgotPassword"); setFpStep(1); setFpError(""); }}
                  style={{ fontSize: "12px", color: "#6abf5e", cursor: "pointer", fontFamily: font }}
                >
                  Forgot Password?
                </span>
              </div>

              <button type="submit" disabled={loginLoading} style={submitBtn}
                onMouseOver={(e) => e.currentTarget.style.background = "#52a847"}
                onMouseOut={(e) => e.currentTarget.style.background = "#6abf5e"}>
                {loginLoading
                  ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><Spinner size="sm" color="white" /> Signing in...</span>
                  : "Submit"}
              </button>
            </form>
          </div>
        </>)}

        {/* ══ REGISTER MODE ══ */}
        {mode === "register" && (<>
          <div style={loginWhitePanel}>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1f2937", fontFamily: font, marginBottom: "16px" }}>
              Register
            </h2>
            {regError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: "8px", padding: "9px 13px", marginBottom: "10px", fontSize: "13px", fontFamily: font, width: "100%", boxSizing: "border-box" }}>
                {regError}
              </div>
            )}
            <form onSubmit={handleRegister} style={{ width: "100%" }}>
              <InputWrapper icon={FiUser}>
                <input style={inputStyle} type="text" placeholder="Name"
                  value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} required
                  onFocus={(e) => e.target.style.borderColor = "#6abf5e"}
                  onBlur={(e) => e.target.style.borderColor = "transparent"}
                />
              </InputWrapper>
              <InputWrapper icon={FiMail}>
                <input style={inputStyle} type="email" placeholder="Email address"
                  value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} required
                  onFocus={(e) => e.target.style.borderColor = "#6abf5e"}
                  onBlur={(e) => e.target.style.borderColor = "transparent"}
                />
              </InputWrapper>
              <InputWrapper icon={FiPhone}>
                <input style={inputStyle} type="tel" placeholder="Phone number"
                  value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  maxLength={10} required
                  onFocus={(e) => e.target.style.borderColor = "#6abf5e"}
                  onBlur={(e) => e.target.style.borderColor = "transparent"}
                />
              </InputWrapper>
              <InputWrapper icon={FiLock}>
                <input style={inputStyle} type={showPass ? "text" : "password"} placeholder="Password"
                  value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} required
                  onFocus={(e) => e.target.style.borderColor = "#6abf5e"}
                  onBlur={(e) => e.target.style.borderColor = "transparent"}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={eyeBtn}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </InputWrapper>
              <InputWrapper icon={FiLock}>
                <input style={inputStyle} type={showConfirm ? "text" : "password"} placeholder="Confirm password"
                  value={regForm.confirmPassword} onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })} required
                  onFocus={(e) => e.target.style.borderColor = "#6abf5e"}
                  onBlur={(e) => e.target.style.borderColor = "transparent"}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={eyeBtn}>
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </InputWrapper>
              <button type="submit" disabled={regLoading} style={submitBtn}
                onMouseOver={(e) => e.currentTarget.style.background = "#52a847"}
                onMouseOut={(e) => e.currentTarget.style.background = "#6abf5e"}>
                {regLoading
                  ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><Spinner size="sm" color="white" /> Registering...</span>
                  : "Register"}
              </button>
            </form>
          </div>

          <div style={greenPanel}>
            <SpiceDecor />
            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#1a2e1a", fontFamily: font, lineHeight: 1.2, marginBottom: "14px" }}>
                Welcome<br />Back
              </h2>
              <p style={{ fontSize: "13px", color: "#4b5563", fontFamily: font, lineHeight: 1.7, marginBottom: "28px" }}>
                Thank you for shopping with us,<br />please login your account :)
              </p>
              <button style={outlineBtn} onClick={() => { setMode("login"); setRegError(""); }}>
                Sign In
              </button>
            </div>
          </div>
        </>)}

        {/* ══ FORGOT PASSWORD MODE ══ */}
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
                    background: fpStep > s ? "#6abf5e" : fpStep === s ? "#dc2626" : "#e5e7eb",
                    transition: "background 0.3s",
                  }} />
                ))}
              </div>
            )}

            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1f2937", fontFamily: font, marginBottom: "6px" }}>
              {fpTitles[fpStep]}
            </h2>
            <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, marginBottom: "20px", textAlign: "center" }}>
              {fpSubtitles[fpStep]}
            </p>

            {fpError && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px",
                padding: "10px 14px", marginBottom: "14px",
                fontSize: "13px", color: "#dc2626", fontFamily: font,
                width: "100%", boxSizing: "border-box",
              }}>
                {fpError}
              </div>
            )}

            {fpStep === 1 && (
              <>
                <InputWrapper icon={FiMail}>
                  <input style={inputStyle} type="email" placeholder="you@example.com"
                    value={fpEmail} onChange={(e) => setFpEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleFpSendOtp()}
                    onFocus={(e) => e.target.style.borderColor = "#6abf5e"}
                    onBlur={(e) => e.target.style.borderColor = "transparent"}
                  />
                </InputWrapper>
                <button onClick={handleFpSendOtp} disabled={fpLoading}
                  style={{ ...submitBtn, marginTop: "4px" }}
                  onMouseOver={(e) => e.currentTarget.style.background = "#52a847"}
                  onMouseOut={(e) => e.currentTarget.style.background = "#6abf5e"}>
                  {fpLoading ? "Sending OTP..." : "Send OTP →"}
                </button>
                <span onClick={() => { setMode("login"); setFpError(""); }}
                  style={{ marginTop: "16px", fontSize: "12px", color: "#6abf5e", cursor: "pointer", fontFamily: font }}>
                  ← Back to Sign In
                </span>
              </>
            )}

            {fpStep === 2 && (
              <>
                <input style={{ ...inputStyle, paddingLeft: "16px", letterSpacing: "0.25em", fontSize: "22px", textAlign: "center", width: "100%", marginBottom: "12px" }}
                  type="text" placeholder="• • • • • •"
                  value={fpOtp} maxLength={6}
                  onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleFpVerifyOtp()}
                  onFocus={(e) => e.target.style.borderColor = "#6abf5e"}
                  onBlur={(e) => e.target.style.borderColor = "transparent"}
                />
                <button onClick={handleFpVerifyOtp} disabled={fpLoading} style={submitBtn}
                  onMouseOver={(e) => e.currentTarget.style.background = "#52a847"}
                  onMouseOut={(e) => e.currentTarget.style.background = "#6abf5e"}>
                  {fpLoading ? "Verifying..." : "Verify OTP →"}
                </button>
                <span onClick={() => { setFpStep(1); setFpOtp(""); setFpError(""); }}
                  style={{ marginTop: "14px", fontSize: "12px", color: "#6abf5e", cursor: "pointer", fontFamily: font }}>
                  ← Resend OTP
                </span>
              </>
            )}

            {fpStep === 3 && (
              <>
                <InputWrapper icon={FiLock}>
                  <input style={inputStyle} type="password" placeholder="New password (min. 6 chars)"
                    value={fpNewPassword} onChange={(e) => setFpNewPassword(e.target.value)}
                    onFocus={(e) => e.target.style.borderColor = "#6abf5e"}
                    onBlur={(e) => e.target.style.borderColor = "transparent"}
                  />
                </InputWrapper>
                <InputWrapper icon={FiLock}>
                  <input style={inputStyle} type="password" placeholder="Confirm new password"
                    value={fpConfirmPassword} onChange={(e) => setFpConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleFpReset()}
                    onFocus={(e) => e.target.style.borderColor = "#6abf5e"}
                    onBlur={(e) => e.target.style.borderColor = "transparent"}
                  />
                </InputWrapper>
                <button onClick={handleFpReset} disabled={fpLoading} style={submitBtn}
                  onMouseOver={(e) => e.currentTarget.style.background = "#52a847"}
                  onMouseOut={(e) => e.currentTarget.style.background = "#6abf5e"}>
                  {fpLoading ? "Resetting..." : "Reset Password →"}
                </button>
              </>
            )}

            {fpStep === 4 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "52px", marginBottom: "16px" }}>✅</div>
                <p style={{ fontSize: "14px", color: "#374151", fontFamily: font, marginBottom: "24px" }}>
                  You can now sign in with your new password.
                </p>
                <button onClick={resetFpAndGoLogin}
                  style={{ ...submitBtn, width: "auto", padding: "11px 36px" }}
                  onMouseOver={(e) => e.currentTarget.style.background = "#52a847"}
                  onMouseOut={(e) => e.currentTarget.style.background = "#6abf5e"}>
                  Go to Sign In →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;