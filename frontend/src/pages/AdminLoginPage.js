import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

if (typeof document !== "undefined" && !document.getElementById("poppins-font")) {
  const link = document.createElement("link");
  link.id = "poppins-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap";
  document.head.appendChild(link);
}

const font = "'Poppins', sans-serif";
const green = "#6abf5e";
const greenPanel = "#c6dfb4";
const dark = "#1f2937";

/* ─── Spice decorative SVG (same as customer pages) ─── */
const SpiceDecor = () => (
  <svg
    width="100%" height="100%"
    viewBox="0 0 280 420" fill="none"
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
  color: dark,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const InputWrapper = ({ icon: Icon, children }) => (
  <div style={{ position: "relative", marginBottom: "14px" }}>
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

const eyeBtn = {
  position: "absolute", right: "14px", top: "50%",
  transform: "translateY(-50%)", cursor: "pointer",
  fontSize: "16px", color: "#9ca3af",
  background: "none", border: "none", padding: 0,
  display: "flex", alignItems: "center",
};

function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      if (res.data.role !== 'ADMIN') {
        setError('Access denied! Admins only.');
        setLoading(false);
        return;
      }
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminName', res.data.name);
      localStorage.setItem('role', res.data.role);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid email or password!');
      setLoading(false);
    }
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
        maxWidth: "680px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 16px 48px rgba(0,0,0,0.13)",
        minHeight: "380px",
      }}>

        {/* ── Green Panel ── */}
        <div style={{
          flex: "0 0 260px",
          background: greenPanel,
          borderRadius: "16px 0 0 16px",
          padding: "40px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <SpiceDecor />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            {/* Logo circle */}
            <div
              onClick={() => navigate('/')}
              style={{
                width: "60px", height: "60px",
                background: "#dc2626", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 900, fontSize: "11px",
                letterSpacing: "0.05em", fontFamily: font,
                cursor: "pointer", margin: "0 auto 20px",
              }}
            >
              LOGO
            </div>
            <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#1a2e1a", fontFamily: font, lineHeight: 1.2, marginBottom: "12px" }}>
              Admin<br />Panel
            </h2>
            <p style={{ fontSize: "13px", color: "#4b5563", fontFamily: font, lineHeight: 1.7, margin: 0 }}>
              Manage your Masala<br />Store from here 🌶️
            </p>
            <p
              onClick={() => navigate('/')}
              style={{
                marginTop: "28px", fontSize: "13px", color: "#374151",
                fontFamily: font, cursor: "pointer",
              }}
            >
              ← <span style={{ fontWeight: 600 }}>Back to Store</span>
            </p>
          </div>
        </div>

        {/* ── White Panel ── */}
        <div style={{
          flex: 1,
          background: "#fff",
          borderRadius: "0 16px 16px 0",
          padding: "40px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: dark, fontFamily: font, marginBottom: "22px", alignSelf: "flex-start" }}>
            Sign In
          </h2>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fca5a5",
              color: "#dc2626", borderRadius: "8px",
              padding: "9px 13px", marginBottom: "16px",
              fontSize: "13px", fontFamily: font,
              width: "100%", boxSizing: "border-box",
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <InputWrapper icon={FiMail}>
              <input
                style={inputStyle}
                type="email" name="email"
                placeholder="Email address"
                value={form.email} onChange={handleChange} required
                onFocus={e => e.target.style.borderColor = green}
                onBlur={e => e.target.style.borderColor = "transparent"}
              />
            </InputWrapper>

            <InputWrapper icon={FiLock}>
              <input
                style={{ ...inputStyle, paddingRight: "44px" }}
                type={showPass ? "text" : "password"} name="password"
                placeholder="Password"
                value={form.password} onChange={handleChange} required
                onFocus={e => e.target.style.borderColor = green}
                onBlur={e => e.target.style.borderColor = "transparent"}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={eyeBtn}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </InputWrapper>

            <button
              type="submit" disabled={loading}
              style={{
                marginTop: "8px", width: "100%", padding: "11px",
                background: loading ? "#9ca3af" : dark,
                color: "#fff", border: "none", borderRadius: "50px",
                fontFamily: font, fontWeight: 700, fontSize: "14px",
                letterSpacing: "0.05em", textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.background = "#dc2626"; }}
              onMouseOut={e => { if (!loading) e.currentTarget.style.background = dark; }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;