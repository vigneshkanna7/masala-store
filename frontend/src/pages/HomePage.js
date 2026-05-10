import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { MdEco } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";
import { BiSupport } from "react-icons/bi";

/* ─── Inject Poppins once ─── */
if (typeof document !== "undefined" && !document.getElementById("poppins-font")) {
  const link = document.createElement("link");
  link.id = "poppins-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap";
  document.head.appendChild(link);
}

/* ─── Inject styles once ─── */
if (typeof document !== "undefined" && !document.getElementById("homepage-mobile-css")) {
  const s = document.createElement("style");
  s.id = "homepage-mobile-css";
  s.textContent = `
    .hp-scroll-row::-webkit-scrollbar { display: none; }
    .hp-scroll-row { -ms-overflow-style: none; scrollbar-width: none; }

    /* ── Hero ── */
    .hp-hero-outer {
      background: #fff;
      padding: 0;
      margin: 0;
    }
    .hp-hero-wrap {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 48px;
      position: relative;
    }
    .hp-dots-wrap {
      display: flex;
      justify-content: center;
      gap: 8px;
      padding: 14px 0 0;
    }

    /* ── Trust strip ── */
    .hp-trust-outer {
      background: #fff;
      padding: 40px 0;
      border-top: 1px solid #f3f4f6;
      border-bottom: 1px solid #f3f4f6;
      margin-top: 0;
    }
    .hp-trust-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 48px;
    }
    .hp-trust-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
    }
    .hp-trust-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 0 28px;
      border-right: 1px solid #f3f4f6;
    }
    .hp-trust-item:last-child { border-right: none; }
    .hp-trust-icon {
      font-size: 48px;
      color: #374151;
      margin-bottom: 14px;
    }

    /* ── Sections ── */
    .hp-section-wrap {
      max-width: 1300px;
      margin: 0 auto;
      padding: 48px 24px;
    }
    .hp-reviews-outer {
      background: #fff;
      border-top: 1px solid #f3f4f6;
    }

    /* ── Section header ── */
    .hp-section-hd {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
    }
    .hp-section-hd h2 {
      font-family: 'Poppins', sans-serif;
      font-weight: 800;
      font-size: 24px;
      letter-spacing: 0.06em;
      color: #111827;
      margin: 0;
      text-transform: uppercase;
    }
    .hp-section-arrows { display: flex; gap: 8px; }

    /* ── Arrow button ── */
    .hp-arrow-btn {
      width: 44px; height: 44px;
      border: none; border-radius: 6px;
      color: #fff; font-size: 22px; font-weight: 700;
      cursor: pointer; display: flex; align-items: center;
      justify-content: center; line-height: 1;
      transition: background 0.2s;
    }

    /* ── Product cards ── */
    .hp-products-scroll {
      display: flex;
      gap: 20px;
      overflow-x: auto;
      padding-bottom: 8px;
    }
    .hp-product-card {
      flex-shrink: 0;
      width: 280px;
    }
    .hp-product-card-img { height: 260px; }
    .hp-product-name {
      padding: 18px 16px 8px;
      min-height: 62px;
    }
    .hp-product-footer { padding: 12px 16px 18px; }
    .hp-product-price { font-size: 16px; }
    .hp-add-btn {
      padding: 10px 16px;
      font-size: 12px;
      letter-spacing: 0.05em;
    }

    /* ── Review cards ── */
    .hp-review-card { width: 300px; }
    .hp-reviews-hd {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
    }

    /* ════════════════
       TABLET  641–900px
    ════════════════ */
    @media (min-width: 641px) and (max-width: 900px) {
      .hp-hero-wrap { padding: 0 24px; }
      .hp-trust-inner { padding: 0 24px; }
      .hp-trust-grid { grid-template-columns: 1fr 1fr 1fr; gap: 0; }
      .hp-trust-item { padding: 0 16px; }
      .hp-section-wrap { padding: 40px 20px; }
      .hp-section-hd h2 { font-size: 20px; }
    }

    /* ════════════════
       MOBILE  ≤ 640px
    ════════════════ */
    @media (max-width: 640px) {
      .hp-hero-wrap { padding: 0 10px; }
      .hp-dots-wrap { padding: 10px 0 0; }

      .hp-trust-outer { padding: 0; }
      .hp-trust-inner { padding: 0; }
      .hp-trust-grid {
        grid-template-columns: 1fr !important;
        gap: 0 !important;
      }
      .hp-trust-item {
        flex-direction: row !important;
        text-align: left !important;
        align-items: flex-start !important;
        padding: 16px 16px !important;
        border-right: none !important;
        border-bottom: 1px solid #f3f4f6 !important;
        gap: 14px !important;
      }
      .hp-trust-item:last-child { border-bottom: none !important; }
      .hp-trust-icon {
        font-size: 32px !important;
        margin-bottom: 0 !important;
        flex-shrink: 0 !important;
        margin-top: 2px !important;
      }
      .hp-trust-text { text-align: left !important; }

      .hp-section-wrap { padding: 28px 12px; }
      .hp-section-hd h2 { font-size: 17px !important; letter-spacing: 0.04em !important; }
      .hp-section-arrows { display: none !important; }

      .hp-products-scroll {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 12px !important;
        overflow-x: visible !important;
        padding-bottom: 0 !important;
      }
      .hp-product-card { width: 100% !important; min-width: 0 !important; flex-shrink: unset !important; }
      .hp-product-card-img { height: 150px !important; padding: 8px 10px !important; }
      .hp-product-name { font-size: 12px !important; padding: 12px 10px 6px !important; min-height: 50px !important; }
      .hp-product-footer { padding: 8px 10px 12px !important; gap: 6px !important; }
      .hp-product-price { font-size: 13px !important; }
      .hp-add-btn { font-size: 10px !important; padding: 7px 8px !important; gap: 4px !important; letter-spacing: 0.03em !important; }

      .hp-review-card { width: 240px !important; }
      .hp-reviews-hd { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }

      .hp-arrow-btn { width: 34px !important; height: 34px !important; font-size: 18px !important; }
    }

    @media (max-width: 400px) {
      .hp-products-scroll { gap: 8px !important; }
      .hp-product-card-img { height: 120px !important; }
      .hp-review-card { width: 200px !important; }
      .hp-section-hd h2 { font-size: 15px !important; }
    }
  `;
  document.head.appendChild(s);
}

