import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../api/api";
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

/* ─── Mobile styles ─── */
if (typeof document !== "undefined" && !document.getElementById("products-mobile-css")) {
  const s = document.createElement("style");
  s.id = "products-mobile-css";
  s.textContent = `
    /* Grid breakpoints */
    @media (max-width: 1024px) { .products-grid { grid-template-columns: repeat(3, 1fr) !important; } }
    @media (max-width: 768px)  { .products-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; } }
    @media (max-width: 400px)  { .products-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; } }

    @media (max-width: 768px) {
      .pp-container       { padding: 16px 12px !important; }
      .pp-header          { margin-bottom: 16px !important; flex-wrap: wrap !important; gap: 10px !important; }
      .pp-header h1       { font-size: 20px !important; }
      .pp-sort            { font-size: 13px !important; padding: 8px 10px !important; width: 100% !important; }
      .pp-card-img        { height: 140px !important; padding: 6px 10px !important; }
      .pp-card-title-wrap { min-height: 48px !important; padding: 12px 10px 6px !important; }
      .pp-card-title      { font-size: 12px !important; }
      .pp-card-footer     { padding: 8px 10px 12px !important; gap: 6px !important; }
      .pp-card-price      { font-size: 13px !important; }
      .pp-card-btn        { font-size: 10px !important; padding: 7px 8px !important; letter-spacing: 0.02em !important; }
    }

    @media (max-width: 400px) {
      .pp-card-img   { height: 120px !important; }
      .pp-card-btn   { font-size: 9px !important; padding: 6px 6px !important; }
    }

    /* Skeleton loading grid */
    @media (max-width: 768px)  { .pp-skeleton-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; } }

    /* Card hover — desktop only */
    .product-card { transition: box-shadow 0.2s, transform 0.2s; }
    .product-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.10); transform: translateY(-3px); }
    .product-card:hover .product-card__title { color: ${red}; }
    .product-card__img { transition: transform 0.3s; }
    .product-card:hover .product-card__img { transform: scale(1.05); }
    .product-card__btn:not(:disabled):not(.is-loading):not(.is-added):hover { background: #b91c1c !important; }
  `;
  document.head.appendChild(s);
}

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [addedMap, setAddedMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);

  const token = localStorage.getItem("token");
  const isGuest = !token;

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/products", { signal: controller.signal })
      .then((res) => {
        if (mountedRef.current) { setProducts(res.data); setLoading(false); }
      })
      .catch((err) => {
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          if (mountedRef.current) setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const result = [...products];
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [sortBy, products]);

  const handleAddToCart = useCallback(
    async (e, product) => {
      e.stopPropagation();
      if (loadingMap[product.id]) return;
      if (isGuest) {
        const cart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const idx = cart.findIndex((i) => i.productId === product.id);
        if (idx !== -1) { cart[idx].quantity += 1; }
        else {
          cart.push({
            productId: product.id, productName: product.name,
            price: product.price, quantity: 1, weight: "250g", imageUrl: product.imageUrl,
          });
        }
        localStorage.setItem("guestCart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        window.dispatchEvent(new CustomEvent("showCartDrawer", {
          detail: { name: product.name, price: product.price, imageUrl: product.imageUrl, weight: "250g" }
        }));
      } else {
        setLoadingMap((prev) => ({ ...prev, [product.id]: true }));
        try {
          await api.post("/cart/add", { productId: product.id, quantity: 1, weight: "250g" });
          window.dispatchEvent(new Event("cartUpdated"));
          window.dispatchEvent(new CustomEvent("showCartDrawer", {
            detail: { name: product.name, price: product.price, imageUrl: product.imageUrl, weight: "250g" }
          }));
        } catch (err) {
          console.error("Failed to add to cart:", err);
          alert("Failed to add to cart. Please try again.");
        } finally {
          if (mountedRef.current)
            setLoadingMap((prev) => ({ ...prev, [product.id]: false }));
        }
      }
    },
    [isGuest] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleCardClick = useCallback((id) => setSelectedProductId(id), []);
  const handleModalClose = useCallback(() => setSelectedProductId(null), []);

  if (loading)
    return (
      <div className="pp-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 48px", fontFamily: font }}>
        <div
          className="pp-skeleton-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}
        >
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ border: "1px solid #fca5a5", borderRadius: "12px", padding: "16px", background: "#fff" }}>
              <div style={{ height: "16px", background: "#e5e7eb", borderRadius: "4px", marginBottom: "12px" }} />
              <div style={{ height: "160px", background: "#f3f4f6", borderRadius: "8px", marginBottom: "16px" }} />
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
      <div className="pp-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 48px" }}>

        {/* Header + Sort */}
        <div
          className="pp-header"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "24px", flexWrap: "wrap", gap: "12px",
          }}
        >
          <h1 style={{ fontFamily: font, fontWeight: 800, fontSize: "25px", color: "#111827", margin: 0 }}>
            Our Products
          </h1>
          <select
            className="pp-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              border: "1px solid #e5e7eb", borderRadius: "8px",
              padding: "10px 16px", fontFamily: font, fontSize: "14px",
              outline: "none", background: "#fff", cursor: "pointer",
            }}
          >
            <option value="default">Sort By: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>

        {/* Product Grid */}
        <div
          className="products-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}
        >
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              added={!!addedMap[product.id]}
              isLoading={!!loadingMap[product.id]}
              onCardClick={handleCardClick}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      {selectedProductId && (
        <ProductDetailModal productId={selectedProductId} onClose={handleModalClose} />
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════════ */
const ProductCard = React.memo(({ product, added, isLoading, onCardClick, onAddToCart }) => {
  const getButtonBg = () => {
    if (product.stock === 0) return "#e5e7eb";
    if (isLoading) return "#f97316";
    return red;
  };

  return (
    <div
      className="product-card"
      onClick={() => onCardClick(product.id)}
      style={{
        border: "1px solid #fca5a5", borderRadius: "12px",
        display: "flex", flexDirection: "column",
        background: "#fff", cursor: "pointer",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        fontFamily: font, overflow: "hidden", position: "relative",
      }}
    >
      {product.stock === 0 && (
        <div style={{
          position: "absolute", top: "8px", right: "8px",
          background: red, color: "#fff", fontSize: "10px", fontWeight: 700,
          padding: "3px 8px", borderRadius: "999px", fontFamily: font, zIndex: 2,
        }}>
          Out of Stock
        </div>
      )}

      {/* Title */}
      <div
        className="pp-card-title-wrap"
        style={{
          padding: "16px 14px 8px", textAlign: "center",
          minHeight: "58px", display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <h4
          className="product-card__title pp-card-title"
          style={{
            fontFamily: font, fontWeight: 600, fontSize: "14px",
            color: "#111827", margin: 0, lineHeight: 1.4,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden", transition: "color 0.2s",
          }}
        >
          {product.name}
        </h4>
      </div>

      {/* Image */}
      <div
        className="pp-card-img"
        style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 16px" }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl} alt={product.name}
            className="product-card__img"
            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
            loading="lazy"
          />
        ) : (
          <div style={{
            width: "100%", height: "100%", background: "#fff7ed", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px",
          }}>
            🌶️
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="pp-card-footer"
        style={{
          padding: "10px 14px 16px", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          gap: "10px", marginTop: "auto",
        }}
      >
        <span className="pp-card-price" style={{ fontFamily: font, fontWeight: 700, fontSize: "15px", color: "#111827", flexShrink: 0 }}>
          ₹{product.price}
        </span>
        <button
          className={`product-card__btn pp-card-btn${isLoading ? " is-loading" : ""}${added ? " is-added" : ""}`}
          onClick={(e) => onAddToCart(e, product)}
          disabled={product.stock === 0 || isLoading}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "9px 12px", background: getButtonBg(),
            color: product.stock === 0 ? "#9ca3af" : "#fff",
            border: "none", borderRadius: "8px", fontFamily: font,
            fontWeight: 700, fontSize: "11px", letterSpacing: "0.04em",
            textTransform: "uppercase",
            cursor: (product.stock === 0 || isLoading) ? "not-allowed" : "pointer",
            transition: "background 0.2s", whiteSpace: "nowrap",
          }}
        >
          {isLoading ? "Adding..." : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
});

export default ProductsPage;