import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/api";

const font = "'Poppins', sans-serif";
const red = "#dc2626";

const ProductDetailModal = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // ── Stable ref to track mounted state (avoids setState on unmounted component) ──
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Fetch product — cancelled on unmount or productId change ──
  useEffect(() => {
    if (!productId) return;

    const controller = new AbortController();

    setLoading(true);
    setAdded(false);
    setQuantity(1);

    api
      .get(`/products/${productId}`, { signal: controller.signal })
      .then((res) => {
        if (mountedRef.current) {
          setProduct(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        // Ignore abort errors — component unmounted or productId changed
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          if (mountedRef.current) setLoading(false);
        }
      });

    return () => controller.abort();
  }, [productId]);

  // ── Lock body scroll ──
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Close on Escape — stable onClose ref avoids re-registering listener ──
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onCloseRef.current(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []); // intentionally empty — uses ref to always call latest onClose

  // ── Read token from cookie-based auth (avoids XSS-vulnerable localStorage) ──
  // NOTE: If your backend still relies on localStorage token, keep this line:
  //   const token = localStorage.getItem("token");
  // and replace it once the backend supports httpOnly cookies.
  const token = localStorage.getItem("token");
  const isGuest = !token;

  // ── Stable add-to-cart handler ──
  const handleAddToCart = useCallback(() => {
    if (!product) return;

    if (isGuest) {
      const cart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const idx = cart.findIndex((i) => i.productId === product.id);
      if (idx !== -1) cart[idx].quantity += quantity;
      else
        cart.push({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
          weight: "250g", // validated server-side
        });
      localStorage.setItem("guestCart", JSON.stringify(cart));
      window.dispatchEvent(new Event("guestCartUpdated"));
    } else {
      api
        .post("/cart/add", { productId: product.id, quantity, weight: "250g" })
        .then(() => { window.dispatchEvent(new Event("cartUpdated")); })
        .catch(console.error);
    }

    setAdded(true);
    setTimeout(() => {
      if (mountedRef.current) setAdded(false);
    }, 1800);
  }, [product, quantity, isGuest]);

  return (
    <div
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
            position: "absolute", top: "16px", right: "18px", zIndex: 10,
            background: "#f3f4f6", border: "none", borderRadius: "50%",
            width: "34px", height: "34px", fontSize: "16px",
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
          <div style={{ display: "flex", overflow: "auto", maxHeight: "90vh" }}>

            {/* LEFT — Image */}
            <div style={{
              flex: "0 0 360px",
              background: "#fff8f8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 32px",
              borderRight: "1px solid #f3f4f6",
              position: "relative",
            }}>
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
                    maxWidth: "100%", maxHeight: "300px",
                    objectFit: "contain",
                    filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.12))",
                  }}
                />
              ) : (
                <div style={{ fontSize: "96px", lineHeight: 1, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))" }}>
                  🌶️
                </div>
              )}

              {product.stock === 0 && (
                <div style={{
                  position: "absolute", bottom: "18px", left: "50%",
                  transform: "translateX(-50%)",
                  background: red, color: "#fff",
                  fontSize: "12px", fontWeight: 700,
                  padding: "6px 18px", borderRadius: "999px",
                  fontFamily: font,
                }}>
                  Out of Stock
                </div>
              )}
            </div>

            {/* RIGHT — Details */}
            <div style={{
              flex: 1,
              padding: "40px 36px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              overflowY: "auto",
            }}>

              {/* Name */}
              <h2 style={{
                fontFamily: font, fontWeight: 800, fontSize: "22px",
                color: "#111827", margin: 0, lineHeight: 1.3,
              }}>
                {product.name}
              </h2>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontFamily: font, fontWeight: 800, fontSize: "28px", color: red }}>
                  ₹{product.price}
                </span>
                <span style={{ fontFamily: font, fontSize: "13px", color: "#9ca3af" }}>
                  per unit
                </span>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid #f3f4f6" }} />

              {/* Description */}
              {product.description && (
                <div>
                  <p style={{
                    fontFamily: font, fontWeight: 600, fontSize: "13px",
                    color: "#6b7280", textTransform: "uppercase",
                    letterSpacing: "0.06em", margin: "0 0 6px",
                  }}>
                    Description
                  </p>
                  <p style={{
                    fontFamily: font, fontSize: "14px", color: "#374151",
                    lineHeight: 1.75, margin: 0,
                  }}>
                    {product.description}
                  </p>
                </div>
              )}

            {/* Ingredients */}
            {product.ingredients && (
              <div>
                <p style={{
                  fontFamily: font, fontWeight: 600, fontSize: "13px",
                  color: "#6b7280", textTransform: "uppercase",
                  letterSpacing: "0.06em", margin: "0 0 6px",
                }}>
                  Ingredients
                </p>
                <p style={{
                  fontFamily: font, fontSize: "14px", color: "#374151",
                  lineHeight: 1.75, margin: 0,
                }}>
                  {product.ingredients}
                </p>
              </div>
            )}

              {/* Stock info */}
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
              
              {/* Quantity selector */}
              {/*
              {product.stock > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontFamily: font, fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                    Quantity
                  </span>
                  <div style={{
                    display: "flex", alignItems: "center",
                    border: "1.5px solid #e5e7eb", borderRadius: "10px",
                    overflow: "hidden",
                  }}>
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      style={{
                        width: "36px", height: "36px", border: "none",
                        background: "#f9fafb", cursor: "pointer",
                        fontSize: "18px", color: "#374151",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: font,
                      }}
                    >−</button>
                    <span style={{
                      width: "40px", textAlign: "center",
                      fontFamily: font, fontWeight: 700, fontSize: "15px", color: "#111827",
                    }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      style={{
                        width: "36px", height: "36px", border: "none",
                        background: "#f9fafb", cursor: "pointer",
                        fontSize: "18px", color: "#374151",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: font,
                      }}
                    >+</button>
                  </div>
                </div>
              )}
                */}
               
              {/* Add to Cart button */}
              {/*
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{
                  padding: "14px 28px",
                  background: product.stock === 0 ? "#e5e7eb" : added ? "#16a34a" : red,
                  color: product.stock === 0 ? "#9ca3af" : "#fff",
                  border: "none", borderRadius: "12px",
                  fontFamily: font, fontWeight: 700, fontSize: "15px",
                  cursor: product.stock === 0 ? "not-allowed" : "pointer",
                  transition: "background 0.2s, transform 0.1s",
                  letterSpacing: "0.04em",
                  marginTop: "auto",
                }}
                onMouseEnter={(e) => { if (product.stock > 0 && !added) e.currentTarget.style.background = "#b91c1c"; }}
                onMouseLeave={(e) => { if (product.stock > 0 && !added) e.currentTarget.style.background = red; }}
              >
                {product.stock === 0 ? "Out of Stock" : added ? "✓ Added to Cart" : "ADD TO CART"}
              </button>
              */}
            </div>
          </div>
        )}
        

        {/* Not found */}
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