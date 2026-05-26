// src/pages/ContactPage.js
import React, { useState } from "react";
import api from "../api/api";

const font = "'Poppins', sans-serif";
import { brand } from "../theme";
const red = brand;
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
  borderRadius: "8px",
  padding: "10px 14px",
  fontSize: "14px",
  fontFamily: font,
  color: "#1f2937",
  background: "#f9fafb",
  outline: "none",
  boxSizing: "border-box",
  marginTop: "6px",
  transition: "border-color 0.2s",
};

const errorInputStyle = {
  ...inputStyle,
  border: "1.5px solid #dc2626",
  background: "#fff5f5",
};

const labelStyle = {
  fontSize: "13px",
  fontWeight: 500,
  color: "#374151",
  fontFamily: font,
  display: "block",
};

const requiredStar = { color: red, marginLeft: "2px" };

const FieldError = ({ msg }) =>
  msg ? (
    <p style={{ color: red, fontSize: "12px", fontFamily: font, margin: "4px 0 0" }}>
      {msg}
    </p>
  ) : null;

const Toast = ({ message, type, visible }) =>
  visible ? (
    <div className={`toast ${type === "success" ? "toast-success" : "toast-error"}`}>
      <span style={{ fontSize: "18px" }}>{type === "success" ? "✅" : "❌"}</span>
      {message}
    </div>
  ) : null;

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500);
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim())    errors.name    = "Name is required.";
    if (!form.email.trim())   errors.email   = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Enter a valid email address.";
    if (!form.message.trim()) errors.message = "Message is required.";
    return errors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstKey = Object.keys(errors)[0];
      document.getElementsByName(firstKey)[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setLoading(true);
    try {
      await api.post("/contact", form);
      setForm({ name: "", email: "", subject: "", phone: "", message: "" });
      setFieldErrors({});
      showToast("Message sent! We'll get back to you within 24 hours.", "success");
    } catch (err) {
      showToast(
        err.response?.data?.error || "Failed to send message. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const inp = (name) => (fieldErrors[name] ? errorInputStyle : inputStyle);

  return (
    <div style={{ background: "#fff", fontFamily: font }}>

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

        /* ── Contact Page Mobile Styles ── */
        .contact-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 48px;
        }
        .contact-title {
          text-align: center;
          font-size: 40px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 48px;
          font-family: 'Poppins', sans-serif;
        }
        .contact-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 20px;
        }
        .contact-submit-btn {
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 30px;
          padding: 12px 32px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          transition: background 0.2s;
          width: auto;
        }
        .contact-submit-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        .contact-submit-btn:hover:not(:disabled) {
          background: #b91c1c;
        }

        @media (max-width: 640px) {
          .contact-wrapper {
            padding: 16px 16px 32px;
          }
          .contact-title {
            font-size: 26px;
            margin-bottom: 28px;
          }
          .contact-row {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-bottom: 16px;
          }
          .contact-submit-btn {
            width: 100%;
            padding: 14px 32px;
            font-size: 16px;
          }
          .toast {
            top: auto;
            bottom: 16px;
            right: 16px;
            left: 16px;
            max-width: unset;
            min-width: unset;
          }
        }

        @media (min-width: 641px) and (max-width: 900px) {
          .contact-wrapper {
            padding: 20px 24px;
          }
          .contact-title {
            font-size: 32px;
            margin-bottom: 36px;
          }
        }
      `}</style>

      <div className="contact-wrapper">

        <h1 className="contact-title">Contact Us</h1>

        <form onSubmit={handleSubmit} noValidate>

          {/* Row 1 — Name + Email */}
          <div className="contact-row">
            <div>
              <label style={labelStyle}>Your name <span style={requiredStar}>*</span></label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                style={inp("name")}
                onFocus={(e) => (e.target.style.borderColor = red)}
                onBlur={(e) => (e.target.style.borderColor = fieldErrors.name ? red : "#d1d5db")}
              />
              <FieldError msg={fieldErrors.name} />
            </div>
            <div>
              <label style={labelStyle}>Your email <span style={requiredStar}>*</span></label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={inp("email")}
                onFocus={(e) => (e.target.style.borderColor = red)}
                onBlur={(e) => (e.target.style.borderColor = fieldErrors.email ? red : "#d1d5db")}
              />
              <FieldError msg={fieldErrors.email} />
            </div>
          </div>

          {/* Row 2 — Subject + Phone */}
          <div className="contact-row">
            <div>
              <label style={labelStyle}>Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                style={inp("subject")}
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
                style={inp("phone")}
                onFocus={(e) => (e.target.style.borderColor = red)}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
            </div>
          </div>

          {/* Row 3 — Message */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>Your message <span style={requiredStar}>*</span></label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={8}
              style={{
                ...inp("message"),
                resize: "vertical",
                minHeight: "200px",
              }}
              onFocus={(e) => (e.target.style.borderColor = red)}
              onBlur={(e) => (e.target.style.borderColor = fieldErrors.message ? red : "#d1d5db")}
            />
            <FieldError msg={fieldErrors.message} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="contact-submit-btn"
          >
            {loading ? "Sending..." : "Send"}
          </button>

        </form>
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </div>
  );
};

export default ContactPage;