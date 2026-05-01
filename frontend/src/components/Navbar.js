import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import axios from "axios";
import LoginModal from "../pages/LoginModal";

const font = "'Poppins', sans-serif";
const red = "#dc2626";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const userName = localStorage.getItem("userName") || "Account";

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("login");

  const openLogin = () => { setModalMode("login"); setModalOpen(true); setDropdownOpen(false); setMenuOpen(false); };
  const openRegister = () => { setModalMode("register"); setModalOpen(true); setDropdownOpen(false); setMenuOpen(false); };

  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const update = () => {
      if (isLoggedIn) {
        axios.get("http://localhost:8080/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const count = (res.data || []).reduce((s, i) => s + (i.quantity || 1), 0);
          setCartCount(count);
        })
        .catch(() => setCartCount(0));
      } else {
        const cart = JSON.parse(localStorage.getItem("guestCart")) || [];
        setCartCount(cart.reduce((s, i) => s + (i.quantity || 1), 0));
      }
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("cartUpdated", update);
    window.addEventListener("guestCartUpdated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("cartUpdated", update);
      window.removeEventListener("guestCartUpdated", update);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setDropdownOpen(false);
    navigate("/");
    window.location.reload();
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
  ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <nav style={{ position: "relative", background: "#fff", borderBottom: "none", fontFamily: font }}>
        <div style={{
          maxWidth: "1300px", margin: "0 auto", padding: "0 24px",
          height: "90px", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "16px",
        }}>
          {/* ── LOGO ── */}
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }} aria-label="Home">
            <div style={{
              width: "80px", height: "80px", background: red, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 900, fontSize: "13px",
              letterSpacing: "0.05em", fontFamily: font,
            }}>
              LOGO
            </div>
          </Link>

          {/* ── NAV LINKS (desktop) ── */}
          <ul style={{
            display: "flex", alignItems: "center", gap: "4px",
            listStyle: "none", margin: 0, padding: 0,
            flexGrow: 1, justifyContent: "center",
          }} className="hide-on-mobile">
            {navLinks.map(({ label, path }) => (
              <li key={path}>
                <Link to={path} style={{
                  fontFamily: font,
                  fontWeight: isActive(path) ? 700 : 500,
                  fontSize: "16px", // ← was 14px
                  color: isActive(path) ? red : "#111827",
                  textDecoration: "none",
                  padding: "6px 14px",
                  borderBottom: isActive(path) ? `2px solid ${red}` : "2px solid transparent",
                  transition: "color 0.2s, border-color 0.2s",
                  display: "inline-block",
                }}
                  onMouseEnter={(e) => { if (!isActive(path)) e.currentTarget.style.color = red; }}
                  onMouseLeave={(e) => { if (!isActive(path)) e.currentTarget.style.color = "#111827"; }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── RIGHT ACTIONS ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>

            {/* ── SIGN IN (guest) ── */}
            {!isLoggedIn && (
              <div className="hide-on-mobile">
                <button
                  onClick={openLogin}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "6px 4px", background: "transparent",
                    color: "#111827", border: "none", fontFamily: font,
                    fontWeight: 600, fontSize: "16px", // ← was 14px
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = red)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#111827")}
                >
                  <FiUser style={{ fontSize: "18px" }} />
                  Sign In
                </button>
              </div>
            )}

            {/* ── USER MENU (logged in) ── */}
            {isLoggedIn && (
              <div ref={dropdownRef} style={{ position: "relative" }} className="hide-on-mobile">
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "8px 16px", background: "transparent",
                    color: "#111827", border: "none",
                    borderRadius: "8px", fontFamily: font, fontWeight: 600,
                    fontSize: "16px", // ← was 14px
                    cursor: "pointer", transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = red)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                >
                  <FiUser style={{ fontSize: "16px", color: red }} />
                  {userName.split(" ")[0]}
                  <FiChevronDown style={{
                    fontSize: "14px", transition: "transform 0.2s",
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }} />
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    background: "#fff", border: "1px solid #e5e7eb",
                    borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    minWidth: "160px", overflow: "hidden", zIndex: 100,
                  }}>
                    <DropItem onClick={() => { navigate("/profile"); setDropdownOpen(false); }} label="My Profile" />
                    <DropItem onClick={() => { navigate("/orders"); setDropdownOpen(false); }} label="My Orders" />
                    <div style={{ borderTop: "1px solid #f3f4f6" }} />
                    <DropItem onClick={handleLogout} label="Logout" danger />
                  </div>
                )}
              </div>
            )}

            {/* ── CART ICON ── */}
            <button onClick={() => navigate("/cart")} aria-label="Cart"
              style={{
                position: "relative", width: "42px", height: "42px",
                background: red, border: "none", borderRadius: "50%",
                color: "#fff", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer",
                transition: "background 0.2s", flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#b91c1c")}
              onMouseLeave={(e) => (e.currentTarget.style.background = red)}
            >
              <FiShoppingCart style={{ fontSize: "18px" }} />
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: "-4px", right: "-4px",
                  background: "#111827", color: "#fff", fontSize: "12px", // ← was 10px
                  fontWeight: 700, minWidth: "18px", height: "18px",
                  borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontFamily: font, padding: "0 3px",
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* ── MOBILE HAMBURGER ── */}
            <button onClick={() => setMenuOpen((p) => !p)} aria-label="Menu"
              className="show-on-mobile"
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#111827", fontSize: "24px", display: "none", padding: "4px",
              }}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {menuOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid #e5e7eb", padding: "12px 24px 20px" }}>
            {navLinks.map(({ label, path }) => (
              <Link key={path} to={path} onClick={() => setMenuOpen(false)}
                style={{
                  display: "block", padding: "12px 0", fontFamily: font,
                  fontWeight: isActive(path) ? 700 : 500, fontSize: "17px", // ← was 15px
                  color: isActive(path) ? red : "#111827",
                  textDecoration: "none", borderBottom: "1px solid #f3f4f6",
                }}
              >
                {label}
              </Link>
            ))}

            <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
              {!isLoggedIn ? (
                <>
                  <button onClick={openLogin}
                    style={{ flex: 1, padding: "10px", background: red, color: "#fff", border: "none", borderRadius: "8px", fontFamily: font, fontWeight: 600, fontSize: "16px", cursor: "pointer" }}> {/* ← was 14px */}
                    Login
                  </button>
                  <button onClick={openRegister}
                    style={{ flex: 1, padding: "10px", background: "transparent", color: red, border: `2px solid ${red}`, borderRadius: "8px", fontFamily: font, fontWeight: 600, fontSize: "16px", cursor: "pointer" }}> {/* ← was 14px */}
                    Register
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { navigate("/profile"); setMenuOpen(false); }}
                    style={{ flex: 1, padding: "10px", background: red, color: "#fff", border: "none", borderRadius: "8px", fontFamily: font, fontWeight: 600, fontSize: "16px", cursor: "pointer" }}> {/* ← was 14px */}
                    Profile
                  </button>
                  <button onClick={handleLogout}
                    style={{ flex: 1, padding: "10px", background: "transparent", color: "#374151", border: "1px solid #e5e7eb", borderRadius: "8px", fontFamily: font, fontWeight: 600, fontSize: "16px", cursor: "pointer" }}> {/* ← was 14px */}
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultMode={modalMode}
      />

      <style>{`
        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
          .show-on-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-on-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
};

const DropItem = ({ onClick, label, danger }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", width: "100%", padding: "11px 18px",
        background: hovered ? "#fef2f2" : "#fff",
        color: danger ? "#dc2626" : "#111827",
        border: "none", textAlign: "left",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 500, fontSize: "15px", // ← was 13px
        cursor: "pointer", transition: "background 0.15s",
      }}
    >
      {label}
    </button>
  );
};

export default Navbar;