import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const font = "'Poppins', sans-serif";
const red = "#dc2626";
const darkRed = "#b91c1c";

const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      setProduct(e.detail);
      setOpen(true);
    };
    window.addEventListener("showCartDrawer", handler);
    return () => window.removeEventListener("showCartDrawer", handler);
  }, []);

  const handleClose = () => setOpen(false);

  const handleViewCart = () => {
    setOpen(false);
    navigate("/cart");
  };

  return (
    <>
      <style>{`
        @keyframes drawerSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes drawerSlideOut {
          from { transform: translateX(0);    opacity: 1; }
          to   { transform: translateX(100%); opacity: 0; }
        }
        .cart-drawer {
          animation: drawerSlideIn 0.32s cubic-bezier(0.4,0,0.2,1) forwards;
        }
      `}</style>

      {/* Overlay */}
      {open && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 1100,
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Drawer */}
      {open && (
        <div
          className="cart-drawer"
          style={{
            position: "fixed", top: 0, right: 0,
            width: "360px", height: "100vh",
            background: "#fff",
            boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
            zIndex: 1200,
            display: "flex", flexDirection: "column",
            fontFamily: font,
          }}
        >
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid #f3f4f6",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="16" height="16" fill="none" stroke={red} strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#111827", fontFamily: font }}>
                Added to Cart
              </span>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: "none", border: "none", fontSize: "20px",
                color: "#9ca3af", cursor: "pointer", lineHeight: 1, padding: "4px",
              }}
            >
              ✕
            </button>
          </div>

          {/* Product */}
          {product && (
            <div style={{ padding: "24px", flex: 1 }}>
              <div style={{
                display: "flex", gap: "16px", alignItems: "center",
                background: "#fafafa", borderRadius: "12px",
                border: "1px solid #f3f4f6", padding: "16px",
              }}>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      width: "80px", height: "80px", objectFit: "contain",
                      borderRadius: "8px", background: "#fff",
                      border: "1px solid #e5e7eb", padding: "6px", flexShrink: 0,
                    }}
                  />
                ) : (
                  <div style={{
                    width: "80px", height: "80px", borderRadius: "8px",
                    background: "#fff7ed", border: "1px solid #e5e7eb",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "32px", flexShrink: 0,
                  }}>
                    🌶️
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: "15px", fontWeight: 600, color: "#111827",
                    fontFamily: font, margin: "0 0 6px",
                    lineHeight: 1.4,
                  }}>
                    {product.name}
                  </p>
                  <p style={{
                    fontSize: "13px", color: "#6b7280",
                    fontFamily: font, margin: "0 0 8px",
                  }}>
                    Weight: {product.weight || "250g"}
                  </p>
                  <span style={{
                    fontSize: "16px", fontWeight: 700, color: red, fontFamily: font,
                  }}>
                    ₹{product.price}
                  </span>
                </div>
              </div>

              {/* Success badge */}
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                marginTop: "16px", padding: "10px 14px",
                background: "#f0fdf4", borderRadius: "8px",
                border: "1px solid #bbf7d0",
              }}>
                <svg width="16" height="16" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span style={{ fontSize: "13px", color: "#166534", fontFamily: font, fontWeight: 500 }}>
                  Item successfully added to your cart
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ padding: "0 24px 32px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              onClick={handleViewCart}
              style={{
                width: "100%", padding: "13px",
                background: red, color: "#fff",
                border: "none", borderRadius: "50px",
                fontSize: "14px", fontWeight: 700, fontFamily: font,
                cursor: "pointer", transition: "background 0.2s",
              }}
              onMouseOver={(e) => e.currentTarget.style.background = darkRed}
              onMouseOut={(e) => e.currentTarget.style.background = red}
            >
              View Cart
            </button>
            <button
              onClick={handleClose}
              style={{
                width: "100%", padding: "13px",
                background: "transparent", color: "#374151",
                border: "1.5px solid #e5e7eb", borderRadius: "50px",
                fontSize: "14px", fontWeight: 600, fontFamily: font,
                cursor: "pointer", transition: "border-color 0.2s",
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = red}
              onMouseOut={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;