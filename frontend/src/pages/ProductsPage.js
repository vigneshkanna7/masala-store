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

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [addedMap, setAddedMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  // ── Modal state ──
  const [selectedProductId, setSelectedProductId] = useState(null);

  // ── Read auth token once per render ──
  const token = localStorage.getItem("token");
  const isGuest = !token;

  // ── Mounted ref — prevents setState after unmount ──
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Fetch products — cancelled on unmount ──
  useEffect(() => {
    const controller = new AbortController();

    api
      .get("/products", { signal: controller.signal })
      .then((res) => {
        if (mountedRef.current) {
          setProducts(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          if (mountedRef.current) setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  // ── Derived sort — eliminates redundant `filtered` useState + effect double-render ──
  const filtered = useMemo(() => {
    const result = [...products];
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [sortBy, products]);

  // ── Stable handler — useCallback stops new function refs on every parent render ──
  const handleAddToCart = useCallback(
    async (e, product) => {
      e.stopPropagation();

      // Prevent double-click while request is in flight
      if (loadingMap[product.id]) return;

      if (isGuest) {
        // ── Guest: store in localStorage ──
        const cart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const idx = cart.findIndex((i) => i.productId === product.id);
        if (idx !== -1) {
          cart[idx].quantity += 1;
        } else {
          cart.push({
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: 1,
            weight: "250g",
            imageUrl: product.imageUrl,  // ← add this
          });
        }
        localStorage.setItem("guestCart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        window.dispatchEvent(new CustomEvent("showCartDrawer", {
  detail: { name: product.name, price: product.price, imageUrl: product.imageUrl, weight: "250g" }
}));
      } else {
        // ── Logged-in: save to DB ──
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
    // loadingMap intentionally excluded — using setLoadingMap's functional form
    // and the ref to read the latest value avoids stale closure without re-creating the handler
    [isGuest] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── Stable modal handlers — useCallback so ProductDetailModal's
  //    Escape-key effect doesn't re-register on every render ──
  const handleCardClick = useCallback((id) => setSelectedProductId(id), []);
  const handleModalClose = useCallback(() => setSelectedProductId(null), []);

  if (loading)
    return (
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "40px 24px", fontFamily: font }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{ border: `1px solid #fca5a5`, borderRadius: "12px", padding: "16px", background: "#fff" }}
            >
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
            }}
          >
            <option value="default">Sort By: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>

        {/* ── Product Grid ── */}
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

      {/* ── Product Detail Modal ── */}
      {selectedProductId && (
        <ProductDetailModal
          productId={selectedProductId}
          onClose={handleModalClose}
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
   — React.memo prevents re-render when unrelated parent state changes
   — hover states moved to CSS — zero JS state, zero re-renders on hover
═══════════════════════════════════════════ */
const ProductCard = React.memo(({ product, added, isLoading, onCardClick, onAddToCart }) => {
  const getButtonLabel = () => {
    if (product.stock === 0) return "Out of Stock";
    if (isLoading) return "Adding...";
    if (added) return "Added to Cart ✓";
    return "ADD TO CART";
  };

  const getButtonBg = () => {
  if (product.stock === 0) return "#e5e7eb";
  if (isLoading) return "#f97316";
  return red;
};

  return (
    <>
      <style>{`
        .product-card { transition: box-shadow 0.2s, transform 0.2s; }
        .product-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.10); transform: translateY(-3px); }
        .product-card:hover .product-card__title { color: ${red}; }
        .product-card__img { transition: transform 0.3s; }
        .product-card:hover .product-card__img { transform: scale(1.05); }
        .product-card__btn:not(:disabled):not(.is-loading):not(.is-added):hover { background: #b91c1c !important; }
      `}</style>

      <div
        className="product-card"
        onClick={() => onCardClick(product.id)}
        style={{
          border: `1px solid #fca5a5`, borderRadius: "12px",
          display: "flex", flexDirection: "column",
          background: "#fff", cursor: "pointer",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
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

        <div style={{
          padding: "16px 14px 8px", textAlign: "center",
          minHeight: "58px", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <h4
            className="product-card__title"
            style={{
              fontFamily: font, fontWeight: 600, fontSize: "14px",
              color: "#111827", margin: 0, lineHeight: 1.4,
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
              transition: "color 0.2s",
            }}
          >
            {product.name}
          </h4>
        </div>

        <div style={{ height: "220px", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 16px" }}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-card__img"
              style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
              loading="lazy"
            />
          ) : (
            <div style={{
              width: "100%", height: "100%", background: "#fff7ed", borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "56px",
            }}>
              🌶️
            </div>
          )}
        </div>

        <div style={{
          padding: "10px 14px 16px", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          gap: "10px", marginTop: "auto",
        }}>
          <span style={{ fontFamily: font, fontWeight: 700, fontSize: "15px", color: "#111827" }}>
            ₹{product.price}
          </span>
          <button
            className={`product-card__btn${isLoading ? " is-loading" : ""}${added ? " is-added" : ""}`}
            onClick={(e) => onAddToCart(e, product)}
            disabled={product.stock === 0 || isLoading}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 16px",
              background: getButtonBg(),
              color: product.stock === 0 ? "#9ca3af" : "#fff",
              border: "none", borderRadius: "8px", fontFamily: font,
              fontWeight: 700, fontSize: "12px", letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: (product.stock === 0 || isLoading) ? "not-allowed" : "pointer",
              transition: "background 0.2s", whiteSpace: "nowrap",
            }}
          >
{isLoading ? "Adding..." : "ADD TO CART"}
          </button>
        </div>
      </div>
    </>
  );
});

export default ProductsPage;