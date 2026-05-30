import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";

const font = "'DM Sans', sans-serif";
const red = '#c0392b';

const statusConfig = {
  PLACED:    { bg: '#fff7ed', color: '#c2410c', label: 'Placed' },
  CONFIRMED: { bg: '#eff6ff', color: '#1d4ed8', label: 'Confirmed' },
  PACKED:    { bg: '#fdf4ff', color: '#7e22ce', label: 'Packed' },
  SHIPPED:   { bg: '#f0f9ff', color: '#0369a1', label: 'Shipped' },
  DELIVERED: { bg: '#f0fdf4', color: '#15803d', label: 'Delivered' },
  CANCELLED: { bg: '#fef2f2', color: '#b91c1c', label: 'Cancelled' },
  PENDING:   { bg: '#fff8e1', color: '#b45309', label: 'Pending' },
};

const getStatus = (s) => statusConfig[s] || { bg: '#f5f5f5', color: '#555', label: s };

const getDisplayStatus = (status) => {
  if (status === 'DELIVERED') return statusConfig['DELIVERED'];
  if (status === 'CANCELLED') return statusConfig['CANCELLED'];
  return { bg: '#fff8e1', color: '#b45309', label: 'Pending' };
};

const STEPS = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'];
const STEP_META = {
  PLACED:    { label: 'Placed'},
  CONFIRMED: { label: 'Confirmed'},
  PACKED:    { label: 'Packed'},
  SHIPPED:   { label: 'Shipped'},
  DELIVERED: { label: 'Delivered'},
};

// ── Star Rating ───────────────────────────────────────────────
const StarRating = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: '6px' }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} onClick={() => onChange(star)} style={{
        fontSize: '28px', cursor: 'pointer',
        color: star <= value ? '#f59e0b' : '#d1d5db',
        transition: 'color 0.15s', userSelect: 'none',
      }}>★</span>
    ))}
  </div>
);

// ── Review Modal ──────────────────────────────────────────────
const ReviewModal = ({ order, onClose, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) return setError('Please select a star rating.');
    if (!comment.trim()) return setError('Please write a comment.');
    setLoading(true); setError('');
    try {
      await api.post('/reviews', { orderId: order.id, rating, comment });
      onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '16px', padding: '28px 24px',
        width: '100%', maxWidth: '440px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)', fontFamily: font,
        animation: 'modalIn 0.22s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: 0 }}>Rate your order</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9ca3af' }}>✕</button>
        </div>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
          Order #{order.id} · {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
        </p>
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
          Your Rating <span style={{ color: red }}>*</span>
        </label>
        <StarRating value={rating} onChange={setRating} />
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', margin: '18px 0 8px' }}>
          Your Review <span style={{ color: red }}>*</span>
        </label>
        <textarea value={comment} onChange={(e) => { setComment(e.target.value); setError(''); }}
          placeholder="Share your experience with this order..." rows={4}
          style={{
            width: '100%', border: '1px solid #d1d5db', borderRadius: '8px',
            padding: '10px 14px', fontSize: '14px', fontFamily: font,
            color: '#1f2937', background: '#f9fafb', outline: 'none',
            resize: 'vertical', boxSizing: 'border-box',
          }}
          onFocus={(e) => (e.target.style.borderColor = red)}
          onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
        />
        {error && <p style={{ color: red, fontSize: '12px', margin: '6px 0 0' }}>⚠ {error}</p>}
        <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', border: '1px solid #d1d5db',
            borderRadius: '8px', background: '#fff', color: '#374151',
            fontSize: '14px', fontWeight: 600, fontFamily: font, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{
            flex: 1, padding: '11px', border: 'none',
            borderRadius: '8px', background: loading ? '#9ca3af' : red,
            color: '#fff', fontSize: '14px', fontWeight: 600,
            fontFamily: font, cursor: loading ? 'not-allowed' : 'pointer',
          }}>{loading ? 'Submitting...' : 'Submit Review'}</button>
        </div>
      </div>
    </div>
  );
};

