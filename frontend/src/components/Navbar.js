import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import api from "../api/api";
import LoginModal from "../pages/LoginModal";

const font = "'Poppins', sans-serif";
const red = "#dc2626";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];

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
        api.get("/cart")
          .then((res) => { setCartCount((res.data || []).length); })
          .catch(() => setCartCount(0));
      } else {
        const cart = JSON.parse(localStorage.getItem("guestCart")) || [];
        setCartCount(cart.length);
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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Auto-open login modal if redirected from a protected route
useEffect(() => {
  if (sessionStorage.getItem("redirectAfterLogin")) {
    setModalMode("login");
    setModalOpen(true);
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setDropdownOpen(false);
    navigate("/");
    window.location.reload();
  };

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <nav style={{ position: "relative", background: "transparent", fontFamily: font }}>
          <div style={{
          maxWidth: "1300px", margin: "0 auto", padding: "0 16px",
          height: "70px", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "12px",
        }}>
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }} aria-label="Home">
  <img
    src="/logo.png"
    alt="Kalki"
    style={{
      height: "64px",
      width: "auto",
      objectFit: "contain",
      display: "block",
    }}
  />
</Link>

          <ul style={{
            display: "flex", alignItems: "center", gap: "4px",
            listStyle: "none", margin: 0, padding: 0,
            flexGrow: 1, justifyContent: "center",
          }} className="hide-on-mobile">
            {navLinks.map(({ label, path }) => (
              <li key={path}>
                <Link to={path} style={{
                  fontFamily: font, fontWeight: isActive(path) ? 700 : 500,
                  fontSize: "16px", color: isActive(path) ? red : "#111827",
                  textDecoration: "none", padding: "6px 14px",
                  borderBottom: isActive(path) ? `2px solid ${red}` : "2px solid transparent",
                  transition: "color 0.2s, border-color 0.2s", display: "inline-block",
                }}
                  onMouseEnter={(e) => { if (!isActive(path)) e.currentTarget.style.color = red; }}
                  onMouseLeave={(e) => { if (!isActive(path)) e.currentTarget.style.color = "#111827"; }}
                >{label}</Link>
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            {!isLoggedIn && (
              <div className="hide-on-mobile">
                <button onClick={openLogin} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "6px 4px", background: "transparent",
                  color: "#111827", border: "none", fontFamily: font,
                  fontWeight: 600, fontSize: "16px", cursor: "pointer",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = red)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#111827")}
                >
                  <FiUser style={{ fontSize: "18px" }} /> Sign In
                </button>
              </div>
            )}

            {isLoggedIn && (
              <div ref={dropdownRef} style={{ position: "relative" }} className="hide-on-mobile">
                <button onClick={() => setDropdownOpen((p) => !p)} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "8px 16px", background: "transparent", color: "#111827",
                  border: "none", borderRadius: "8px", fontFamily: font,
                  fontWeight: 600, fontSize: "16px", cursor: "pointer", transition: "border-color 0.2s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = red)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                >
                  <FiUser style={{ fontSize: "16px", color: red }} />
                  {userName.split(" ")[0]}
                  <FiChevronDown style={{ fontSize: "14px", transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
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

            <button onClick={() => navigate("/cart")} aria-label="Cart" style={{
              position: "relative", width: "40px", height: "40px",
              background: red, border: "none", borderRadius: "50%",
              color: "#fff", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer",
              transition: "background 0.2s", flexShrink: 0,
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#b91c1c")}
              onMouseLeave={(e) => (e.currentTarget.style.background = red)}
            >
              <FiShoppingCart style={{ fontSize: "17px" }} />
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: "-4px", right: "-4px",
                  background: "#111827", color: "#fff", fontSize: "11px",
                  fontWeight: 700, minWidth: "17px", height: "17px",
                  borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontFamily: font, padding: "0 3px",
                }}>{cartCount}</span>
              )}
            </button>

            <button onClick={() => setMenuOpen((p) => !p)} aria-label="Menu"
              className="show-on-mobile"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#111827", fontSize: "24px", display: "none", padding: "4px", flexShrink: 0 }}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid #f3f4f6", padding: "8px 0 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
            <div style={{ padding: "0 20px" }}>
              {navLinks.map(({ label, path }) => (
                <Link key={path} to={path} onClick={() => setMenuOpen(false)} style={{
                  display: "flex", alignItems: "center", padding: "13px 0",
                  fontFamily: font, fontWeight: isActive(path) ? 700 : 500,
                  fontSize: "16px", color: isActive(path) ? red : "#111827",
                  textDecoration: "none", borderBottom: "1px solid #f3f4f6",
                }}>
                  {isActive(path) && <span style={{ width: "3px", height: "18px", background: red, borderRadius: "2px", marginRight: "12px", flexShrink: 0 }} />}
                  {label}
                </Link>
              ))}
            </div>
            <div style={{ padding: "16px 20px 0", display: "flex", gap: "10px" }}>
              {!isLoggedIn ? (
                <>
                  <button onClick={openLogin} style={{ flex: 1, padding: "11px 10px", background: red, color: "#fff", border: "none", borderRadius: "8px", fontFamily: font, fontWeight: 600, fontSize: "15px", cursor: "pointer" }}>Login</button>
                  <button onClick={openRegister} style={{ flex: 1, padding: "11px 10px", background: "transparent", color: red, border: `2px solid ${red}`, borderRadius: "8px", fontFamily: font, fontWeight: 600, fontSize: "15px", cursor: "pointer" }}>Register</button>
                </>
              ) : (
                <>
                  <button onClick={() => { navigate("/profile"); setMenuOpen(false); }} style={{ flex: 1, padding: "11px 10px", background: location.pathname === "/profile" ? red : "transparent", color: location.pathname === "/profile" ? "#fff" : "#374151", border: location.pathname === "/profile" ? `1px solid ${red}` : "1px solid #e5e7eb", borderRadius: "8px", fontFamily: font, fontWeight: 600, fontSize: "15px", cursor: "pointer" }}>My Profile</button>
                  <button onClick={() => { navigate("/orders"); setMenuOpen(false); }} style={{ flex: 1, padding: "11px 10px", background: location.pathname === "/orders" ? red : "transparent", color: location.pathname === "/orders" ? "#fff" : "#374151", border: location.pathname === "/orders" ? `1px solid ${red}` : "1px solid #e5e7eb", borderRadius: "8px", fontFamily: font, fontWeight: 600, fontSize: "15px", cursor: "pointer" }}>Orders</button>
                  <button onClick={handleLogout} style={{ flex: 1, padding: "11px 10px", background: "transparent", color: red, border: `1px solid ${red}`, borderRadius: "8px", fontFamily: font, fontWeight: 600, fontSize: "15px", cursor: "pointer" }}>Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginModal isOpen={modalOpen} onClose={() => setModalOpen(false)} defaultMode={modalMode} />

      <style>{`
        @media (max-width: 768px) { .hide-on-mobile { display: none !important; } .show-on-mobile { display: flex !important; } }
        @media (min-width: 769px) { .show-on-mobile { display: none !important; } }
      `}</style>
    </>
  );
};

const DropItem = ({ onClick, label, danger }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "block", width: "100%", padding: "11px 18px", background: hovered ? "#fef2f2" : "#fff", color: danger ? "#dc2626" : "#111827", border: "none", textAlign: "left", fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "15px", cursor: "pointer", transition: "background 0.15s" }}
    >{label}</button>
  );
};

export default Navbar;