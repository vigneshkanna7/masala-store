// src/pages/ProfilePage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/api';

const font = "'DM Sans', sans-serif";
const red = '#c0392b';

const inp = {
  width: '100%', padding: '13px 16px', border: '1px solid #e5e7eb',
  borderRadius: '8px', fontSize: '15px', fontFamily: font,
  color: '#111', background: '#f5f6fa', outline: 'none',
  transition: 'border-color 0.18s, background 0.18s',
  boxSizing: 'border-box',
};
const inpDisabled = { ...inp, color: '#888', cursor: 'not-allowed', background: '#f0f0f0' };
const inpEye = { ...inp, paddingRight: '46px' };
const lbl = { display: 'block', fontSize: '14px', fontWeight: 500, color: '#111', marginBottom: '8px' };
const fg = { marginBottom: '22px' };
const eyeBtn = {
  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
  background: 'none', border: 'none', cursor: 'pointer', color: '#666',
  display: 'flex', alignItems: 'center', padding: '4px',
};

const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 01-4.24-4.24" />
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.5 18.5 0 015.06-5.94" />
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

function ProfilePage() {
  const navigate = useNavigate();

  // ✅ NEW — read URL params from the review email link
  const [searchParams] = useSearchParams();
  const tabFromUrl        = searchParams.get('tab');           // e.g. "orders"
  const reviewOrderIdStr  = searchParams.get('reviewOrderId'); // e.g. "123"
  const reviewOrderId     = reviewOrderIdStr ? Number(reviewOrderIdStr) : null;

  // ✅ Tab state — default to 'orders' if email link says so, otherwise 'profile'
  const [activeTab, setActiveTab] = useState(tabFromUrl === 'orders' ? 'orders' : 'profile');

  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [toast, setToast] = useState({ visible: false, message: '', success: true });

  // ✅ Ref to scroll/highlight the target order row
  const reviewRowRef = useRef(null);

  useEffect(() => { fetchProfile(); }, []);

  // ✅ When orders tab is active and reviewOrderId is set, scroll to that order
  useEffect(() => {
    if (activeTab === 'orders' && reviewOrderId && reviewRowRef.current) {
      setTimeout(() => {
        reviewRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
  }, [activeTab, reviewOrderId]);

  const showToast = (message, success = true) => {
    setToast({ visible: true, message, success });
    setTimeout(() => setToast({ visible: false, message: '', success: true }), 3000);
  };

  const fetchProfile = async () => {
    try { const res = await api.get('/user/profile'); setProfile(res.data); }
    catch (err) { console.error('Error fetching profile', err); }
  };

  const handleSave = async () => {
    const hasPasswordChange = passwordData.newPassword || passwordData.confirmPassword;
    if (hasPasswordChange) {
      if (!passwordData.currentPassword) {
        showToast('Please enter your current password!', false); return;
      }
      if (passwordData.newPassword.length < 8) {
        showToast('Password must be at least 8 characters!', false); return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        showToast('New passwords do not match!', false); return;
      }
      try {
        await api.put('/user/profile', { name: profile.name, phone: profile.phone, address: profile.address });
        await api.put('/user/change-password', {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });
        showToast('Profile and password updated successfully!', true);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch { showToast('Failed to save. Check your password.', false); }
    } else {
      try {
        await api.put('/user/profile', { name: profile.name, phone: profile.phone, address: profile.address });
        showToast('Profile saved successfully!', true);
      } catch { showToast('Failed to update profile!', false); }
    }
  };

  const togglePwd = (key) => setShowPwd(p => ({ ...p, [key]: !p[key] }));

  // ✅ This is the handler your existing "Give Review" button should call
  // Pass the orderId and productId to navigate to the review form
  const handleGiveReview = (orderId, productId) => {
    // Option A — navigate to a dedicated review page:
    // navigate(`/products/${productId}?review=true&orderId=${orderId}`);

    // Option B — open a review modal (if you use a modal):
    // setReviewModal({ open: true, orderId, productId });

    // 👇 Adjust this to match wherever your review button currently navigates
    navigate(`/products/${productId}?review=true&orderId=${orderId}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        .prof-inp:focus { border-color: #c0392b !important; background: #fff !important; }

        .save-btn {
          padding: 13px 40px; background: #c0392b; color: #fff; border: none;
          border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: background 0.2s;
        }
        .save-btn:hover { background: #a93226; }

        .toast {
          position: fixed; top: 28px; right: 28px; z-index: 9999;
          min-width: 280px; max-width: 400px; padding: 16px 20px;
          border-radius: 10px; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500; display: flex;
          align-items: center; gap: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12); animation: slideIn 0.3s ease;
        }
        .toast-success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
        .toast-error   { background: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ── Tab styles ── */
        .profile-tabs {
          display: flex; gap: 8px; margin-bottom: 32px;
          border-bottom: 2px solid #f0f0f0;
        }
        .tab-btn {
          padding: 10px 24px; font-size: 15px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; border: none; background: none;
          cursor: pointer; color: #888; border-bottom: 3px solid transparent;
          margin-bottom: -2px; transition: color 0.2s, border-color 0.2s;
        }
        .tab-btn.active { color: #c0392b; border-bottom-color: #c0392b; }
        .tab-btn:hover  { color: #c0392b; }

        /* ── Highlighted order row (from email link) ── */
        .order-row-highlight {
          border: 2px solid #c0392b !important;
          background: #fff5f5 !important;
          border-radius: 12px;
          animation: pulseHighlight 1.5s ease 2;
        }
        @keyframes pulseHighlight {
          0%   { box-shadow: 0 0 0 0 rgba(192,57,43,0.3); }
          50%  { box-shadow: 0 0 0 8px rgba(192,57,43,0); }
          100% { box-shadow: 0 0 0 0 rgba(192,57,43,0); }
        }

        /* ── Review button ── */
        .review-btn {
          padding: 8px 20px; background: #c0392b; color: #fff;
          border: none; border-radius: 6px; font-size: 13px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background 0.2s;
        }
        .review-btn:hover { background: #a93226; }

        /* ── Profile page layout ── */
        .profile-wrapper {
          max-width: 960px; margin: 0 auto; padding: 40px 24px 60px;
        }
        .profile-title {
          font-size: 28px; font-weight: 800; letter-spacing: 0.06em;
          text-transform: uppercase; margin-bottom: 32px;
        }
        .profile-name-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 22px;
        }

        @media (max-width: 640px) {
          .profile-wrapper { padding: 24px 16px 48px; }
          .profile-title   { font-size: 20px; margin-bottom: 24px; letter-spacing: 0.04em; }
          .profile-name-row { grid-template-columns: 1fr; gap: 16px; margin-bottom: 16px; }
          .save-btn { width: 100%; padding: 14px; font-size: 16px; }
          .toast { top: auto; bottom: 16px; right: 16px; left: 16px; max-width: unset; min-width: unset; }
        }
      `}</style>

      {toast.visible && (
        <div className={`toast ${toast.success ? 'toast-success' : 'toast-error'}`}>
          <span style={{ fontSize: '18px' }}>{toast.success ? '✅' : '❌'}</span>
          {toast.message}
        </div>
      )}

      <div style={{ fontFamily: font, background: '#fff', minHeight: '100vh', color: '#111' }}>
        <div className="profile-wrapper">

          <h1 className="profile-title">My Account</h1>

          {/* ── Tabs ── */}
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Details
            </button>
            <button
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              My Orders
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              TAB 1 — Profile Details  (your existing UI, unchanged)
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'profile' && (
            <>
              {/* First + Last name */}
              <div className="profile-name-row">
                <div>
                  <label style={lbl}>First name <span style={{ color: red }}>*</span></label>
                  <input
                    className="prof-inp" style={inp} autoComplete="off"
                    value={profile.name?.split(' ')[0] || ''}
                    onChange={(e) => {
                      const last = profile.name?.split(' ').slice(1).join(' ') || '';
                      setProfile({ ...profile, name: (e.target.value + ' ' + last).trim() });
                    }}
                  />
                </div>
                <div>
                  <label style={lbl}>Last name <span style={{ color: red }}>*</span></label>
                  <input
                    className="prof-inp" style={inp} autoComplete="off"
                    value={profile.name?.split(' ').slice(1).join(' ') || ''}
                    onChange={(e) => {
                      const first = profile.name?.split(' ')[0] || '';
                      setProfile({ ...profile, name: (first + ' ' + e.target.value).trim() });
                    }}
                  />
                </div>
              </div>

              <div style={fg}>
                <label style={lbl}>Display name <span style={{ color: red }}>*</span></label>
                <input
                  className="prof-inp" style={inp} autoComplete="off"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
                <p style={{ fontSize: '13px', color: '#777', fontStyle: 'italic', marginTop: '8px' }}>
                  This will be how your name will be displayed in the account section and in reviews
                </p>
              </div>

              <div style={fg}>
                <label style={lbl}>Email address <span style={{ color: red }}>*</span></label>
                <input className="prof-inp" style={inpDisabled} value={profile.email} disabled autoComplete="off" />
              </div>

              <div style={fg}>
                <label style={lbl}>Phone</label>
                <input
                  className="prof-inp" style={inp} autoComplete="off"
                  value={profile.phone || ''} placeholder="Enter phone number"
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111', margin: '36px 0 20px', letterSpacing: '0.02em' }}>
                Password change
              </h3>

              <div style={fg}>
                <label style={lbl}>Current password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="prof-inp" style={inpEye}
                    type={showPwd.current ? 'text' : 'password'} autoComplete="current-password"
                    placeholder="Enter current password" value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                  <button style={eyeBtn} onClick={() => togglePwd('current')}>
                    <EyeIcon open={showPwd.current} />
                  </button>
                </div>
              </div>

              <div style={fg}>
                <label style={lbl}>Change password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="prof-inp" style={inpEye}
                    type={showPwd.new ? 'text' : 'password'} autoComplete="new-password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                  <button style={eyeBtn} onClick={() => togglePwd('new')}>
                    <EyeIcon open={showPwd.new} />
                  </button>
                </div>
              </div>

              <div style={{ ...fg, marginBottom: '36px' }}>
                <label style={lbl}>Confirm new password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="prof-inp" style={inpEye}
                    type={showPwd.confirm ? 'text' : 'password'} autoComplete="new-password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                  <button style={eyeBtn} onClick={() => togglePwd('confirm')}>
                    <EyeIcon open={showPwd.confirm} />
                  </button>
                </div>
              </div>

              <button className="save-btn" onClick={handleSave}>Save changes</button>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB 2 — My Orders  (with review button + highlight logic)
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'orders' && (
            <OrdersTab
              reviewOrderId={reviewOrderId}
              reviewRowRef={reviewRowRef}
              onGiveReview={handleGiveReview}
            />
          )}

        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Orders Tab — fetches orders and renders each one with a "Give Review" button
// ─────────────────────────────────────────────────────────────────────────────
function OrdersTab({ reviewOrderId, reviewRowRef, onGiveReview }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(res => setOrders(res.data))
      .catch(err => console.error('Failed to fetch orders', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <p style={{ color: '#888', fontFamily: "'DM Sans', sans-serif" }}>Loading orders…</p>
  );

  if (!orders.length) return (
    <p style={{ color: '#888', fontFamily: "'DM Sans', sans-serif" }}>You have no orders yet.</p>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {orders.map(order => {
        const isHighlighted = order.id === reviewOrderId;
        const isDelivered   = order.status === 'DELIVERED';

        return (
          <div
            key={order.id}
            // ✅ Attach ref only to the order that came from the email link
            ref={isHighlighted ? reviewRowRef : null}
            className={isHighlighted ? 'order-row-highlight' : ''}
            style={{
              border: '1px solid #e5e7eb', borderRadius: '12px',
              padding: '20px 24px', background: '#fafafa',
              transition: 'border 0.3s, background 0.3s',
            }}
          >
            {/* Order header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>Order #{order.id}</span>
                <span style={{
                  marginLeft: '12px', fontSize: '12px', fontWeight: 600,
                  padding: '3px 10px', borderRadius: '20px',
                  background: isDelivered ? '#f0fdf4' : '#fef9ec',
                  color: isDelivered ? '#166534' : '#92400e',
                }}>
                  {order.status}
                </span>
              </div>
              <span style={{ fontSize: '13px', color: '#888' }}>
                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Items */}
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#444' }}>
                  <span>{item.product?.name} × {item.quantity} ({item.weight})</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Footer: total + review button */}
            <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontWeight: 700, fontSize: '15px' }}>
                Total: ₹{order.totalAmount?.toFixed(2)}
              </span>

              {/* ✅ "Give Review" button — only shown for DELIVERED orders */}
              {isDelivered && (
                <button
                  className="review-btn"
                  onClick={() => {
                    // If order has multiple items, open review for the first product.
                    // Adjust this if your review modal accepts orderId directly.
                    const firstProductId = order.items?.[0]?.product?.id;
                    onGiveReview(order.id, firstProductId);
                  }}
                >
                  ✍️ {isHighlighted ? 'Give Your Review →' : 'Give Review'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProfilePage;