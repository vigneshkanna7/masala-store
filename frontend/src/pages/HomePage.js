import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdEco } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";
import { BiSupport } from "react-icons/bi";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaPinterestP,
} from "react-icons/fa";

/* ─── Inject Poppins once ─── */
if (typeof document !== "undefined" && !document.getElementById("poppins-font")) {
  const link = document.createElement("link");
  link.id = "poppins-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap";
  document.head.appendChild(link);
}

/* ─── DATA ─── */
const slides = [
  { id: 1, image: "https://melam.com/wp-content/uploads/2025/05/banner-new.jpeg", alt: "Banner 1" },
  { id: 2, image: "https://melam.com/wp-content/uploads/2023/03/banner_spices_2-2-1-1.jpg", alt: "Banner 2" },
  { id: 3, image: "https://melam.com/wp-content/uploads/2023/02/banner_puttupodi.jpg", alt: "Banner 3" },
  { id: 4, image: "https://melam.com/wp-content/uploads/2023/02/banner_fishmasala.jpg", alt: "Banner 4" },
  { id: 5, image: "https://melam.com/wp-content/uploads/2023/03/banner_chicken-2-1-1.jpg", alt: "Banner 5" },
];

const font = "'Poppins', sans-serif";
const red = "#dc2626";

/* ═══════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════ */
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [addedMap, setAddedMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isGuest = !token;

  /* auto-advance slider */
  useEffect(() => {
    const t = setInterval(
      () => setCurrentSlide((p) => (p + 1) % slides.length),
      3500
    );
    return () => clearInterval(t);
  }, []);

  /* fetch products */
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then((res) => {
        setProducts(res.data.slice(0, 10));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* add to cart */
  const handleAddToCart = async (e, product) => {
    e.stopPropagation();

    if (loadingMap[product.id]) return;

    if (isGuest) {
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
        });
      }
      localStorage.setItem("guestCart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      setAddedMap((p) => ({ ...p, [product.id]: true }));
      setTimeout(() => setAddedMap((p) => ({ ...p, [product.id]: false })), 1600);
    } else {
      setLoadingMap((prev) => ({ ...prev, [product.id]: true }));
      try {
        await axios.post(
          "http://localhost:8080/api/cart/add",
          { productId: product.id, quantity: 1, weight: "250g" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        window.dispatchEvent(new Event("cartUpdated"));
        setAddedMap((p) => ({ ...p, [product.id]: true }));
        setTimeout(() => setAddedMap((p) => ({ ...p, [product.id]: false })), 1600);
      } catch (err) {
        console.error("Failed to add to cart:", err);
        alert("Failed to add to cart. Please try again.");
      } finally {
        setLoadingMap((prev) => ({ ...prev, [product.id]: false }));
      }
    }
  };

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: font, color: "#323141" }}>

      {/* ══════════════════════════════════════
          HERO SLIDER
      ══════════════════════════════════════ */}
      <div style={{ background: "#fff", padding: "24px 0 0" }}>
        <div
          style={{
            maxWidth: "1400px",   /* ↑ was 1300px — wider container */
            margin: "0 auto",
            padding: "0 48px",    /* ↑ was 0 110px — less side padding = more width */
            position: "relative",
          }}
        >
          <div style={{ overflow: "hidden", borderRadius: "10px" }}>
            <div
              style={{
                display: "flex",
                width: `${slides.length * 100}%`,
                transform: `translateX(-${currentSlide * (100 / slides.length)}%)`,
                transition: "transform 0.7s ease-in-out",
              }}
            >
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  style={{
                    width: `${100 / slides.length}%`,
                    flexShrink: 0,
                    aspectRatio: "16/7",  /* ↑ was 16/6 — smaller denominator = taller */
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", padding: "16px 0 0" }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === currentSlide ? "28px" : "10px",
                height: "10px",
                borderRadius: i === currentSlide ? "5px" : "50%",
                border: "none",
                padding: 0,
                cursor: "pointer",
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
      <div style={{ borderBottom: "1px solid #e5e7eb", padding: "40px 0 40px", background: "#fff", marginTop: "20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
            {[
              { Icon: MdEco, title: "100% Natural Ingredients", desc: "Pure & authentic ingredients, no artificial additives." },
              { Icon: RiSecurePaymentLine, title: "Secure Payment", desc: "Secure Payment via UPI" },
              { Icon: BiSupport, title: "Online Support", desc: "Within 02 days for support." },
            ].map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  textAlign: "center", padding: "0 28px",
                  borderRight: i < 2 ? "1px solid #e5e7eb" : "none",
                }}
              >
                <Icon style={{ fontSize: "48px", color: "#374151", marginBottom: "14px" }} />
                <p style={{ fontFamily: font, fontWeight: 600, fontSize: "15px", color: "#111827", margin: "0 0 6px 0" }}>
                  {title}
                </p>
                <p style={{ fontFamily: font, fontWeight: 400, fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          BEST SELLERS
      ══════════════════════════════════════ */}
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "52px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <h2 style={{ fontFamily: font, fontWeight: 800, fontSize: "26px", letterSpacing: "0.06em", color: "#111827", margin: 0, textTransform: "uppercase" }}>
            Best Sellers
          </h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <ArrowBtn onClick={() => scroll("left")} label="Scroll left">←</ArrowBtn>
            <ArrowBtn onClick={() => scroll("right")} label="Scroll right">→</ArrowBtn>
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", gap: "20px", overflow: "hidden" }}>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div
            ref={scrollRef}
            style={{
              display: "flex", gap: "20px", overflowX: "auto",
              paddingBottom: "8px", scrollbarWidth: "none", msOverflowStyle: "none",
            }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                added={!!addedMap[product.id]}
                isLoading={!!loadingMap[product.id]}
                onCardClick={() => {
                  navigate(`/products/${product.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onAddToCart={(e) => handleAddToCart(e, product)}
              />
            ))}
          </div>
        )}
      </div>

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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "44px", height: "44px",
        background: hovered ? "#b91c1c" : red,
        border: "none", borderRadius: "6px",
        color: "#fff", fontSize: "22px", fontWeight: 700,
        cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", lineHeight: 1,
        transition: "background 0.2s", fontFamily: font,
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
  <div style={{ flexShrink: 0, width: "280px", border: "1px solid #fca5a5", borderRadius: "12px", padding: "20px", background: "#fff", opacity: 0.7 }}>
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

  const getButtonLabel = () => {
    if (isLoading) return "Adding...";
    if (added) return "✓ Added to Cart";
    return "ADD TO CART";
  };

  const getButtonBg = () => {
    if (isLoading) return "#f97316";
    if (added) return "#16a34a";
    if (btnHovered) return "#b91c1c";
    return red;
  };

  return (
    <div
      onClick={onCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0, width: "280px",
        border: "1px solid #fca5a5", borderRadius: "12px",
        display: "flex", flexDirection: "column",
        background: "#fff", cursor: "pointer",
        boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "box-shadow 0.2s, transform 0.2s",
        fontFamily: font, overflow: "hidden",
      }}
    >
      <div style={{ padding: "18px 16px 8px", textAlign: "center", minHeight: "62px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h4 style={{ fontFamily: font, fontWeight: 600, fontSize: "15px", color: hovered ? red : "#111827", margin: 0, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", transition: "color 0.2s" }}>
          {product.name}
        </h4>
      </div>

      <div style={{ height: "260px", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 20px" }}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name}
            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.3s" }}
            loading="lazy"
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#fff7ed", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "64px" }}>
            🌶️
          </div>
        )}
      </div>

      <div style={{ padding: "12px 16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginTop: "auto" }}>
        <span style={{ fontFamily: font, fontWeight: 700, fontSize: "16px", color: "#111827" }}>
          ₹{product.price}
        </span>
        <button
          onClick={onAddToCart}
          disabled={isLoading}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 16px", background: getButtonBg(),
            color: "#fff", border: "none", borderRadius: "8px",
            fontFamily: font, fontWeight: 700, fontSize: "12px",
            letterSpacing: "0.05em", textTransform: "uppercase",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "background 0.2s", whiteSpace: "nowrap",
          }}
        >
          {getButtonLabel()}
        </button>
      </div>
    </div>
  );
};

export default HomePage;