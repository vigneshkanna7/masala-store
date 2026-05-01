import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const font = "'DM Sans', sans-serif";
const red = '#c0392b';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    PENDING:   { bg: '#fff8e1', color: '#b45309', label: 'Pending' },
    CONFIRMED: { bg: '#eff6ff', color: '#1d4ed8', label: 'Confirmed' },
    DELIVERED: { bg: '#f0fdf4', color: '#15803d', label: 'Delivered' },
    CANCELLED: { bg: '#fef2f2', color: '#b91c1c', label: 'Cancelled' },
  };

  const getStatus = (s) => statusConfig[s] || { bg: '#f5f5f5', color: '#555', label: s };

  // ── Skeleton ──
  const Skeleton = () => (
    <div style={{
      border: '1px solid #e5e7eb', borderRadius: '10px',
      padding: '20px 22px', marginBottom: '14px',
    }}>
      {[['60%', '12px'], ['40%', '12px'], ['80%', '12px'], ['30%', '12px']].map(([w, h], i) => (
        <div key={i} style={{
          width: w, height: h, background: '#f0f0f0', borderRadius: '6px',
          marginBottom: i < 3 ? '12px' : '0', animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );

  // ── Loading ──
  if (loading) return (
    <div style={{ fontFamily: font, maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '32px' }}>
        My Orders
      </h1>
      {[...Array(3)].map((_, i) => <Skeleton key={i} />)}
    </div>
  );

  // ── Empty ──
  if (orders.length === 0) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; } .shop-btn { padding: 13px 36px; background: ${red}; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: ${font}; transition: background 0.2s; } .shop-btn:hover { background: #a93226; }`}</style>
      <div style={{ fontFamily: font, textAlign: 'center', padding: '80px 24px', color: '#111' }}>
        <p style={{ fontSize: '18px', color: '#777', marginBottom: '24px' }}>No orders placed yet.</p>
        <button className="shop-btn" onClick={() => navigate('/')}>Shop Now</button>
      </div>
    </>
  );

  // ── Orders list ──
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .order-card {
          border: 1px solid #e5e7eb; border-radius: '10px';
          padding: 20px 22px; margin-bottom: 14px;
          transition: border-color 0.18s, box-shadow 0.18s;
          background: #fff;
        }
        .order-card:hover { border-color: #d1d5db; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
      `}</style>

      <div style={{ fontFamily: font, background: '#fff', minHeight: '100vh', color: '#111' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 60px' }}>

          {/* ── Heading ── */}
          <h1 style={{
            fontSize: '28px', fontWeight: 800, letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: '32px',
          }}>
             Orders
          </h1>

          {orders.map((order) => {
            const st = getStatus(order.status);
            return (
              <div key={order.id} style={{
                border: '1px solid #e5e7eb', borderRadius: '10px',
                padding: '20px 22px', marginBottom: '14px',
                transition: 'border-color 0.18s, box-shadow 0.18s', background: '#fff',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>Order #{order.id}</span>
                  <span style={{
                    padding: '4px 14px', borderRadius: '20px',
                    background: st.bg, color: st.color,
                    fontSize: '12px', fontWeight: 700, letterSpacing: '0.03em',
                  }}>
                    {st.label}
                  </span>
                </div>

                {/* Body */}
                <div style={{
                  borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6',
                  padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '7px',
                }}>
                  <p style={{ fontSize: '13.5px', color: '#555' }}>
                    💳 <span style={{ color: '#888' }}>Payment:</span>{' '}
                    <span style={{ fontWeight: 600, color: '#111' }}>{order.paymentMethod}</span>
                    {' — '}
                    <span style={{ fontWeight: 600, color: '#111' }}>{order.paymentStatus}</span>
                  </p>
                  <p style={{ fontSize: '13.5px', color: '#555' }}>
                    📍 <span style={{ color: '#888' }}>Address:</span>{' '}
                    <span style={{ fontWeight: 600, color: '#111' }}>{order.shippingAddress}</span>
                  </p>
                  <p style={{ fontSize: '13.5px', color: '#555' }}>
                    🕐 <span style={{ color: '#888' }}>Date:</span>{' '}
                    <span style={{ fontWeight: 600, color: '#111' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                  </p>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#aaa' }}>
                    {order.orderItems?.length || 0} item{order.orderItems?.length !== 1 ? 's' : ''}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '16px', color: red }}>
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </>
  );
}

export default OrdersPage;