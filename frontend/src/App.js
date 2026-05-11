import React, { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import VideosPage from "./pages/VideosPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartDrawer from "./components/CartDrawer";

/* ─── Global layout spacing ─── */
if (typeof document !== "undefined" && !document.getElementById("app-layout-css")) {
  const s = document.createElement("style");
  s.id = "app-layout-css";
  s.textContent = `
    /* Standard pages: breathing room above and below content */
    .app-layout {
      padding-top: 40px;
      padding-bottom: 60px;
      background: #fff;
      box-sizing: border-box;
    }

    /* HomePage: same top gap as all other pages, bottom gap before footer */
    .app-layout-home {
      padding-top: 40px;
      padding-bottom: 0px;
      background: #fff;
      box-sizing: border-box;
    }

    @media (max-width: 768px) {
      .app-layout {
        padding-top: 20px;
        padding-bottom: 40px;
      }
      .app-layout-home {
        padding-top: 20px;
        padding-bottom: 0px;
      }
    }
  `;
  document.head.appendChild(s);
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");
  const role = localStorage.getItem("role");
  return (adminToken && role === "ADMIN") ? children : <Navigate to="/admin/login" />;
};

/* Standard layout — 40px top / 60px bottom gap */
const Layout = ({ children }) => (
  <div className="app-layout">{children}</div>
);

/* Home layout — hero flush against navbar, no outer padding */
const HomeLayout = ({ children }) => (
  <div className="app-layout-home">{children}</div>
);

function AppContent() {
  const location = useLocation();
  const isAdminPage = useMemo(() => location.pathname.startsWith('/admin'), [location.pathname]);

  return (
    <>
      {!isAdminPage && <Navbar />}
      {!isAdminPage && <CartDrawer />}

      <Routes>
        {/* Home — no padding so hero banner sits flush under navbar */}
        <Route path="/" element={<HomeLayout><HomePage /></HomeLayout>} />

        <Route path="/login"    element={<Navigate to="/" />} />
        <Route path="/register" element={<Navigate to="/" />} />

        {/* All other pages get standard top/bottom spacing */}
        <Route path="/cart"           element={<Layout><CartPage /></Layout>} />
        <Route path="/checkout"       element={<Layout><CheckoutPage /></Layout>} />
        <Route path="/order-success"  element={<Layout><OrderSuccessPage /></Layout>} />
        <Route path="/products"       element={<Layout><ProductsPage /></Layout>} />
        <Route path="/products/:id"   element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/about"          element={<Layout><AboutPage /></Layout>} />
        <Route path="/contact"        element={<Layout><ContactPage /></Layout>} />
        <Route path="/videos"         element={<Layout><VideosPage /></Layout>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/orders"  element={<ProtectedRoute><Layout><OrdersPage /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />

        <Route path="/admin/login"      element={<AdminLoginPage />} />
        <Route path="/admin/dashboard"  element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;