const slides = [
  { id: 1, image: "/banners/banner1.jpg", alt: "Banner 1" },
  { id: 2, image: "/banners/banner2.jpg", alt: "Banner 2" },
  { id: 3, image: "/banners/banner3.jpg", alt: "Banner 3" },
  { id: 4, image: "/banners/banner4.jpg", alt: "Banner 4" },
];

const font = "'Poppins', sans-serif";
const red = "#dc2626";

/* ═══════════════════════════════════════════
   STAR DISPLAY
═══════════════════════════════════════════ */
const Stars = ({ rating }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} style={{ fontSize: "16px", color: s <= rating ? "#f59e0b" : "#d1d5db" }}>★</span>
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   REVIEW CARD
═══════════════════════════════════════════ */
const ReviewCard = ({ review }) => (
  <div className="hp-review-card" style={{
    flexShrink: 0,
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "22px 20px",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    fontFamily: font,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          background: red, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: "15px", flexShrink: 0,
        }}>
          {review.reviewerName?.charAt(0).toUpperCase() || "?"}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "#111827" }}>
            {review.reviewerName}
          </p>
          <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>
            {new Date(review.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
    <Stars rating={review.rating} />
    <p style={{
      margin: 0, fontSize: "13.5px", color: "#4b5563", lineHeight: 1.65,
      display: "-webkit-box", WebkitLineClamp: 4,
      WebkitBoxOrient: "vertical", overflow: "hidden",
    }}>
      "{review.comment}"
    </p>
  </div>
);

/* ═══════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════ */
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [addedMap, setAddedMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const scrollRef = useRef(null);
  const reviewScrollRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isGuest = !token;

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    api.get("/products")
      .then((res) => { setProducts(res.data.slice(0, 10)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.get("/reviews")
      .then((res) => { setReviews(res.data); setReviewsLoading(false); })
      .catch(() => setReviewsLoading(false));
  }, []);

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (loadingMap[product.id]) return;
    if (isGuest) {
      const cart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const idx = cart.findIndex((i) => i.productId === product.id);
      if (idx !== -1) { cart[idx].quantity += 1; }
      else {
        cart.push({
          productId: product.id, productName: product.name,
          price: product.price, quantity: 1, weight: "250g",
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
        setLoadingMap((prev) => ({ ...prev, [product.id]: false }));
      }
    }
  };

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  const scrollReviews = (dir) =>
    reviewScrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: font, color: "#323141" }}>

      {/* ══════════════════════════════════════
          HERO SLIDER
      ══════════════════════════════════════ */}
      <div className="hp-hero-outer">
        <div className="hp-hero-wrap">
          <div style={{ overflow: "hidden", borderRadius: "10px" }}>
            <div style={{
              display: "flex",
              width: `${slides.length * 100}%`,
              transform: `translateX(-${currentSlide * (100 / slides.length)}%)`,
              transition: "transform 0.7s ease-in-out",
            }}>
              {slides.map((slide) => (
                <div key={slide.id} style={{ width: `${100 / slides.length}%`, flexShrink: 0, aspectRatio: "16/7" }}>
                  <img src={slide.image} alt={slide.alt}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Dots */}
        <div className="hp-dots-wrap">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} aria-label={`Slide ${i + 1}`}
              style={{
                width: i === currentSlide ? "28px" : "10px",
                height: "10px",
                borderRadius: i === currentSlide ? "5px" : "50%",
                border: "none", padding: 0, cursor: "pointer",
                background: i === currentSlide ? red : "#d1d5db",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════ */}
      <div className="hp-trust-outer">
        <div className="hp-trust-inner">
          <div className="hp-trust-grid">
            {[
              { Icon: MdEco, title: "100% Natural Ingredients", desc: "Pure & authentic ingredients, no artificial additives." },
              { Icon: RiSecurePaymentLine, title: "Secure Payment", desc: "Secure Payment via UPI" },
              { Icon: BiSupport, title: "Online Support", desc: "Within 02 days for support." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="hp-trust-item">
                <Icon className="hp-trust-icon" />
                <div className="hp-trust-text">
                  <p style={{ fontFamily: font, fontWeight: 600, fontSize: "15px", color: "#111827", margin: "0 0 6px 0" }}>
                    {title}
                  </p>
                  <p style={{ fontFamily: font, fontWeight: 400, fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          BEST SELLERS
      ══════════════════════════════════════ */}
      <div className="hp-section-wrap">
        <div className="hp-section-hd">
          <h2>Best Sellers</h2>
          <div className="hp-section-arrows">
            <ArrowBtn onClick={() => scroll("left")} label="Scroll left">←</ArrowBtn>
            <ArrowBtn onClick={() => scroll("right")} label="Scroll right">→</ArrowBtn>
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", gap: "20px", overflow: "hidden" }}>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div ref={scrollRef} className="hp-products-scroll hp-scroll-row">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                added={!!addedMap[product.id]}
                isLoading={!!loadingMap[product.id]}
                onCardClick={() => { navigate("/products"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                onAddToCart={(e) => handleAddToCart(e, product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          CUSTOMER REVIEWS
      ══════════════════════════════════════ */}
      {(reviewsLoading || reviews.length > 0) && (
        <div className="hp-reviews-outer">
          <div className="hp-section-wrap">
            <div className="hp-reviews-hd hp-section-hd">
              <div>
                <h2 style={{
                  fontFamily: font, fontWeight: 800, fontSize: "24px",
                  letterSpacing: "0.06em", color: "#111827", margin: "0 0 6px",
                  textTransform: "uppercase",
                }}>
                  What Our Customers Say
                </h2>
                {!reviewsLoading && (
                  <p style={{ fontFamily: font, fontSize: "13px", color: "#6b7280", margin: 0 }}>
                    {reviews.length} verified review{reviews.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              {reviews.length > 3 && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <ArrowBtn onClick={() => scrollReviews("left")} label="Scroll left">←</ArrowBtn>
                  <ArrowBtn onClick={() => scrollReviews("right")} label="Scroll right">→</ArrowBtn>
                </div>
              )}
            </div>

            {reviewsLoading ? (
              <div style={{ display: "flex", gap: "20px", overflow: "hidden" }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{
                    flexShrink: 0, width: "300px", border: "1px solid #e5e7eb",
                    borderRadius: "12px", padding: "22px 20px", background: "#fff",
                  }}>
                    {[["40px", "40px"], ["100%", "12px"], ["100%", "12px"], ["80%", "12px"]].map(([w, h], j) => (
                      <div key={j} style={{
                        width: w, height: h, background: "#f0f0f0",
                        borderRadius: "6px", marginBottom: "12px",
                        animation: "pulse 1.5s ease-in-out infinite",
                      }} />
                    ))}
                    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
                  </div>
                ))}
              </div>
            ) : (
              <div ref={reviewScrollRef} className="hp-scroll-row" style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "8px" }}>
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

/* ═══════════════════════════════════════════
   ARROW BUTTON
═══════════════════════════════════════════ */
const ArrowBtn = ({ onClick, label, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="hp-arrow-btn"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#b91c1c" : red,
        fontFamily: font,
      }}
    >
      {children}
    </button>
  );
};

/* ═══════════════════════════════════════════
   SKELETON CARD
═══════════════════════════════════════════ */
const SkeletonCard = () => (
  <div style={{
    flexShrink: 0, width: "280px", border: "1px solid #fca5a5",
    borderRadius: "12px", padding: "20px", background: "#fff", opacity: 0.7,
  }}>
    <div style={{ height: "18px", background: "#e5e7eb", borderRadius: "4px", marginBottom: "12px" }} />
    <div style={{ height: "240px", background: "#f3f4f6", borderRadius: "8px", marginBottom: "16px" }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
      <div style={{ height: "20px", width: "60px", background: "#e5e7eb", borderRadius: "4px" }} />
      <div style={{ height: "40px", flex: 1, background: "#fee2e2", borderRadius: "8px" }} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════════ */
const ProductCard = ({ product, added, isLoading, onCardClick, onAddToCart }) => {
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const getButtonBg = () => {
    if (isLoading) return "#f97316";
    if (added) return "#16a34a";
    if (btnHovered) return "#b91c1c";
    return red;
  };

  return (
    <div
      className="hp-product-card"
      onClick={onCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: "1px solid #fca5a5", borderRadius: "12px",
        display: "flex", flexDirection: "column",
        background: "#fff", cursor: "pointer",
        boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "box-shadow 0.2s, transform 0.2s",
        fontFamily: font, overflow: "hidden",
      }}
    >
      {/* Name */}
      <div
        className="hp-product-name"
        style={{
          textAlign: "center",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <h4 style={{
          fontFamily: font, fontWeight: 600, fontSize: "15px",
          color: hovered ? red : "#111827", margin: 0, lineHeight: 1.4,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden", transition: "color 0.2s",
        }}>
          {product.name}
        </h4>
      </div>

      {/* Image */}
      <div
        className="hp-product-card-img"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "8px 20px",
        }}
      >
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name}
            style={{
              maxHeight: "100%", maxWidth: "100%", objectFit: "contain",
              transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.3s",
            }}
            loading="lazy"
          />
        ) : (
          <div style={{
            width: "100%", height: "100%", background: "#fff7ed",
            borderRadius: "8px", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "64px",
          }}>
            🌶️
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="hp-product-footer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "12px", marginTop: "auto",
        }}
      >
        <span className="hp-product-price" style={{ fontFamily: font, fontWeight: 700, color: "#111827" }}>
          ₹{product.price}
        </span>
        <button
          className="hp-add-btn"
          onClick={onAddToCart}
          disabled={isLoading}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: getButtonBg(),
            color: "#fff", border: "none", borderRadius: "8px",
            fontFamily: font, fontWeight: 700,
            textTransform: "uppercase",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "background 0.2s", whiteSpace: "nowrap",
          }}
        >
          {isLoading ? "Adding..." : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
};

export default HomePage;