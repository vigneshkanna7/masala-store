import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const font = "'Poppins', sans-serif";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);

  const orderDetails = location.state || {};
  const isGuest = !localStorage.getItem("token");

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate("/");
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh", background: "#fff7ed",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", fontFamily: font,
    }}>
      <div style={{
        background: "#fff", borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: "40px 32px", width: "100%", maxWidth: "440px",
        textAlign: "center",
      }}>

        {/* Success Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div style={{
            background: "#dcfce7", borderRadius: "50%",
            padding: "20px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg style={{ width: "64px", height: "64px", color: "#22c55e" }}
              fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#16a34a", marginBottom: "8px", fontFamily: font }}>
          Order Placed! 🎉
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "14px", fontFamily: font }}>
          Thank you for your order. We'll deliver fresh masalas to you soon!
        </p>

        {/* Order Summary */}
        {orderDetails.orderId && (
          <div style={{
            background: "#fff7ed", border: "1px solid #fed7aa",
            borderRadius: "10px", padding: "16px", marginBottom: "24px", textAlign: "left",
          }}>
            <h3 style={{ fontWeight: 600, color: "#ea580c", marginBottom: "10px", fontSize: "14px", fontFamily: font }}>
              Order Summary
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#6b7280", fontFamily: font }}>
              {orderDetails.orderId && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Order ID:</span>
                  <span style={{ fontWeight: 600, color: "#1f2937" }}>#{orderDetails.orderId}</span>
                </div>
              )}
              {orderDetails.name && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Name:</span>
                  <span style={{ fontWeight: 600, color: "#1f2937" }}>{orderDetails.name}</span>
                </div>
              )}
              {orderDetails.phone && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Phone:</span>
                  <span style={{ fontWeight: 600, color: "#1f2937" }}>{orderDetails.phone}</span>
                </div>
              )}
              {orderDetails.address && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span>Address:</span>
                  <span style={{ fontWeight: 600, color: "#1f2937", textAlign: "right", maxWidth: "60%" }}>
                    {orderDetails.address}
                  </span>
                </div>
              )}
              {orderDetails.total && (
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  borderTop: "1px solid #fed7aa", paddingTop: "8px", marginTop: "4px",
                }}>
                  <span style={{ fontWeight: 600, color: "#1f2937" }}>Total:</span>
                  <span style={{ fontWeight: 700, color: "#ea580c" }}>₹{orderDetails.total}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guest nudge */}
        {isGuest && (
          <div style={{
            background: "#fefce8", border: "1px solid #fde68a",
            borderRadius: "10px", padding: "12px", marginBottom: "24px",
            fontSize: "13px", color: "#92400e", fontFamily: font,
          }}>
            💡 Create an account to track all your orders anytime!
          </div>
        )}

        {/* Countdown */}
        <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "24px", fontFamily: font }}>
          Redirecting to home in{" "}
          <span style={{ color: "#f97316", fontWeight: 700 }}>{countdown}s</span>...
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "#f97316", color: "#fff", border: "none",
              borderRadius: "8px", padding: "12px", fontSize: "15px",
              fontWeight: 600, fontFamily: font, cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => e.target.style.background = "#ea580c"}
            onMouseOut={(e) => e.target.style.background = "#f97316"}
          >
            Continue Shopping
          </button>

          {!isGuest && (
            <button
              onClick={() => navigate("/orders")}
              style={{
                background: "transparent", color: "#f97316",
                border: "1px solid #f97316", borderRadius: "8px",
                padding: "12px", fontSize: "15px", fontWeight: 600,
                fontFamily: font, cursor: "pointer", transition: "background 0.2s",
              }}
              onMouseOver={(e) => e.target.style.background = "#fff7ed"}
              onMouseOut={(e) => e.target.style.background = "transparent"}
            >
              View My Orders
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;