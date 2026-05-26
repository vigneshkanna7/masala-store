import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/api";

const font = "'Poppins', sans-serif";
import { brand } from "../theme";
const red = brand;
/* ─── Mobile styles ─── */
if (typeof document !== "undefined" && !document.getElementById("pdm-mobile-css")) {
  const s = document.createElement("style");
  s.id = "pdm-mobile-css";
  s.textContent = `
    @media (max-width: 640px) {
      .pdm-wrap    { padding: 12px !important; }
      .pdm-inner   { border-radius: 14px !important; max-height: 92vh !important; }
      .pdm-content { flex-direction: column !important; }
      .pdm-left    {
        flex: none !important;
        width: 100% !important;
        padding: 28px 20px 20px !important;
        border-right: none !important;
        border-bottom: 1px solid #f3f4f6 !important;
        min-height: 200px !important;
      }
      .pdm-left img { max-height: 180px !important; }
      .pdm-right   { padding: 20px 18px 24px !important; gap: 12px !important; }
      .pdm-name    { font-size: 18px !important; }
      .pdm-price   { font-size: 22px !important; }
    }
  `;
  document.head.appendChild(s);
}

const ProductDetailModal = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!productId) return;
    const controller = new AbortController();
    setLoading(true);
    setAdded(false);
    setQuantity(1);
    api
      .get(`/products/${productId}`, { signal: controller.signal })
      .then((res) => {
        if (mountedRef.current) { setProduct(res.data); setLoading(false); }
      })
      .catch((err) => {
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          if (mountedRef.current) setLoading(false);
        }
      });
    return () => controller.abort();
  }, [productId]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onCloseRef.current(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const token = localStorage.getItem("token");
  const isGuest = !token;

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    if (isGuest) {
      const cart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const idx = cart.findIndex((i) => i.productId === product.id);
      if (idx !== -1) cart[idx].quantity += quantity;
      else cart.push({ productId: product.id, productName: product.name, price: product.price, quantity, weight: "250g" });
      localStorage.setItem("guestCart", JSON.stringify(cart));
      window.dispatchEvent(new Event("guestCartUpdated"));
    } else {
      api.post("/cart/add", { productId: product.id, quantity, weight: "250g" })
        .then(() => { window.dispatchEvent(new Event("cartUpdated")); })
        .catch(console.error);
    }
    setAdded(true);
    setTimeout(() => { if (mountedRef.current) setAdded(false); }, 1800);
  }, [product, quantity, isGuest]);

  return (
    <div
      className="pdm-wrap"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(3px)",
        zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
        fontFamily: font,
      }}
    >
      <div
        className="pdm-inner"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "820px",
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "14px", right: "14px", zIndex: 10,
            background: "#f3f4f6", border: "none", borderRadius: "50%",
            width: "32px", height: "32px", fontSize: "15px",
            color: "#6b7280", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e7eb")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#f3f4f6")}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Loading */}
        {loading && (
          <div style={{ padding: "80px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
            Loading...
          </div>
        )}

        {/* Product Content */}
        {!loading && product && (
          <div
            className="pdm-content"
            style={{ display: "flex", overflow: "auto", maxHeight: "90vh" }}
          >
            {/* LEFT — Image */}
            <div
              className="pdm-left"
              style={{
                flex: "0 0 340px",
                background: "#fff8f8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 32px",
                borderRight: "1px solid #f3f4f6",
                position: "relative",
              }}
            >
              {product.category && (
                <div style={{
                  position: "absolute", top: "18px", left: "18px",
                  background: "#fee2e2", color: red,
                  fontSize: "11px", fontWeight: 700,
                  padding: "4px 12px", borderRadius: "999px",
                  fontFamily: font, textTransform: "uppercase", letterSpacing: "0.06em",
                }}>
                  {product.category}
                </div>
              )}

              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{
                    maxWidth: "100%", maxHeight: "280px",
                    objectFit: "contain",
                    filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.12))",
                  }}
                />
              ) : (
                <div style={{ fontSize: "80px", lineHeight: 1 }}>🌶️</div>
              )}

              {product.stock === 0 && (
                <div style={{
                  position: "absolute", bottom: "18px", left: "50%",
                  transform: "translateX(-50%)",
                  background: red, color: "#fff",
                  fontSize: "12px", fontWeight: 700,
                  padding: "6px 18px", borderRadius: "999px",
                  fontFamily: font, whiteSpace: "nowrap",
                }}>
                  Out of Stock
                </div>
              )}
            </div>

            {/* RIGHT — Details */}
            <div
              className="pdm-right"
              style={{
                flex: 1,
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                overflowY: "auto",
              }}
            >
              <h2
                className="pdm-name"
                style={{
                  fontFamily: font, fontWeight: 800, fontSize: "22px",
                  color: "#111827", margin: 0, lineHeight: 1.3,
                }}
              >
                {product.name}
              </h2>

              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span
                  className="pdm-price"
                  style={{ fontFamily: font, fontWeight: 800, fontSize: "28px", color: red }}
                >
                  ₹{product.price}
                </span>
                <span style={{ fontFamily: font, fontSize: "13px", color: "#9ca3af" }}>per unit</span>
              </div>

              <div style={{ borderTop: "1px solid #f3f4f6" }} />

              {product.description && (
                <div>
                  <p style={{
                    fontFamily: font, fontWeight: 600, fontSize: "12px",
                    color: "#6b7280", textTransform: "uppercase",
                    letterSpacing: "0.06em", margin: "0 0 6px",
                  }}>
                    Description
                  </p>
                  <p style={{ fontFamily: font, fontSize: "14px", color: "#374151", lineHeight: 1.75, margin: 0 }}>
                    {product.description}
                  </p>
                </div>
              )}

              {product.ingredients && (
                <div>
                  <p style={{
                    fontFamily: font, fontWeight: 600, fontSize: "12px",
                    color: "#6b7280", textTransform: "uppercase",
                    letterSpacing: "0.06em", margin: "0 0 6px",
                  }}>
                    Ingredients
                  </p>
                  <p style={{ fontFamily: font, fontSize: "14px", color: "#374151", lineHeight: 1.75, margin: 0 }}>
                    {product.ingredients}
                  </p>
                </div>
              )}

              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: product.stock > 0 ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${product.stock > 0 ? "#bbf7d0" : "#fca5a5"}`,
                borderRadius: "8px", padding: "8px 14px",
                width: "fit-content",
              }}>
                <span style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: product.stock > 0 ? "#16a34a" : red,
                  display: "inline-block",
                }} />
                <span style={{
                  fontFamily: font, fontSize: "13px", fontWeight: 600,
                  color: product.stock > 0 ? "#15803d" : red,
                }}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>
        )}

        {!loading && !product && (
          <div style={{ padding: "80px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
            Product not found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailModal;