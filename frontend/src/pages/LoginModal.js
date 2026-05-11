import React, { useState, useEffect } from "react";
import api from "../api/api";
import Spinner from "../components/Spinner";
import { FiUser, FiLock, FiMail, FiPhone, FiEye, FiEyeOff, FiArrowLeft, FiCheck } from "react-icons/fi";

if (typeof document !== "undefined" && !document.getElementById("lm-font")) {
  const link = document.createElement("link");
  link.id = "lm-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap";
  document.head.appendChild(link);
}

if (typeof document !== "undefined" && !document.getElementById("lm-styles")) {
  const s = document.createElement("style");
  s.id = "lm-styles";
  s.textContent = `
    .lm-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 1000;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      backdrop-filter: blur(4px);
    }
    .lm-modal {
      display: flex;
      width: 100%; max-width: 860px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 40px 100px rgba(0,0,0,0.3);
      min-height: 540px;
      position: relative;
      font-family: 'Poppins', sans-serif;
      background: #fff;
    }
    .lm-modal-fp {
      max-width: 460px;
      border-radius: 20px;
    }

    /* ── Brand Panel ── */
    .lm-brand {
      flex: 0 0 320px;
      background: #dc2626;
      padding: 48px 36px;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      position: relative; overflow: hidden;
    }
    .lm-brand-right { border-radius: 0 20px 20px 0; order: 1; }
    .lm-brand-left  { border-radius: 20px 0 0 20px; order: 0; }
    .lm-brand-bg {
      position: absolute; inset: 0; overflow: hidden; pointer-events: none;
    }
    .lm-brand-circle {
      position: absolute; border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.12);
    }
    .lm-brand-content { position: relative; z-index: 1; text-align: center; width: 100%; }
    .lm-brand-avatar {
      width: 72px; height: 72px; border-radius: 50%;
      background: rgba(255,255,255,0.15);
      border: 2px solid rgba(255,255,255,0.3);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px; font-size: 30px; color: #fff;
    }
    .lm-brand h3 {
      font-size: 26px; font-weight: 800; color: #fff;
      margin: 0 0 12px; line-height: 1.2;
      font-family: 'Poppins', sans-serif;
    }
    .lm-brand p {
      font-size: 13px; color: rgba(255,255,255,0.8);
      line-height: 1.75; margin: 0 0 32px;
      font-family: 'Poppins', sans-serif;
    }
    .lm-brand-btn {
      display: inline-block;
      padding: 11px 36px;
      background: transparent;
      color: #fff;
      border: 1.5px solid rgba(255,255,255,0.6);
      border-radius: 50px;
      font-size: 13px; font-weight: 600;
      font-family: 'Poppins', sans-serif;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }
    .lm-brand-btn:hover { background: rgba(255,255,255,0.15); border-color: #fff; }

    /* ── Form Panel ── */
    .lm-form-panel {
      flex: 1;
      padding: 48px 44px;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #fff; overflow-y: auto;
    }
    .lm-form-panel-fp {
      border-radius: 20px;
    }

    /* ── Form Header ── */
    .lm-form-icon {
      width: 52px; height: 52px; border-radius: 14px;
      background: #fef2f2;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px; font-size: 22px; color: #dc2626;
    }
    .lm-form-title {
      font-size: 22px; font-weight: 700; color: #111827;
      margin: 0 0 4px; text-align: center;
      font-family: 'Poppins', sans-serif;
    }
    .lm-form-sub {
      font-size: 13px; color: #9ca3af;
      margin: 0 0 24px; text-align: center;
      font-family: 'Poppins', sans-serif;
    }

    /* ── Input ── */
    .lm-field { position: relative; margin-bottom: 14px; width: 100%; }
    .lm-field-icon {
      position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
      color: #dc2626; font-size: 16px; pointer-events: none;
      display: flex; align-items: center;
    }
    .lm-input {
      width: 100%; padding: 12px 16px 12px 44px;
      background: #f9fafb;
      border: 1.5px solid #f3f4f6;
      border-radius: 12px;
      font-size: 13.5px; font-family: 'Poppins', sans-serif;
      color: #111827; outline: none; box-sizing: border-box;
      transition: border-color 0.2s, background 0.2s;
    }
    .lm-input:focus { border-color: #dc2626; background: #fff; }
    .lm-input::placeholder { color: #9ca3af; }
    .lm-input-otp {
      letter-spacing: 0.3em; font-size: 22px; text-align: center;
      padding: 12px 16px !important;
    }
    .lm-eye-btn {
      position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
      cursor: pointer; background: none; border: none; padding: 0;
      font-size: 16px; color: #9ca3af;
      display: flex; align-items: center;
    }
    .lm-eye-btn:hover { color: #6b7280; }

    /* ── Submit btn ── */
    .lm-submit {
      width: 100%; padding: 13px;
      background: #dc2626; color: #fff;
      border: none; border-radius: 12px;
      font-size: 14px; font-weight: 700;
      font-family: 'Poppins', sans-serif;
      cursor: pointer; margin-top: 4px;
      transition: background 0.2s, transform 0.1s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .lm-submit:hover:not(:disabled) { background: #b91c1c; }
    .lm-submit:active:not(:disabled) { transform: scale(0.99); }
    .lm-submit:disabled { opacity: 0.7; cursor: not-allowed; }

    /* ── Divider ── */
    .lm-divider {
      display: flex; align-items: center; gap: 12px;
      margin: 20px 0; width: 100%;
    }
    .lm-divider-line { flex: 1; height: 1px; background: #f3f4f6; }
    .lm-divider span { font-size: 12px; color: #d1d5db; font-family: 'Poppins', sans-serif; }

    /* ── Error ── */
    .lm-error {
      background: #fef2f2; border: 1px solid #fca5a5;
      color: #dc2626; border-radius: 10px;
      padding: 10px 14px; margin-bottom: 14px;
      font-size: 13px; font-family: 'Poppins', sans-serif;
      width: 100%; box-sizing: border-box;
    }

    /* ── Close btn ── */
    .lm-close {
      position: absolute; top: 16px; right: 18px; z-index: 10;
      background: #f9fafb; border: none;
      width: 32px; height: 32px; border-radius: 50%;
      font-size: 16px; color: #6b7280; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s, color 0.15s;
    }
    .lm-close:hover { background: #fee2e2; color: #dc2626; }

    /* ── Forgot password steps ── */
    .lm-steps {
      display: flex; gap: 6px; margin-bottom: 28px;
    }
    .lm-step-dot {
      height: 4px; border-radius: 2px;
      transition: all 0.3s;
    }
    .lm-back-link {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: #dc2626; cursor: pointer;
      margin-top: 16px; font-family: 'Poppins', sans-serif;
      font-weight: 500;
    }
    .lm-back-link:hover { color: #b91c1c; }
    .lm-forgot-link {
      font-size: 12px; color: #dc2626; cursor: pointer;
      font-family: 'Poppins', sans-serif; font-weight: 500;
    }
    .lm-forgot-link:hover { color: #b91c1c; }

    /* ── Toast ── */
    .lm-toast {
      position: fixed; top: 24px; right: 24px; z-index: 9999;
      min-width: 280px; max-width: 380px;
      padding: 14px 18px;
      border-radius: 12px; font-family: 'Poppins', sans-serif;
      font-size: 13.5px; font-weight: 500;
      display: flex; align-items: center; gap: 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      animation: lm-slide-in 0.3s ease;
    }
    .lm-toast-ok  { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .lm-toast-err { background: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; }
    @keyframes lm-slide-in {
      from { opacity: 0; transform: translateX(40px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    /* ── Success state ── */
    .lm-success-icon {
      width: 72px; height: 72px; border-radius: 50%;
      background: #f0fdf4; border: 2px solid #bbf7d0;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px; font-size: 32px; color: #16a34a;
    }

    /* ══════════════════════════
       MOBILE ≤ 640px
    ══════════════════════════ */
    @media (max-width: 640px) {
      .lm-overlay { padding: 0; align-items: flex-end; }
      .lm-modal {
        flex-direction: column;
        border-radius: 20px 20px 0 0;
        min-height: unset;
        max-width: 100%;
        max-height: 94vh;
        overflow-y: auto;
      }
      .lm-modal-fp {
        border-radius: 20px 20px 0 0;
        max-width: 100%;
      }
      .lm-brand {
        flex: none;
        border-radius: 20px 20px 0 0 !important;
        order: 0 !important;
        padding: 28px 24px;
        min-height: unset;
      }
      .lm-brand-avatar { width: 52px; height: 52px; font-size: 22px; margin-bottom: 14px; }
      .lm-brand h3 { font-size: 20px; margin-bottom: 8px; }
      .lm-brand p { font-size: 12px; margin-bottom: 18px; }
      .lm-brand-btn { padding: 9px 28px; font-size: 12px; }
      .lm-form-panel {
        padding: 28px 24px 36px;
        border-radius: 0 !important;
      }
      .lm-form-panel-fp { border-radius: 20px 20px 0 0 !important; padding: 32px 24px 40px; }
      .lm-form-icon { width: 44px; height: 44px; font-size: 18px; }
      .lm-form-title { font-size: 19px; }
      .lm-close { top: 12px; right: 14px; }
      .lm-toast { top: auto; bottom: 100px; right: 16px; left: 16px; min-width: unset; }
    }

    @media (min-width: 641px) and (max-width: 860px) {
      .lm-brand { flex: 0 0 260px; padding: 36px 24px; }
      .lm-form-panel { padding: 36px 32px; }
    }
  `;
  document.head.appendChild(s);
}

