import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Spinner from "../components/Spinner";

if (typeof document !== "undefined" && !document.getElementById("poppins-font")) {
  const link = document.createElement("link");
  link.id = "poppins-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

if (typeof document !== "undefined" && !document.getElementById("razorpay-script")) {
  const script = document.createElement("script");
  script.id = "razorpay-script";
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.head.appendChild(script);
}

/* ─── Mobile styles ─── */
if (typeof document !== "undefined" && !document.getElementById("checkout-mobile-css")) {
  const s = document.createElement("style");
  s.id = "checkout-mobile-css";
  s.textContent = `
    @media (max-width: 768px) {
      .ck-outer     { padding: 20px 12px !important; }

      /* Single column layout */
      .ck-grid      {
        grid-template-columns: 1fr !important;
        gap: 32px !important;
      }

      /* Name row: single column */
      .ck-name-row  { grid-template-columns: 1fr !important; gap: 12px !important; }

      /* Section titles */
      .ck-title     { font-size: 20px !important; margin-bottom: 18px !important; }

      /* Order column: not sticky on mobile */
      .ck-order-col { position: static !important; top: auto !important; }

      /* Order summary grid items smaller text */
      .ck-order-row-text  { font-size: 13px !important; }
      .ck-order-row-price { font-size: 13px !important; }
    }

    @media (max-width: 400px) {
      .ck-outer   { padding: 16px 10px !important; }
      .ck-title   { font-size: 18px !important; }
    }
  `;
  document.head.appendChild(s);
}

const font = "'Poppins', sans-serif";
const DELIVERY_CHARGE = 40;

const inputStyle = {
  width: "100%", border: "1px solid #d1d5db", borderRadius: "8px",
  padding: "10px 14px", fontSize: "14px", fontFamily: font,
  color: "#1f2937", background: "#f9fafb", outline: "none",
  boxSizing: "border-box", marginTop: "6px",
};

const errorInputStyle = { ...inputStyle, border: "1.5px solid #dc2626", background: "#fff5f5" };
const labelStyle = { fontSize: "13px", fontWeight: 500, color: "#374151", fontFamily: font, display: "block" };
const requiredStar = { color: "#dc2626", marginLeft: "2px" };

const FieldError = ({ msg }) =>
  msg ? <p style={{ color: "#dc2626", fontSize: "12px", fontFamily: font, margin: "4px 0 0" }}>{msg}</p> : null;

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli",
  "Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia",
  "Australia","Austria","Azerbaijan","Bahrain","Bangladesh","Belarus","Belgium",
  "Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil",
  "Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Chad",
  "Chile","China","Colombia","Congo","Costa Rica","Croatia","Cuba","Cyprus",
  "Czech Republic","Denmark","Djibouti","Dominican Republic","Ecuador","Egypt",
  "El Salvador","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France",
  "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Guatemala","Guinea","Haiti",
  "Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel",
  "Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kosovo","Kuwait",
  "Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein",
  "Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta",
  "Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro",
  "Morocco","Mozambique","Myanmar","Namibia","Nepal","Netherlands","New Zealand",
  "Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman",
  "Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines",
  "Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal",
  "Serbia","Sierra Leone","Singapore","Slovakia","Slovenia","Somalia","South Africa",
  "South Korea","South Sudan","Spain","Sri Lanka","Sudan","Sweden","Switzerland",
  "Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tunisia","Turkey",
  "Turkmenistan","Uganda","Ukraine","United Arab Emirates","United Kingdom",
  "United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
];

