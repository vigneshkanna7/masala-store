import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { CartSkeleton } from "../components/SkeletonCard";

const WEIGHT_OPTIONS = ["250g", "500g", "750g", "1kg"];
const WEIGHT_MULTIPLIERS = { "250g": 0.25, "500g": 0.50, "750g": 0.75, "1kg": 1.0 };

if (typeof document !== "undefined" && !document.getElementById("poppins-font")) {
  const link = document.createElement("link");
  link.id = "poppins-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

/* ─── Mobile-only styles ─── */
if (typeof document !== "undefined" && !document.getElementById("cart-mobile-css")) {
  const s = document.createElement("style");
  s.id = "cart-mobile-css";
  s.textContent = `
    @media (max-width: 768px) {
      .cp-page       { padding: 20px 12px !important; }
      .cp-title      { font-size: 24px !important; margin-bottom: 20px !important; }
      .cp-card       { flex-direction: column !important; gap: 12px !important; padding: 14px !important; }
      .cp-card-img   { width: 64px !important; height: 64px !important; }
      .cp-card-top   { flex-direction: column !important; align-items: flex-start !important; gap: 4px !important; }
      .cp-prod-name  { font-size: 15px !important; }
      .cp-price-tag  { font-size: 15px !important; }
      .cp-summary    { padding: 14px 16px !important; }
    }
  `;
  document.head.appendChild(s);
}

const font = "'Poppins', sans-serif";

const styles = {
  page: { background: "#fff", minHeight: "100vh", fontFamily: font, padding: "40px 24px" },
  container: { maxWidth: "860px", margin: "0 auto" },
  pageTitle: { fontSize: "32px", fontWeight: 700, color: "#1f2937", marginBottom: "32px", fontFamily: font },
  card: {
    background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px",
    padding: "20px 24px", marginBottom: "16px", display: "flex", gap: "20px", alignItems: "flex-start",
  },
  productImage: {
    width: "80px", height: "80px", objectFit: "contain", borderRadius: "8px",
    background: "#f9fafb", border: "1px solid #e5e7eb", padding: "6px", flexShrink: 0,
  },
  productImagePlaceholder: {
    width: "80px", height: "80px", borderRadius: "8px", background: "#f3f4f6",
    border: "1px solid #e5e7eb", display: "flex", alignItems: "center",
    justifyContent: "center", flexShrink: 0, fontSize: "24px",
  },
  cardBody: { flex: 1, display: "flex", flexDirection: "column", gap: "12px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  productName: { fontSize: "17px", fontWeight: 600, color: "#1f2937", fontFamily: font, margin: 0 },
  priceTag: { fontSize: "17px", fontWeight: 700, color: "#1f2937", fontFamily: font },
  rowLabel: { fontSize: "13px", color: "#6b7280", fontFamily: font, marginRight: "8px", minWidth: "52px" },
  weightBtn: (active) => ({
    padding: "5px 14px", fontSize: "13px", fontWeight: 500, fontFamily: font,
    border: active ? "2px solid #dc2626" : "1px solid #d1d5db",
    background: active ? "#dc2626" : "#fff",
    color: active ? "#fff" : "#374151",
    borderRadius: "6px", cursor: "pointer", marginRight: "6px", transition: "all 0.15s",
  }),
  removeBtn: {
    background: "#dc2626", color: "#fff", border: "none", borderRadius: "30px",
    padding: "8px 24px", fontSize: "13px", fontWeight: 600, fontFamily: font,
    cursor: "pointer", transition: "background 0.2s", alignSelf: "flex-start",
  },
  divider: { border: "none", borderTop: "1px solid #f3f4f6", margin: "8px 0" },
  summaryBox: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px 24px", marginTop: "8px" },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "15px", color: "#6b7280", fontFamily: font },
  summaryTotal: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid #e5e7eb", marginTop: "4px" },
  totalLabel: { fontSize: "17px", fontWeight: 600, color: "#1f2937", fontFamily: font },
  totalValue: { fontSize: "22px", fontWeight: 700, color: "#1f2937", fontFamily: font },
  checkoutBtn: {
    width: "100%", marginTop: "16px", background: "#dc2626", color: "#fff",
    border: "none", borderRadius: "30px", padding: "14px", fontSize: "16px",
    fontWeight: 600, fontFamily: font, cursor: "pointer", transition: "background 0.2s",
  },
  emptyBox: { textAlign: "center", padding: "80px 24px" },
  emptyText: { color: "#6b7280", fontSize: "17px", fontFamily: font, marginBottom: "20px" },
  shopBtn: {
    background: "#dc2626", color: "#fff", border: "none", borderRadius: "30px",
    padding: "12px 32px", fontSize: "15px", fontWeight: 600, fontFamily: font, cursor: "pointer",
  },
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isGuest = !token;

  const attachBasePrice = (items) =>
    items.map((item) => {
      if (item.basePrice) return item;
      const multiplier = WEIGHT_MULTIPLIERS[item.weight || "250g"] || 0.25;
      return { ...item, basePrice: (item.price || 0) / multiplier };
    });

  useEffect(() => {
    if (isGuest) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCartItems(attachBasePrice(guestCart));
      setLoading(false);
    } else {
      api
        .get("/cart")
        .then((res) => { setCartItems(attachBasePrice(res.data)); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, []);

  const saveGuestCart = (updatedCart) => {
    localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event("guestCartUpdated"));
  };

  const handleQuantityChange = (index, delta) => {
    if (isGuest) {
      const updated = [...cartItems];
      const item = updated[index];
      const newQty = Math.max(1, (item.quantity || 1) + delta);
      const multiplier = WEIGHT_MULTIPLIERS[item.weight || "250g"] || 0.25;
      updated[index] = { ...item, quantity: newQty, price: item.basePrice * multiplier * newQty };
      saveGuestCart(updated);
    } else {
      const item = cartItems[index];
      const newQty = Math.max(1, item.quantity + delta);
      api
        .put(`/cart/update/${item.id}`, null, { params: { quantity: newQty, weight: item.weight || "250g" } })
        .then((res) => {
          const updated = [...cartItems];
          updated[index] = { ...res.data, basePrice: item.basePrice };
          setCartItems(updated);
          window.dispatchEvent(new Event("cartUpdated"));
        })
        .catch(console.error);
    }
  };

  const handleWeightSelect = (index, weight) => {
    if (isGuest) {
      const updated = [...cartItems];
      const item = updated[index];
      const qty = item.quantity || 1;
      const newMultiplier = WEIGHT_MULTIPLIERS[weight] || 0.25;
      updated[index] = { ...item, weight, price: item.basePrice * newMultiplier * qty };
      saveGuestCart(updated);
    } else {
      const item = cartItems[index];
      api
        .put(`/cart/update/${item.id}`, null, { params: { quantity: item.quantity || 1, weight } })
        .then((res) => {
          const updated = [...cartItems];
          updated[index] = { ...res.data, basePrice: item.basePrice };
          setCartItems(updated);
        })
        .catch(console.error);
    }
  };

  const handleRemove = (index) => {
    if (isGuest) {
      const updated = cartItems.filter((_, i) => i !== index);
      saveGuestCart(updated);
    } else {
      const item = cartItems[index];
      api
        .delete(`/cart/remove/${item.id}`)
        .then(() => {
          setCartItems(cartItems.filter((_, i) => i !== index));
          window.dispatchEvent(new Event("cartUpdated"));
        })
        .catch(console.error);
    }
  };

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2);

  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (loading)
    return (
      <div className="cp-page" style={styles.page}>
        <div style={styles.container}>
          <h2 className="cp-title" style={styles.pageTitle}>Your Cart</h2>
          {[...Array(3)].map((_, i) => <CartSkeleton key={i} />)}
        </div>
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="cp-page" style={styles.page}>
        <div style={styles.container}>
          <h2 className="cp-title" style={styles.pageTitle}>Your Cart</h2>
          <div style={styles.emptyBox}>
            <p style={styles.emptyText}>Your cart is empty!</p>
            <button style={styles.shopBtn} onClick={() => navigate("/")}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="cp-page" style={styles.page}>
      <div style={styles.container}>
        <h2 className="cp-title" style={styles.pageTitle}>Your Cart</h2>

        {cartItems.map((item, index) => {
          const activeWeight = item.weight || "250g";
          const availableWeights = item.availableWeights || WEIGHT_OPTIONS;

          return (
            /* cp-card: stacks image + body vertically on mobile */
            <div key={index} className="cp-card" style={styles.card}>
              {(item.imageUrl || item.product?.imageUrl) ? (
                <img
                  src={item.imageUrl || item.product?.imageUrl}
                  alt={item.productName || item.name}
                  className="cp-card-img"
                  style={styles.productImage}
                />
              ) : (
                <div className="cp-card-img" style={styles.productImagePlaceholder}>🛒</div>
              )}

              <div style={styles.cardBody}>
                {/* cp-card-top: stacks name + price on mobile */}
                <div className="cp-card-top" style={styles.cardTop}>
                  <p className="cp-prod-name" style={styles.productName}>
                    {item.productName || item.product?.name}
                  </p>
                  <span className="cp-price-tag" style={styles.priceTag}>
                    ₹{(item.price || 0).toFixed(2)}
                  </span>
                </div>

                <hr style={styles.divider} />

                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
                  <span style={styles.rowLabel}>Weight</span>
                  {availableWeights.map((w) => (
                    <button key={w} style={styles.weightBtn(activeWeight === w)} onClick={() => handleWeightSelect(index, w)}>
                      {w.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={styles.rowLabel}>Qty</span>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: "8px", overflow: "hidden", width: "fit-content" }}>
                    <button
                      onClick={() => handleQuantityChange(index, -1)}
                      style={{ width: "36px", height: "36px", background: "#f9fafb", border: "none", borderRight: "1px solid #d1d5db", cursor: "pointer", fontSize: "18px", color: "#374151", fontFamily: font, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >−</button>
                    <span style={{ width: "44px", textAlign: "center", fontSize: "15px", fontWeight: 600, color: "#1f2937", fontFamily: font }}>
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(index, 1)}
                      style={{ width: "36px", height: "36px", background: "#f9fafb", border: "none", borderLeft: "1px solid #d1d5db", cursor: "pointer", fontSize: "18px", color: "#374151", fontFamily: font, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >+</button>
                  </div>
                </div>

                <button
                  style={styles.removeBtn}
                  onMouseOver={(e) => (e.target.style.background = "#b91c1c")}
                  onMouseOut={(e) => (e.target.style.background = "#dc2626")}
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}

        {/* cp-summary: reduces padding on mobile */}
        <div className="cp-summary" style={styles.summaryBox}>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "#1f2937", fontFamily: font, marginBottom: "12px" }}>
            Order Summary
          </p>
          <div style={styles.summaryRow}>
            <span>Items ({itemCount})</span>
            <span style={{ color: "#1f2937" }}>₹{getTotal()}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Delivery Charge</span>
            <span style={{ color: "#1f2937" }}>₹40.00</span>
          </div>
          <div style={styles.summaryTotal}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>₹{(parseFloat(getTotal()) + 40).toFixed(2)}</span>
          </div>
          <button
            style={styles.checkoutBtn}
            onMouseOver={(e) => (e.target.style.background = "#b91c1c")}
            onMouseOut={(e) => (e.target.style.background = "#dc2626")}
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default CartPage;