const font = "'Poppins', sans-serif";
const red = "#dc2626";
const darkRed = "#b91c1c";

const BrandPanel = ({ side, icon, heading, body, btnLabel, onBtnClick }) => (
  <div className={`lm-brand ${side === "right" ? "lm-brand-right" : "lm-brand-left"}`}>
    <div className="lm-brand-bg">
      <div className="lm-brand-circle" style={{ width: 320, height: 320, top: -100, right: -120 }} />
      <div className="lm-brand-circle" style={{ width: 200, height: 200, bottom: -60, left: -60 }} />
      <div className="lm-brand-circle" style={{ width: 100, height: 100, bottom: 60, right: 20 }} />
    </div>
    <div className="lm-brand-content">
      <div className="lm-brand-avatar">{icon}</div>
      <h3>{heading}</h3>
      <p>{body}</p>
      <button className="lm-brand-btn" onClick={onBtnClick}>{btnLabel}</button>
    </div>
  </div>
);

const Field = ({ icon: Icon, children }) => (
  <div className="lm-field">
    <span className="lm-field-icon"><Icon /></span>
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

  useEffect(() => { setMode(defaultMode); setLoginError(""); setRegError(""); }, [defaultMode, isOpen]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(""); setLoginLoading(true);
    try {
      const res = await api.post("/auth/login", loginForm);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("user", JSON.stringify({ name: res.data.name, email: res.data.email, role: res.data.role }));
      onClose(); window.location.reload();
    } catch { setLoginError("Invalid email or password!"); }
    finally { setLoginLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setRegError("");
    if (regForm.password !== regForm.confirmPassword) { setRegError("Passwords do not match!"); return; }
    if (regForm.password.length < 6) { setRegError("Password must be at least 6 characters!"); return; }
    setRegLoading(true);
    try {
      const res = await api.post("/auth/register", { name: regForm.name, email: regForm.email, password: regForm.password, phone: regForm.phone });
      const { token, name, email, role } = res.data;
      localStorage.setItem("token", token); localStorage.setItem("userName", name);
      localStorage.setItem("user", JSON.stringify({ name, email, role }));
      localStorage.removeItem("guestCart");
      onClose(); window.location.reload();
    } catch (err) { setRegError(err.response?.data?.message || "Registration failed. Try again!"); }
    finally { setRegLoading(false); }
  };

  const handleFpSendOtp = async () => {
    if (!fpEmail.trim() || !/\S+@\S+\.\S+/.test(fpEmail)) return showToast("Enter a valid email address.", false);
    setFpLoading(true);
    try { await api.post("/auth/forgot-password", { email: fpEmail }); showToast("OTP sent to your email!", true); setFpStep(2); }
    catch { showToast("Something went wrong. Please try again.", false); }
    finally { setFpLoading(false); }
  };

  const handleFpVerifyOtp = async () => {
    if (fpOtp.length !== 6) return showToast("OTP must be 6 digits.", false);
    setFpLoading(true);
    try { await api.post("/auth/verify-otp", { email: fpEmail, otp: fpOtp }); showToast("OTP verified!", true); setFpStep(3); }
    catch (err) { showToast(err.response?.data?.message || "Invalid OTP.", false); }
    finally { setFpLoading(false); }
  };

  const handleFpReset = async () => {
    if (fpNewPassword.length < 8) return showToast("Password must be at least 8 characters.", false);
    if (fpNewPassword !== fpConfirmPassword) return showToast("Passwords do not match.", false);
    setFpLoading(true);
    try { await api.post("/auth/reset-password", { email: fpEmail, otp: fpOtp, newPassword: fpNewPassword }); showToast("Password reset successfully!", true); setFpStep(4); }
    catch (err) { showToast(err.response?.data?.message || "Failed to reset. Try again.", false); }
    finally { setFpLoading(false); }
  };

  const resetFpAndGoLogin = () => {
    setMode("login"); setFpStep(1);
    setFpEmail(""); setFpOtp(""); setFpNewPassword(""); setFpConfirmPassword("");
  };

  if (!isOpen) return null;

  return (
    <>
      {toast.visible && (
        <div className={`lm-toast ${toast.success ? "lm-toast-ok" : "lm-toast-err"}`}>
          {toast.success ? <FiCheck style={{ flexShrink: 0 }} /> : "⚠"}
          {toast.message}
        </div>
      )}

      <div className="lm-overlay" onClick={onClose}>
        <div
          className={`lm-modal ${mode === "forgotPassword" ? "lm-modal-fp" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="lm-close" onClick={onClose} aria-label="Close">✕</button>

          {/* ══ LOGIN ══ */}
          {mode === "login" && (<>
            <BrandPanel
              side="left"
              icon={<FiUser />}
              heading="New here?"
              body={"Create an account to enjoy\nexclusive offers, track orders\nand more."}
              btnLabel="Register"
              onBtnClick={() => { setMode("register"); setLoginError(""); }}
            />
            <div className="lm-form-panel">
              <div className="lm-form-icon"><FiLock /></div>
              <h2 className="lm-form-title">Welcome back</h2>
              <p className="lm-form-sub">Sign in to your account</p>

              {loginError && <div className="lm-error">{loginError}</div>}

              <form onSubmit={handleLogin} style={{ width: "100%" }}>
                <Field icon={FiMail}>
                  <input className="lm-input" type="email" placeholder="Email address"
                    value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
                </Field>
                <Field icon={FiLock}>
                  <input className="lm-input" type={showPass ? "text" : "password"} placeholder="Password"
                    value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
                  <button type="button" className="lm-eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </Field>

                <div style={{ textAlign: "right", marginBottom: "16px", marginTop: "-2px" }}>
                  <span className="lm-forgot-link" onClick={() => { setMode("forgotPassword"); setFpStep(1); }}>
                    Forgot password?
                  </span>
                </div>

                <button type="submit" className="lm-submit" disabled={loginLoading}>
                  {loginLoading ? <><Spinner size="sm" color="white" /> Signing in...</> : "Sign In"}
                </button>
              </form>

              <div className="lm-divider"><div className="lm-divider-line"/><span>or</span><div className="lm-divider-line"/></div>
              <p style={{ fontSize: "13px", color: "#9ca3af", fontFamily: font, margin: 0 }}>
                Don't have an account?{" "}
                <span style={{ color: red, fontWeight: 600, cursor: "pointer" }}
                  onClick={() => { setMode("register"); setLoginError(""); }}>
                  Register
                </span>
              </p>
            </div>
          </>)}

          {/* ══ REGISTER ══ */}
          {mode === "register" && (<>
            <div className="lm-form-panel">
              <div className="lm-form-icon"><FiUser /></div>
              <h2 className="lm-form-title">Create account</h2>
              <p className="lm-form-sub">Join us and start shopping</p>

              {regError && <div className="lm-error">{regError}</div>}

              <form onSubmit={handleRegister} style={{ width: "100%" }}>
                <Field icon={FiUser}>
                  <input className="lm-input" type="text" placeholder="Full name"
                    value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} required />
                </Field>
                <Field icon={FiMail}>
                  <input className="lm-input" type="email" placeholder="Email address"
                    value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} required />
                </Field>
                <Field icon={FiPhone}>
                  <input className="lm-input" type="tel" placeholder="Phone number"
                    value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} maxLength={10} required />
                </Field>
                <Field icon={FiLock}>
                  <input className="lm-input" type={showPass ? "text" : "password"} placeholder="Password"
                    value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} required />
                  <button type="button" className="lm-eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </Field>
                <Field icon={FiLock}>
                  <input className="lm-input" type={showConfirm ? "text" : "password"} placeholder="Confirm password"
                    value={regForm.confirmPassword} onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })} required />
                  <button type="button" className="lm-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </Field>
                <button type="submit" className="lm-submit" disabled={regLoading}>
                  {regLoading ? <><Spinner size="sm" color="white" /> Creating account...</> : "Create Account"}
                </button>
              </form>

              <div className="lm-divider"><div className="lm-divider-line"/><span>or</span><div className="lm-divider-line"/></div>
              <p style={{ fontSize: "13px", color: "#9ca3af", fontFamily: font, margin: 0 }}>
                Already have an account?{" "}
                <span style={{ color: red, fontWeight: 600, cursor: "pointer" }}
                  onClick={() => { setMode("login"); setRegError(""); }}>
                  Sign in
                </span>
              </p>
            </div>

            <BrandPanel
              side="right"
              icon={<FiLock />}
              heading="Welcome back!"
              body={"Already have an account?\nSign in to continue shopping\nwhere you left off."}
              btnLabel="Sign In"
              onBtnClick={() => { setMode("login"); setRegError(""); }}
            />
          </>)}

          {/* ══ FORGOT PASSWORD ══ */}
          {mode === "forgotPassword" && (
            <div className="lm-form-panel lm-form-panel-fp" style={{ width: "100%" }}>

              {fpStep < 4 && (
                <div className="lm-steps">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="lm-step-dot" style={{
                      width: fpStep === s ? "28px" : "10px",
                      background: fpStep > s ? "#16a34a" : fpStep === s ? red : "#e5e7eb",
                    }} />
                  ))}
                </div>
              )}

              {fpStep < 4 ? (
                <div className="lm-form-icon">
                  <FiLock />
                </div>
              ) : (
                <div className="lm-success-icon"><FiCheck /></div>
              )}

              <h2 className="lm-form-title">
                {["", "Forgot password", "Enter OTP", "New password", "All done!"][fpStep]}
              </h2>
              <p className="lm-form-sub">
                {fpStep === 1 && "Enter your registered email and we'll send you an OTP."}
                {fpStep === 2 && `We sent a 6-digit OTP to ${fpEmail}`}
                {fpStep === 3 && "Choose a strong new password."}
                {fpStep === 4 && "Your password has been reset successfully."}
              </p>

              {fpStep === 1 && (
                <>
                  <Field icon={FiMail}>
                    <input className="lm-input" type="email" placeholder="you@example.com"
                      value={fpEmail} onChange={(e) => setFpEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleFpSendOtp()} />
                  </Field>
                  <button className="lm-submit" onClick={handleFpSendOtp} disabled={fpLoading}>
                    {fpLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                  <span className="lm-back-link" onClick={() => setMode("login")}>
                    <FiArrowLeft /> Back to sign in
                  </span>
                </>
              )}

              {fpStep === 2 && (
                <>
                  <div className="lm-field">
                    <input className="lm-input lm-input-otp" type="text" placeholder="• • • • • •"
                      value={fpOtp} maxLength={6}
                      onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => e.key === "Enter" && handleFpVerifyOtp()} />
                  </div>
                  <button className="lm-submit" onClick={handleFpVerifyOtp} disabled={fpLoading}>
                    {fpLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <span className="lm-back-link" onClick={() => { setFpStep(1); setFpOtp(""); }}>
                    <FiArrowLeft /> Resend OTP
                  </span>
                </>
              )}

              {fpStep === 3 && (
                <>
                  <Field icon={FiLock}>
                    <input className="lm-input" type={showPass ? "text" : "password"} placeholder="New password (min. 8 chars)"
                      value={fpNewPassword} onChange={(e) => setFpNewPassword(e.target.value)} />
                    <button type="button" className="lm-eye-btn" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </Field>
                  <Field icon={FiLock}>
                    <input className="lm-input" type={showConfirm ? "text" : "password"} placeholder="Confirm new password"
                      value={fpConfirmPassword} onChange={(e) => setFpConfirmPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleFpReset()} />
                    <button type="button" className="lm-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </Field>
                  <button className="lm-submit" onClick={handleFpReset} disabled={fpLoading}>
                    {fpLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </>
              )}

              {fpStep === 4 && (
                <button className="lm-submit" onClick={resetFpAndGoLogin}>
                  Go to Sign In
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginModal;