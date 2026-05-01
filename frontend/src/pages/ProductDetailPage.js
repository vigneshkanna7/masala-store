import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductDetailModal from "./ProductDetailModal";

const font = "'Poppins', sans-serif";
const red = "#dc2626";

if (typeof document !== "undefined" && !document.getElementById("poppins-font")) {
  const link = document.createElement("link");
  link.id = "poppins-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap";
  document.head.appendChild(link);
}

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [addedMap, setAddedMap] = useState({});

  // ── Modal state ──
  const [selectedProductId, setSelectedProductId] = useState(null);

  const token = localStorage.getItem("token");
  const isGuest = !token;

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then((res) => { setProducts(res.data); setFiltered(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...products];
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(result);
  }, [sortBy, products]);

 const handleAddToCart = (e, product) => {
  e.stopPropagation();
  if (isGuest) {
    const cart = JSON.parse(localStorage.getItem("guestCart")) || [];
    const idx = cart.findIndex((i) => i.productId === product.id);
    if (idx !== -1) cart[idx].quantity += 1;
    else cart.push({ productId: product.id, productName: product.name, price: product.price, quantity: 1, weight: "250g" });
    localStorage.setItem("guestCart", JSON.stringify(cart));
    window.dispatchEvent(new Event("guestCartUpdated")); // ✅ add this
  } else {
    axios.post(
      "http://localhost:8080/api/cart/add",
      { productId: product.id, quantity: 1, weight: "250g" },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      window.dispatchEvent(new Event("cartUpdated")); // ✅ add this
    })
    .catch(console.error);
  }
  setAddedMap((prev) => ({ ...prev, [product.id]: true }));
  setTimeout(() => setAddedMap((prev) => ({ ...prev, [product.id]: false })), 1500);
};

  if (loading)
    return (
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "40px 24px", fontFamily: font }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ border: `1px solid #fca5a5`, borderRadius: "12px", padding: "16px", background: "#fff" }}>
              <div style={{ height: "16px", background: "#e5e7eb", borderRadius: "4px", marginBottom: "12px" }} />
              <div style={{ height: "200px", background: "#f3f4f6", borderRadius: "8px", marginBottom: "16px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ height: "20px", width: "60px", background: "#e5e7eb", borderRadius: "4px" }} />
                <div style={{ height: "36px", flex: 1, background: "#fee2e2", borderRadius: "8px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div style={{ background: "#fff", fontFamily: font }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 48px" }}>

        {/* ── Header + Sort ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "24px", flexWrap: "wrap", gap: "12px",
        }}>
          <h1 style={{ fontFamily: font, fontWeight: 800, fontSize: "25px", color: "#111827", margin: 0 }}>
            Our Products
          </h1>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              border: "1px solid #e5e7eb", borderRadius: "8px",
              padding: "10px 16px", fontFamily: font, fontSize: "14px",
              outline: "none", background: "#fff", cursor: "pointer",
              accentColor: "#ff0000",
            }}
          >
            <option value="default">Sort By: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>

        {/* ── Product Grid ── */}
        <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              added={!!addedMap[product.id]}
              onCardClick={() => setSelectedProductId(product.id)}   // ← opens modal
              onAddToCart={(e) => handleAddToCart(e, product)}
            />
          ))}
        </div>
      </div>

      {/* ── Product Detail Modal ── */}
      {selectedProductId && (
        <ProductDetailModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}

      <style>{`
        @media (max-width: 1024px) { .products-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 768px)  { .products-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px)  { .products-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};

/* ═══════════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════════ */
const ProductCard = ({ product, added, onCardClick, onAddToCart }) => {
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div
      onClick={onCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid #fca5a5`, borderRadius: "12px",
        display: "flex", flexDirection: "column",
        background: "#fff", cursor: "pointer",
        boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "box-shadow 0.2s, transform 0.2s",
        fontFamily: font, overflow: "hidden", position: "relative",
      }}
    >
      {product.stock === 0 && (
        <div style={{
          position: "absolute", top: "12px", right: "12px",
          background: red, color: "#fff", fontSize: "11px", fontWeight: 700,
          padding: "4px 10px", borderRadius: "999px", fontFamily: font, zIndex: 2,
        }}>
          Out of Stock
        </div>
      )}

      <div style={{ padding: "16px 14px 8px", textAlign: "center", minHeight: "58px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h4 style={{
          fontFamily: font, fontWeight: 600, fontSize: "14px",
          color: hovered ? red : "#111827", margin: 0, lineHeight: 1.4,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden", transition: "color 0.2s",
        }}>
          {product.name}
        </h4>
      </div>

      <div style={{ height: "220px", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 16px" }}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} style={{
            maxHeight: "100%", maxWidth: "100%", objectFit: "contain",
            transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.3s",
          }} loading="lazy" />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#fff7ed", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "56px" }}>
            🌶️
          </div>
        )}
      </div>

      <div style={{ padding: "10px 14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginTop: "auto" }}>
        <span style={{ fontFamily: font, fontWeight: 700, fontSize: "15px", color: "#111827" }}>
          ₹{product.price}
        </span>
        <button
          onClick={onAddToCart}
          disabled={product.stock === 0}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 16px",
            background: product.stock === 0 ? "#e5e7eb" : added ? "#16a34a" : btnHovered ? "#b91c1c" : red,
            color: product.stock === 0 ? "#9ca3af" : "#fff",
            border: "none", borderRadius: "8px", fontFamily: font,
            fontWeight: 700, fontSize: "12px", letterSpacing: "0.05em",
            textTransform: "uppercase",
            cursor: product.stock === 0 ? "not-allowed" : "pointer",
            transition: "background 0.2s", whiteSpace: "nowrap",
          }}
        >
          {product.stock === 0 ? "Out of Stock" : added ? "Added to Cart✓" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;