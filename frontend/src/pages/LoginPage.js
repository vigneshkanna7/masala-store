import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/api";
import Spinner from "../components/Spinner";
import { FiUser, FiLock, FiMail, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";

/* ─── Inject Poppins ─── */
if (typeof document !== "undefined" && !document.getElementById("poppins-font")) {
  const link = document.createElement("link");
  link.id = "poppins-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap";
  document.head.appendChild(link);
}

const font = "'Poppins', sans-serif";

/* ─── Spice decorative SVG ─── */
const SpiceDecor = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 280 420"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", top: 0, left: 0, opacity: 0.28, pointerEvents: "none" }}
    preserveAspectRatio="xMidYMid slice"
  >
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

/* Icon wrapper — renders a react-icon inside the input */
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

const LoginPage = () => {
  const [mode, setMode] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regForm, setRegForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await api.post("/auth/login", loginForm);
localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify({
    name: res.data.name,
    email: res.data.email,
    role: res.data.role
}));
      navigate("/");
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
      const res = await axios.post("http://localhost:8080/api/auth/register", {
        name: regForm.name, email: regForm.email,
        password: regForm.password, phone: regForm.phone,
      });
      const { token, name, email, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ name, email, role }));
      localStorage.removeItem("guestCart");
      navigate("/");
    } catch (err) {
      setRegError(err.response?.data?.message || "Registration failed. Try again!");
    } finally {
      setRegLoading(false);
    }
  };

  const greenPanel = {
    flex: "0 0 280px",
    background: "#c6dfb4",
    borderRadius: mode === "login" ? "16px 0 0 16px" : "0 16px 16px 0",
    padding: "40px 28px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    order: mode === "login" ? 0 : 1,
  };

  const whitePanel = {
    flex: 1,
    background: "#fff",
    borderRadius: mode === "login" ? "0 16px 16px 0" : "16px 0 0 16px",
    padding: "40px 36px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f3f4f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: font,
      padding: "24px",
    }}>
      <div style={{
        display: "flex",
        width: "100%",
        maxWidth: "720px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 16px 48px rgba(0,0,0,0.13)",
        minHeight: "420px",
      }}>

        {/* ══ LOGIN MODE ══ */}
        {mode === "login" && (<>
          <div style={greenPanel}>
            <SpiceDecor />
            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#1a2e1a", fontFamily: font, lineHeight: 1.2, marginBottom: "14px" }}>
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

          <div style={whitePanel}>
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1f2937", fontFamily: font, marginBottom: "22px" }}>
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
                  onClick={() => navigate("/forgot-password")}
                  style={{ fontSize: "12px", color: "#6abf5e", cursor: "pointer", fontFamily: font }}
                >
                  Forgot Password?
                </span>
              </div>

              <button type="submit" disabled={loginLoading} style={submitBtn}
                onMouseOver={(e) => e.currentTarget.style.background = "#52a847"}
                onMouseOut={(e) => e.currentTarget.style.background = "#6abf5e"}
              >
                {loginLoading
                  ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><Spinner size="sm" color="white" /> Signing in...</span>
                  : "Submit"
                }
              </button>
            </form>
          </div>
        </>)}

        {/* ══ REGISTER MODE ══ */}
        {mode === "register" && (<>
          <div style={whitePanel}>
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1f2937", fontFamily: font, marginBottom: "18px" }}>
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
                onMouseOut={(e) => e.currentTarget.style.background = "#6abf5e"}
              >
                {regLoading
                  ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><Spinner size="sm" color="white" /> Registering...</span>
                  : "Register"
                }
              </button>
            </form>
          </div>

          <div style={greenPanel}>
            <SpiceDecor />
            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#1a2e1a", fontFamily: font, lineHeight: 1.2, marginBottom: "14px" }}>
                Welcome<br />Back
              </h2>
              <p style={{ fontSize: "13px", color: "#4b5563", fontFamily: font, lineHeight: 1.7, marginBottom: "28px" }}>
                Thank you for shopping with us,<br />please register your account :)
              </p>
              <button style={outlineBtn} onClick={() => { setMode("login"); setRegError(""); }}>
                Sign In
              </button>
            </div>
          </div>
        </>)}
      </div>
    </div>
  );
};

export default LoginPage;