// ── Details Drawer ────────────────────────────────────────────
const DetailsDrawer = ({ order, onClose }) => {
  const st = getStatus(order.status);
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '20px 20px 0 0',
        width: '100%', maxWidth: '560px',
        padding: '28px 24px 36px', fontFamily: font,
        animation: 'drawerUp 0.28s ease',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
        maxHeight: '85vh', overflowY: 'auto',
      }}>
        <div style={{ width: '40px', height: '4px', background: '#e5e7eb', borderRadius: '99px', margin: '0 auto 20px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#111' }}>Order Details</h3>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#9ca3af' }}>#{order.id}</p>
          </div>
          <span style={{
            padding: '4px 14px', borderRadius: '20px', fontSize: '12px',
            fontWeight: 700, background: st.bg, color: st.color,
          }}>{st.label}</span>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>
            Items Ordered
          </p>
          {order.items?.map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid #f3f4f6',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {(item.imageUrl || item.product?.imageUrl)
                  ? <img src={item.imageUrl || item.product?.imageUrl} alt={item.productName || item.product?.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                  : <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🌶️</div>
                }
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#111' }}>{item.productName || item.product?.name}</p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#9ca3af' }}>Qty: {item.quantity} · {item.weight || '1kg'}</p>
                </div>
              </div>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#111' }}>₹{(item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>
        {[
          { icon: '📍', label: 'Delivery Address', value: order.shippingAddress },
          { icon: '💳', label: 'Payment Mode', value: `${order.paymentMethod} — ${order.paymentStatus}` },
          { icon: '🕐', label: 'Order Date', value: new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ fontSize: '16px', marginTop: '1px' }}>{row.icon}</span>
            <div>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.label}</p>
              <p style={{ margin: '3px 0 0', fontSize: '14px', color: '#111', fontWeight: 500 }}>{row.value}</p>
            </div>
          </div>
        ))}
        <div style={{ marginTop: '20px', padding: '16px 20px', background: '#fff7ed', borderRadius: '12px', border: '1px solid #fed7aa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#92400e' }}>Items Subtotal</span>
            <span style={{ fontSize: '13px', color: '#92400e' }}>₹{((order.totalAmount || 0) - 40).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: '#92400e' }}>Delivery Charge</span>
            <span style={{ fontSize: '13px', color: '#92400e' }}>₹40.00</span>
          </div>
          <div style={{ borderTop: '1px solid #fed7aa', marginBottom: '12px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#92400e' }}>Total Amount</span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: red }}>₹{order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Track Drawer ──────────────────────────────────────────────
const TrackDrawer = ({ order, onClose }) => {
  const [history, setHistory] = useState([]);
  const isCancelled = order.status === 'CANCELLED';

  useEffect(() => {
    api.get(`/orders/${order.id}/history`)
      .then(res => setHistory(res.data))
      .catch(() => {});
  }, [order.id]);

  const formatDate = (dt) => new Date(dt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const formatTime = (dt) => new Date(dt).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });

  const STEP_DESC = {
    PLACED:    'Your order has been placed successfully.',
    CONFIRMED: 'Seller has confirmed your order.',
    PACKED:    'Your order has been packed and is ready to ship.',
    SHIPPED:   'Your order is on the way.',
    DELIVERED: 'Your order has been delivered.',
    CANCELLED: 'Your order has been cancelled.',
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '20px 20px 0 0',
        width: '100%', maxWidth: '560px',
        padding: '28px 24px 40px', fontFamily: font,
        animation: 'drawerUp 0.28s ease',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
        maxHeight: '85vh', overflowY: 'auto',
      }}>
        <div style={{ width: '40px', height: '4px', background: '#e5e7eb', borderRadius: '99px', margin: '0 auto 20px' }} />
        <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800, color: '#111' }}>Track Order</h3>
        <p style={{ margin: '0 0 28px', fontSize: '13px', color: '#9ca3af' }}>#{order.id}</p>

        {isCancelled ? (
          <div style={{ textAlign: 'center', padding: '32px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fca5a5' }}>
            <p style={{ fontSize: '32px', margin: '0 0 8px' }}>❌</p>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#b91c1c', margin: 0 }}>Order Cancelled</p>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: '6px', top: '12px',
              width: '2px', bottom: '12px',
              background: red, zIndex: 0,
            }} />

            {history.map((h, i) => {
              const isLast = i === history.length - 1;
              return (
                <div key={h.id} style={{
                  display: 'flex', gap: '20px',
                  marginBottom: isLast ? '0' : '28px',
                  position: 'relative', zIndex: 2,
                }}>
                  {/* Dot */}
                  <div style={{
                  width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0,
                  background: red,
                  marginTop: '6px',
                }} />
              
                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <p style={{
                        margin: 0, fontSize: '15px',
                        fontWeight: isLast ? 800 : 600,
                        color: isLast ? '#111' : '#374151',
                      }}>
                        {STEP_META[h.status]?.icon} {STEP_META[h.status]?.label || h.status}
                      </p>
                      <span style={{ fontSize: '11px', color: '#9ca3af', flexShrink: 0, marginLeft: '8px' }}>
                        {formatDate(h.updatedAt)}
                      </span>
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#6b7280' }}>
                      {STEP_DESC[h.status]}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af' }}>
                      {formatTime(h.updatedAt)}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Show remaining steps grayed out */}
            {STEPS.slice(history.length).map((step) => (
              <div key={step} style={{
                display: 'flex', gap: '20px', marginTop: '28px',
                position: 'relative', zIndex: 2, opacity: 0.4,
              }}>
              <div style={{
            width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0,
            background: '#fff', border: '2px solid #d1d5db', marginTop: '6px',
          }} />
                <div style={{ flex: 1, paddingTop: '2px' }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#9ca3af' }}>
                    {STEP_META[step]?.label}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#d1d5db' }}>Pending</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
function OrdersPage() {
  // ✅ Handle unauthenticated access — save destination and redirect to home
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname + window.location.search);
      window.location.href = "/";
    }
  }, []);

  if (!token) return null;

  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [reviewedIds, setReviewedIds] = useState([]);
  const [detailsOrder, setDetailsOrder] = useState(null);
  const [trackOrder, setTrackOrder]   = useState(null);
  const [toast, setToast]             = useState({ visible: false, message: '' });
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const reviewOrderIdFromEmail = searchParams.get('reviewOrderId')
    ? Number(searchParams.get('reviewOrderId'))
    : null;

  const highlightRef = useRef(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      const fetchedOrders = res.data;
      setOrders(fetchedOrders);

      if (reviewOrderIdFromEmail) {
        const target = fetchedOrders.find(o => o.id === reviewOrderIdFromEmail);
        if (target && target.status === 'DELIVERED') {
          setTimeout(() => {
            setReviewOrder(target);
            highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 400);
        }
      }
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3500);
  };

  const handleReviewSubmitted = () => {
    setReviewedIds((prev) => [...prev, reviewOrder.id]);
    setReviewOrder(null);
    showToast('Thank you! Your review has been submitted. ✅');
  };

  const Skeleton = () => (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '12px' }}>
      {[['50%', '16px'], ['70%', '12px'], ['40%', '12px']].map(([w, h], i) => (
        <div key={i} style={{
          width: w, height: h, background: '#f0f0f0', borderRadius: '6px',
          marginBottom: i < 2 ? '12px' : '0', animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      ))}
    </div>
  );

  if (loading) return (
    <div style={{ fontFamily: font, maxWidth: '720px', margin: '0 auto', padding: '32px 16px' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '28px' }}>My Orders</h1>
      {[...Array(3)].map((_, i) => <Skeleton key={i} />)}
    </div>
  );

  if (orders.length === 0) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .shop-btn { padding: 13px 36px; background: #c0392b; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
        .shop-btn:hover { background: #a93226; }
      `}</style>
      <div style={{ fontFamily: font, textAlign: 'center', padding: '80px 24px', color: '#111' }}>
        <p style={{ fontSize: '18px', color: '#777', marginBottom: '24px' }}>No orders placed yet.</p>
        <button className="shop-btn" onClick={() => navigate('/')}>Shop Now</button>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes modalIn  { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes drawerUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }

        @keyframes cardGlow {
          0%   { box-shadow: 0 0 0 0 rgba(192,57,43,0.4); border-color: #c0392b; }
          50%  { box-shadow: 0 0 0 8px rgba(192,57,43,0);  border-color: #c0392b; }
          100% { box-shadow: 0 0 0 0 rgba(192,57,43,0);    border-color: #c0392b; }
        }
        .card-highlight {
          border-color: #c0392b !important;
          background: #fff5f5 !important;
          animation: cardGlow 1.4s ease 3;
        }

        .toast {
          position: fixed; top: 20px; right: 16px; z-index: 9999;
          min-width: 240px; max-width: 90vw; padding: 14px 18px;
          border-radius: 10px; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500; display: flex;
          align-items: center; gap: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12); animation: slideIn 0.3s ease;
          background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0;
        }
        .ord-action-btn {
          flex: 1; padding: 9px 0; border-radius: 8px; font-size: 13px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.18s; border: none;
        }
        .review-btn {
          padding: 7px 16px; background: #c0392b; color: #fff;
          border: none; border-radius: 20px; font-size: 13px;
          font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: background 0.2s; white-space: nowrap;
        }
        .review-btn:hover { background: #a93226; }
        .reviewed-badge {
          padding: 7px 16px; background: #f0fdf4; color: #15803d;
          border: 1px solid #bbf7d0; border-radius: 20px; font-size: 13px;
          font-weight: 600; font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        @media (max-width: 480px) {
          .ord-page-wrap  { padding: 24px 12px 48px !important; }
          .ord-page-title { font-size: 20px !important; margin-bottom: 20px !important; }
        }
      `}</style>

      {toast.visible && <div className="toast">{toast.message}</div>}
      {reviewOrder  && <ReviewModal order={reviewOrder} onClose={() => setReviewOrder(null)} onSubmitted={handleReviewSubmitted} />}
      {detailsOrder && <DetailsDrawer order={detailsOrder} onClose={() => setDetailsOrder(null)} />}
      {trackOrder   && <TrackDrawer  order={trackOrder}  onClose={() => setTrackOrder(null)} />}

      <div style={{ fontFamily: font, background: '#fff', color: '#111' }}>
        <div className="ord-page-wrap" style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px 48px' }}>

          <h1 className="ord-page-title" style={{
            fontSize: '28px', fontWeight: 800, letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: '32px',
          }}>My Orders</h1>

          {orders.map((order) => {
            const displaySt     = getDisplayStatus(order.status);
            const isDelivered   = order.status === 'DELIVERED';
            const isCancelled   = order.status === 'CANCELLED';
            const alreadyReviewed = reviewedIds.includes(order.id);
            const productNames  = order.items?.map(i => i.productName || i.product?.name).join(', ') || 'Order';
            const itemCount     = order.items?.length || 0;
            const isEmailTarget = order.id === reviewOrderIdFromEmail;

            return (
              <div
                key={order.id}
                ref={isEmailTarget ? highlightRef : null}
                className={isEmailTarget ? 'card-highlight' : ''}
                style={{
                  border: '1px solid #e5e7eb', borderRadius: '14px',
                  padding: '18px 20px', marginBottom: '14px',
                  background: '#fff', transition: 'box-shadow 0.18s, border-color 0.18s',
                }}
                onMouseEnter={(e) => { if (!isEmailTarget) { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'; }}}
                onMouseLeave={(e) => { if (!isEmailTarget) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600 }}>#{order.id}</span>
                  <span style={{
                    padding: '3px 12px', borderRadius: '20px',
                    fontSize: '11px', fontWeight: 700,
                    background: displaySt.bg, color: displaySt.color,
                  }}>{displaySt.label}</span>
                </div>

                <p style={{
                  margin: '0 0 4px', fontSize: '16px', fontWeight: 700,
                  color: '#111', lineHeight: 1.3,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{productNames}</p>

                <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#9ca3af' }}>
                  {itemCount} item{itemCount !== 1 ? 's' : ''} · ₹{order.totalAmount?.toFixed(2)} ·{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="ord-action-btn"
                    onClick={() => setDetailsOrder(order)}
                    style={{ background: '#f3f4f6', color: '#374151' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#e5e7eb'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
                  >View Details</button>
                  <button
                    className="ord-action-btn"
                    onClick={() => setTrackOrder(order)}
                    style={{ background: isCancelled ? '#fef2f2' : red, color: isCancelled ? '#b91c1c' : '#fff' }}
                    onMouseOver={(e) => { if (!isCancelled) e.currentTarget.style.background = '#a93226'; }}
                    onMouseOut={(e)  => { if (!isCancelled) e.currentTarget.style.background = red; }}
                  >{isCancelled ? 'Cancelled' : 'Track Order'}</button>
                </div>

                {isDelivered && (
                  <div style={{
                    marginTop: '14px', paddingTop: '14px',
                    borderTop: '1px solid #f3f4f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                  }}>
                    {alreadyReviewed
                      ? <span className="reviewed-badge">✓ Reviewed</span>
                      : <button className="review-btn" onClick={() => setReviewOrder(order)}>
                          {isEmailTarget ? 'Write Your Review' : 'Write a Review'}
                        </button>
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default OrdersPage;