import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const font = "'DM Sans', sans-serif";
const red = '#c0392b';

const statusConfig = {
  PENDING:   { bg: '#fff8e1', color: '#b45309', label: 'Pending' },
  CONFIRMED: { bg: '#eff6ff', color: '#1d4ed8', label: 'Confirmed' },
  DELIVERED: { bg: '#f0fdf4', color: '#15803d', label: 'Delivered' },
  CANCELLED: { bg: '#fef2f2', color: '#b91c1c', label: 'Cancelled' },
};

const getStatus = (s) => statusConfig[s] || { bg: '#f5f5f5', color: '#555', label: s };

// ── Star Rating Component ──
const StarRating = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: '6px' }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => onChange(star)}
        style={{
          fontSize: '28px',
          cursor: 'pointer',
          color: star <= value ? '#f59e0b' : '#d1d5db',
          transition: 'color 0.15s',
          userSelect: 'none',
        }}
      >
        ★
      </span>
    ))}
  </div>
);

// ── Review Modal ──
const ReviewModal = ({ order, onClose, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) return setError('Please select a star rating.');
    if (!comment.trim()) return setError('Please write a comment.');

    setLoading(true);
    setError('');
    try {
      await api.post('/reviews', {
        orderId: order.id,
        rating,
        comment,
      });
      onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: '16px', padding: '32px 28px',
            width: '100%', maxWidth: '440px', margin: '0 16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)', fontFamily: font,
            animation: 'modalIn 0.22s ease',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: 0 }}>
              Rate your order
            </h3>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', fontSize: '20px',
                cursor: 'pointer', color: '#9ca3af', lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
            Order #{order.id} · {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
          </p>

          {/* Stars */}
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
            Your Rating <span style={{ color: red }}>*</span>
          </label>
          <StarRating value={rating} onChange={setRating} />

          {/* Comment */}
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', margin: '20px 0 8px' }}>
            Your Review <span style={{ color: red }}>*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => { setComment(e.target.value); setError(''); }}
            placeholder="Share your experience with this order..."
            rows={4}
            style={{
              width: '100%', border: '1px solid #d1d5db', borderRadius: '8px',
              padding: '10px 14px', fontSize: '14px', fontFamily: font,
              color: '#1f2937', background: '#f9fafb', outline: 'none',
              resize: 'vertical', boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.target.style.borderColor = red)}
            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
          />

          {/* Error */}
          {error && (
            <p style={{ color: red, fontSize: '12px', margin: '6px 0 0', fontFamily: font }}>
              ⚠ {error}
            </p>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '11px', border: '1px solid #d1d5db',
                borderRadius: '8px', background: '#fff', color: '#374151',
                fontSize: '14px', fontWeight: 600, fontFamily: font, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                flex: 1, padding: '11px', border: 'none',
                borderRadius: '8px', background: loading ? '#9ca3af' : red,
                color: '#fff', fontSize: '14px', fontWeight: 600,
                fontFamily: font, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => { if (!loading) e.currentTarget.style.background = '#a93226'; }}
              onMouseOut={(e) => { if (!loading) e.currentTarget.style.background = red; }}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewOrder, setReviewOrder] = useState(null);   // order currently being reviewed
  const [reviewedIds, setReviewedIds] = useState([]);     // orders already reviewed this session
  const [toast, setToast] = useState({ visible: false, message: '' });
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

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3500);
  };

  const handleReviewSubmitted = () => {
    setReviewedIds((prev) => [...prev, reviewOrder.id]);
    setReviewOrder(null);
    showToast('Thank you! Your review has been submitted. ✅');
  };

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

  if (loading) return (
    <div style={{ fontFamily: font, maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '32px' }}>
        My Orders
      </h1>
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
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .toast {
          position: fixed; top: 28px; right: 28px; z-index: 9999;
          min-width: 280px; max-width: 400px; padding: 16px 20px;
          border-radius: 10px; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500; display: flex;
          align-items: center; gap: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12); animation: slideIn 0.3s ease;
          background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0;
        }
        .review-btn {
          padding: 7px 18px; background: #c0392b; color: #fff;
          border: none; border-radius: 20px; font-size: 13px;
          font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: background 0.2s;
        }
        .review-btn:hover { background: #a93226; }
        .reviewed-badge {
          padding: 7px 18px; background: #f0fdf4; color: #15803d;
          border: 1px solid #bbf7d0; border-radius: 20px; font-size: 13px;
          font-weight: 600; font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      {/* ── Toast ── */}
      {toast.visible && (
        <div className="toast">{toast.message}</div>
      )}

      {/* ── Review Modal ── */}
      {reviewOrder && (
        <ReviewModal
          order={reviewOrder}
          onClose={() => setReviewOrder(null)}
          onSubmitted={handleReviewSubmitted}
        />
      )}

      <div style={{ fontFamily: font, background: '#fff', minHeight: '100vh', color: '#111' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 60px' }}>

          <h1 style={{
            fontSize: '28px', fontWeight: 800, letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: '32px',
          }}>
            Orders
          </h1>

          {orders.map((order) => {
            const st = getStatus(order.status);
            const isDelivered = order.status === 'DELIVERED';
            const alreadyReviewed = reviewedIds.includes(order.id);

            return (
              <div
                key={order.id}
                style={{
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
                    {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '16px', color: red }}>
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>

                {/* ── Review Section — only for DELIVERED ── */}
               {isDelivered && (
  <div style={{
    marginTop: '14px', paddingTop: '14px',
    borderTop: '1px solid #f3f4f6',
    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
  }}>
    {alreadyReviewed ? (
      <span className="reviewed-badge">✓ Reviewed</span>
    ) : (
      <button
        className="review-btn"
        onClick={() => setReviewOrder(order)}
      >
        Write a Review
      </button>
    )}
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