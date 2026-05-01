// src/pages/ContactPage.js
import React, { useState } from "react";
const font = "'Poppins', sans-serif";
const red = "#dc2626";

/* ─── Inject Poppins once ─── */
if (typeof document !== "undefined" && !document.getElementById("poppins-font")) {
  const link = document.createElement("link");
  link.id = "poppins-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

const inputStyle = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  padding: "12px 14px",
  fontSize: "14px",
  fontFamily: font,
  color: "#111827",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block",
  fontSize: "14px",
  fontFamily: font,
  color: "#374151",
  marginBottom: "6px",
};

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div style={{ background: "#fff", fontFamily: font }}>

      {/* ── Main Content ── */}
<div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 48px" }}>
        {/* ── Page Title ── */}
        <h1 style={{
          textAlign: "center",
          fontSize: "40px",
          fontWeight: 600,
          color: "#1f2937",
          marginBottom: "48px",
          fontFamily: font,
        }}>
          Contact Us
        </h1>

        {submitted ? (
          /* ── Success State ── */
          <div style={{
            maxWidth: "480px",
            margin: "0 auto",
            textAlign: "center",
            padding: "48px 32px",
            border: "1px solid #d1fae5",
            borderRadius: "12px",
            background: "#f0fdf4",
          }}>
            <div style={{
              width: "56px", height: "56px",
              background: "#dcfce7",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "24px",
              color: "#16a34a",
            }}>✓</div>
            <h3 style={{ fontFamily: font, fontWeight: 600, fontSize: "18px", color: "#111827", marginBottom: "8px" }}>
              Message Sent!
            </h3>
            <p style={{ fontFamily: font, fontSize: "14px", color: "#6b7280" }}>
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", phone: "", message: "" }); }}
              style={{ marginTop: "20px", background: "none", border: "none", color: red, fontFamily: font, fontSize: "14px", cursor: "pointer", textDecoration: "underline" }}
            >
              Send another message
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit}>

            {/* Row 1 — Name + Email */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              <div>
                <label style={labelStyle}>Your name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = red)}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>
              <div>
                <label style={labelStyle}>Your email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = red)}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>
            </div>

            {/* Row 2 — Subject + Phone */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              <div>
                <label style={labelStyle}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = red)}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>
              <div>
                <label style={labelStyle}>Your Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = red)}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>
            </div>

            {/* Row 3 — Message (full width) */}
            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>Your message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={8}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: "200px",
                }}
                onFocus={(e) => (e.target.style.borderColor = red)}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 28px",
                background: "#fff",
                color: "#111827",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontFamily: font,
                fontSize: "14px",
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "border-color 0.2s, color 0.2s",
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = red; e.currentTarget.style.color = red; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.color = "#111827"; }}
            >
              {loading ? "Sending..." : "Send"}
            </button>

          </form>
        )}
      </div>



      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;