const CheckoutPage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: "", lastName: "", streetAddress: "", apartment: "",
    city: "", state: "Kerala", country: "India", pinCode: "",
    guestPhone: "", guestEmail: "", orderNotes: "", paymentMethod: "ONLINE",
  });

  const [cart, setCart] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isGuest = !token;

  useEffect(() => {
    if (isGuest) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCart(guestCart);
    } else {
      api.get("/cart").then((res) => setCart(res.data)).catch(() => setCart([]));
    }
  }, []);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price || 0), 0), [cart]);
  const total = useMemo(() => subtotal + DELIVERY_CHARGE, [subtotal]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errors = {};
    if (!form.firstName.trim())     errors.firstName     = "First name is required.";
    if (!form.lastName.trim())      errors.lastName      = "Last name is required.";
    if (!form.streetAddress.trim()) errors.streetAddress = "Street address is required.";
    if (!form.city.trim())          errors.city          = "Town / City is required.";
    if (!form.pinCode.trim())       errors.pinCode       = "PIN Code is required.";
    else if (!/^\d{6}$/.test(form.pinCode)) errors.pinCode = "Enter a valid 6-digit PIN Code.";
    if (isGuest) {
      if (!form.guestPhone.trim())  errors.guestPhone = "Phone number is required.";
      else if (!/^\d{10}$/.test(form.guestPhone)) errors.guestPhone = "Enter a valid 10-digit phone number.";
      if (!form.guestEmail.trim())  errors.guestEmail = "Email address is required.";
      else if (!/\S+@\S+\.\S+/.test(form.guestEmail)) errors.guestEmail = "Enter a valid email address.";
    }
    return errors;
  };

  const placeOrderInBackend = async (shippingAddress, cartItems) => {
    let res;
    if (isGuest) {
      res = await api.post("/orders/place/guest", {
        guestName: `${form.firstName} ${form.lastName}`.trim(),
        guestEmail: form.guestEmail, guestPhone: form.guestPhone,
        shippingAddress, paymentMethod: form.paymentMethod, cartItems,
      });
    } else {
      res = await api.post("/orders/place", { shippingAddress, paymentMethod: form.paymentMethod, cartItems });
    }
    return res.data;
  };

  const createRazorpayOrder = async (amount) => {
    const res = await api.post("/payment/create-order", { amount });
    return res.data;
  };

  const verifyPayment = async (paymentResponse) => {
    const res = await api.post("/payment/verify", {
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
    });
    return res.data;
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) { alert("Your cart is empty! Add some products first."); return; }
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstKey = Object.keys(errors)[0];
      document.getElementsByName(firstKey)[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const cartItems = cart.map((item) => ({
      productId: item.productId || item.product?.id || item.id,
      quantity: item.quantity || 1, price: item.price || 0, weight: item.weight || "250g",
    }));
    const shippingAddress = `${form.streetAddress}${form.apartment ? ", " + form.apartment : ""}, ${form.city}, ${form.state} - ${form.pinCode}, ${form.country}`;
    setLoading(true);
    try {
      const orderData = await placeOrderInBackend(shippingAddress, cartItems);
      const { orderId: razorpayOrderId } = await createRazorpayOrder(total);
      setLoading(false);
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: total * 100, currency: "INR",
        name: "Masala Store", description: "Order Payment", order_id: razorpayOrderId,
        handler: async (paymentResponse) => {
          setLoading(true);
          try {
            const result = await verifyPayment(paymentResponse);
            if (result.success) {
              localStorage.removeItem("guestCart");
              navigate("/order-success", {
                state: {
                  orderId: orderData.id,
                  name: `${form.firstName} ${form.lastName}`.trim() || localStorage.getItem("name"),
                  phone: form.guestPhone, address: shippingAddress,
                  total: total.toFixed(2), paymentId: paymentResponse.razorpay_payment_id,
                },
              });
            } else { alert("❌ Payment verification failed. Please contact support."); }
          } catch { alert("❌ Error verifying payment. Please contact support."); }
          finally { setLoading(false); }
        },
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.guestEmail || localStorage.getItem("email") || "",
          contact: form.guestPhone || "",
        },
        theme: { color: "#dc2626" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            alert("Payment cancelled. Your order is saved — complete payment to confirm.");
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setLoading(false);
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Failed to place order! Please try again.");
    }
  };

  const inp = (name) => ({ ...(fieldErrors[name] ? errorInputStyle : inputStyle) });

  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: font }}>
      <div className="ck-outer" style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
        <form onSubmit={handleOrder} noValidate>
          {/* ck-grid: 2-col desktop → 1-col mobile */}
          <div
            className="ck-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "48px", alignItems: "start" }}
          >

            {/* ══ LEFT: Billing Details ══ */}
            <div>
              <h2 className="ck-title" style={{ fontSize: "26px", fontWeight: 700, color: "#1f2937", fontFamily: font, marginBottom: "28px" }}>
                Billing details
              </h2>

              {!isGuest && (
                <div style={{
                  background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "8px",
                  padding: "10px 14px", fontSize: "13px", color: "#c2410c",
                  fontFamily: font, marginBottom: "20px",
                }}>
                  Ordering as <strong>{localStorage.getItem("userName")}</strong>
                </div>
              )}

              {/* First + Last Name */}
              <div className="ck-name-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={labelStyle}>First name <span style={requiredStar}>*</span></label>
                  <input style={inp("firstName")} type="text" name="firstName" value={form.firstName} onChange={handleChange} />
                  <FieldError msg={fieldErrors.firstName} />
                </div>
                <div>
                  <label style={labelStyle}>Last name <span style={requiredStar}>*</span></label>
                  <input style={inp("lastName")} type="text" name="lastName" value={form.lastName} onChange={handleChange} />
                  <FieldError msg={fieldErrors.lastName} />
                </div>
              </div>

              {/* Country */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Country / Region <span style={requiredStar}>*</span></label>
                <select style={{ ...inputStyle, cursor: "pointer" }} name="country" value={form.country} onChange={handleChange}>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Street Address */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Street address <span style={requiredStar}>*</span></label>
                <input
                  style={{ ...(fieldErrors.streetAddress ? errorInputStyle : inputStyle), marginBottom: "8px" }}
                  type="text" name="streetAddress" value={form.streetAddress}
                  onChange={handleChange} placeholder="House number and street name"
                />
                <FieldError msg={fieldErrors.streetAddress} />
                <input
                  style={inputStyle} type="text" name="apartment" value={form.apartment}
                  onChange={handleChange} placeholder="Apartment, suite, unit, etc. (optional)"
                />
              </div>

              {/* Town/City */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Town / City <span style={requiredStar}>*</span></label>
                <input style={inp("city")} type="text" name="city" value={form.city} onChange={handleChange} />
                <FieldError msg={fieldErrors.city} />
              </div>

              {/* State */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>State <span style={requiredStar}>*</span></label>
                <select style={{ ...inputStyle, cursor: "pointer" }} name="state" value={form.state} onChange={handleChange}>
                  {INDIAN_STATES.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>

              {/* PIN Code */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>PIN Code <span style={requiredStar}>*</span></label>
                <input style={inp("pinCode")} type="text" name="pinCode" value={form.pinCode} onChange={handleChange} maxLength={6} />
                <FieldError msg={fieldErrors.pinCode} />
              </div>

              {isGuest && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Phone <span style={requiredStar}>*</span></label>
                    <input style={inp("guestPhone")} type="tel" name="guestPhone" value={form.guestPhone} onChange={handleChange} maxLength={10} />
                    <FieldError msg={fieldErrors.guestPhone} />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Email address <span style={requiredStar}>*</span></label>
                    <input style={inp("guestEmail")} type="email" name="guestEmail" value={form.guestEmail} onChange={handleChange} />
                    <FieldError msg={fieldErrors.guestEmail} />
                  </div>
                </>
              )}

              {/* Order Notes */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Order notes <span style={{ color: "#9ca3af", fontSize: "12px" }}>(optional)</span></label>
                <textarea
                  style={{ ...inputStyle, resize: "vertical", minHeight: "90px" }}
                  name="orderNotes" value={form.orderNotes} onChange={handleChange}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                />
              </div>
            </div>

            {/* ══ RIGHT: Your Order ══ */}
            <div className="ck-order-col" style={{ position: "sticky", top: "24px" }}>
              <h2 className="ck-title" style={{ fontSize: "26px", fontWeight: 700, color: "#1f2937", fontFamily: font, marginBottom: "24px" }}>
                Your order
              </h2>

              <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>

                {/* Header row */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr auto",
                  padding: "12px 16px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb",
                }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7280", fontFamily: font }}>Product</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7280", fontFamily: font }}>Subtotal</span>
                </div>

                {/* Cart items */}
                {cart.length === 0 ? (
                  <div style={{ padding: "20px", color: "#9ca3af", fontSize: "14px", fontFamily: font, textAlign: "center" }}>Cart is empty</div>
                ) : (
                  cart.map((item, i) => (
                    <div key={i} style={{
                      display: "grid", gridTemplateColumns: "1fr auto",
                      padding: "10px 16px", borderBottom: "1px solid #f3f4f6", alignItems: "center", gap: "8px",
                    }}>
                      <span className="ck-order-row-text" style={{ fontSize: "13px", color: "#374151", fontFamily: font, lineHeight: 1.4 }}>
                        {item.productName || item.product?.name || item.name}
                        {item.weight ? ` - ${item.weight.toUpperCase()}` : ""}
                        <span style={{ fontWeight: 700, color: "#1f2937" }}> × {item.quantity || 1}</span>
                      </span>
                      <span className="ck-order-row-price" style={{ fontSize: "13px", fontWeight: 500, color: "#1f2937", fontFamily: font }}>
                        ₹{(item.price || 0).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}

                {/* Subtotal */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", padding: "12px 16px", borderBottom: "1px solid #e5e7eb", background: "#fafafa" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#1f2937", fontFamily: font, textTransform: "uppercase", letterSpacing: "0.04em" }}>Subtotal</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#1f2937", fontFamily: font }}>₹{subtotal.toFixed(2)}</span>
                </div>

                {/* Delivery */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#1f2937", fontFamily: font }}>Delivery</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#1f2937", fontFamily: font }}>₹{DELIVERY_CHARGE}.00</span>
                </div>

                {/* Total */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", padding: "14px 16px", borderBottom: "1px solid #e5e7eb" }}>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#1f2937", fontFamily: font, textTransform: "uppercase", letterSpacing: "0.04em" }}>Total</span>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", fontFamily: font }}>₹{total.toFixed(2)}</span>
                </div>

                {/* Payment method */}
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb" }}>
                  <div
                    onClick={() => setForm({ ...form, paymentMethod: "ONLINE" })}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "12px 14px", borderRadius: "8px", cursor: "pointer",
                      border: form.paymentMethod === "ONLINE" ? "2px solid #dc2626" : "1px solid #e5e7eb",
                      background: form.paymentMethod === "ONLINE" ? "#fff5f5" : "#fff",
                    }}
                  >
                    <input type="radio" readOnly checked={form.paymentMethod === "ONLINE"} style={{ accentColor: "#dc2626" }} />
                    <div>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#1f2937", fontFamily: font }}>Online Payment</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", fontFamily: font }}>Pay securely via Razorpay</p>
                    </div>
                  </div>
                </div>

                {/* Privacy note */}
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
                  <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", fontFamily: font, lineHeight: 1.6 }}>
                    Your personal data will be used to process your order and support your experience on this website.
                  </p>
                </div>

                {/* Submit */}
                <div style={{ padding: "14px 16px" }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%", background: loading ? "#9ca3af" : "#dc2626",
                      color: "#fff", border: "none", borderRadius: "30px", padding: "14px",
                      fontSize: "16px", fontWeight: 600, fontFamily: font,
                      cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s",
                    }}
                    onMouseOver={(e) => { if (!loading) e.currentTarget.style.background = "#b91c1c"; }}
                    onMouseOut={(e) => { if (!loading) e.currentTarget.style.background = "#dc2626"; }}
                  >
                    {loading ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <Spinner size="sm" color="white" />
                        Processing...
                      </span>
                    ) : "Place order"}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;