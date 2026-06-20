// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [toast, setToast] = useState({ visible: false, message: '', success: true });

  useEffect(() => { fetchProfile(); }, []);

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

        </div>
      </div>
    </>
  );
}

export default ProfilePage;