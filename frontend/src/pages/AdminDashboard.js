import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

if (typeof document !== "undefined" && !document.getElementById("poppins-font")) {
  const link = document.createElement("link");
  link.id = "poppins-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap";
  document.head.appendChild(link);
}

const font = "'Poppins', sans-serif";
const green = "#6abf5e";
const dark = "#1f2937";
import { brand } from "../theme";
const red = brand;
const statusColors = {
  PLACED:    { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  CONFIRMED: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  PACKED:    { bg: '#fdf4ff', color: '#7e22ce', border: '#e9d5ff' },
  SHIPPED:   { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' },
  DELIVERED: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  CANCELLED: { bg: '#fef2f2', color: red,       border: '#fca5a5' },
  PENDING:   { bg: '#fff8e1', color: '#b45309', border: '#fde68a' },
};

const formFields = [
  { key: 'name',        label: 'Product Name',   type: 'text'   },
  { key: 'category',    label: 'Category',        type: 'text'   },
  { key: 'price',       label: 'Price (per 1kg)', type: 'number' },
  { key: 'stock',       label: 'Stock Quantity',  type: 'number' },
  { key: 'imageUrl',    label: 'Image URL',       type: 'text'   },
  { key: 'description', label: 'Description',     type: 'text'   },
  { key: 'ingredients', label: 'Ingredients',     type: 'text'   },
];

const SpiceDecor = () => (
  <svg width="100%" height="100%" viewBox="0 0 280 420" fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", top: 0, left: 0, opacity: 0.18, pointerEvents: "none" }}
    preserveAspectRatio="xMidYMid slice"
  >
    <ellipse cx="62" cy="118" rx="32" ry="16" stroke="#3a6a2a" strokeWidth="2.5" fill="none"/>
    <path d="M 30 118 Q 30 140 62 140 Q 94 140 94 118" stroke="#3a6a2a" strokeWidth="2.5" fill="none"/>
    <rect x="57" y="82" width="10" height="30" rx="5" stroke="#3a6a2a" strokeWidth="2.5" fill="none"/>
    <ellipse cx="62" cy="82" rx="7" ry="4" stroke="#3a6a2a" strokeWidth="2" fill="none"/>
    <circle cx="218" cy="68" r="6" stroke="#3a6a2a" strokeWidth="2" fill="none"/>
    <circle cx="218" cy="68" r="22" stroke="#3a6a2a" strokeWidth="1.5" strokeDasharray="3 3" fill="none"/>
    <line x1="218" y1="46" x2="218" y2="90" stroke="#3a6a2a" strokeWidth="2"/>
    <line x1="196" y1="68" x2="240" y2="68" stroke="#3a6a2a" strokeWidth="2"/>
    <line x1="202" y1="52" x2="234" y2="84" stroke="#3a6a2a" strokeWidth="2"/>
    <line x1="234" y1="52" x2="202" y2="84" stroke="#3a6a2a" strokeWidth="2"/>
    <path d="M 28 320 Q 48 275 68 292 Q 84 306 62 334 Q 48 350 28 320 Z" stroke="#3a6a2a" strokeWidth="2.5" fill="none"/>
    <path d="M 66 290 Q 74 268 88 260" stroke="#3a6a2a" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <circle cx="130" cy="38" r="5" fill="#dc2626" opacity="0.5"/>
    <circle cx="268" cy="198" r="5" fill="#dc2626" opacity="0.4"/>
    <path d="M 100 155 L 104 146 L 108 155 L 117 159 L 108 163 L 104 172 L 100 163 L 91 159 Z" fill="#3a6a2a" opacity="0.55"/>
  </svg>
);

const Badge = ({ label, bg, color, border }) => (
  <span style={{
    background: bg, color, border: `1px solid ${border}`,
    padding: "3px 12px", borderRadius: "999px",
    fontSize: "12px", fontWeight: 700, fontFamily: font,
  }}>
    {label}
  </span>
);

const pillInput = {
  width: "100%", padding: "10px 18px",
  background: "#f1f5f0", border: "1.5px solid transparent",
  borderRadius: "50px", fontSize: "13px", fontFamily: font,
  color: dark, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
};

// ── Star display (read-only) ──────────────────────────────────
const StarDisplay = ({ rating }) => (
  <span style={{ color: '#f59e0b', fontSize: '14px', letterSpacing: '1px' }}>
    {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
  </span>
);

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts]   = useState([]);
  const [orders, setOrders]       = useState([]);
  const [users, setUsers]         = useState([]);
  const [contacts, setContacts]   = useState([]);
  const [reviews, setReviews]     = useState([]);    // ✅ NEW
  const [selectedContact, setSelectedContact] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', stock: '',
    category: '', imageUrl: '', ingredients: '', bestSeller: false,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const adminName = localStorage.getItem('adminName');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) { navigate('/admin/login'); return; }
    fetchProducts(); fetchOrders(); fetchUsers(); fetchContacts(); fetchReviews();
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const fetchProducts = async () => {
    try { const res = await api.get('/products'); setProducts(res.data); } catch {}
  };
  const fetchOrders = async () => {
    try { const res = await api.get('/admin/orders'); setOrders(res.data); } catch {}
  };
  const fetchUsers = async () => {
    try { const res = await api.get('/admin/users'); setUsers(res.data); } catch {}
  };
  const fetchContacts = async () => {
    try { const res = await api.get('/contact'); setContacts(res.data); } catch {}
  };

  // ✅ NEW — fetch all reviews for admin
  const fetchReviews = async () => {
    try { const res = await api.get('/reviews/admin/all'); setReviews(res.data); } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('role');
    navigate('/admin/login');
  };

  const saveProduct = async () => {
    const { name, price, stock, category } = productForm;
    if (!name.trim() || !price || !stock || !category.trim()) {
      showMessage('❌ Please fill all required fields.', 'error'); return;
    }
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, productForm);
        showMessage('✅ Product updated successfully!');
      } else {
        await api.post('/admin/products', productForm);
        showMessage('✅ Product added successfully!');
      }
      setProductForm({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '', ingredients: '', bestSeller: false });
      setEditingProduct(null);
      fetchProducts();
    } catch { showMessage('❌ Failed to save product!', 'error'); }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name, description: product.description,
      price: product.price, stock: product.stock,
      category: product.category || '', imageUrl: product.imageUrl || '',
      ingredients: product.ingredients || '', bestSeller: product.bestSeller || false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      showMessage('✅ Product deleted!'); fetchProducts();
    } catch { showMessage('❌ Failed to delete!', 'error'); }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status?status=${status}`);
      showMessage('✅ Order status updated!'); fetchOrders();
    } catch { showMessage('❌ Failed to update order!', 'error'); }
  };

  // ✅ NEW — verify review
  const verifyReview = async (id) => {
    try {
      await api.put(`/reviews/admin/verify/${id}`);
      showMessage('✅ Review verified and now visible on website!');
      fetchReviews();
    } catch { showMessage('❌ Failed to verify review!', 'error'); }
  };

  // ✅ NEW — delete review
  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/admin/${id}`);
      showMessage('✅ Review deleted!');
      fetchReviews();
    } catch { showMessage('❌ Failed to delete review!', 'error'); }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const pendingReviewsCount = reviews.filter(r => !r.verified).length;

  const tabs = [
    { key: 'products', label: 'Products', count: products.length },
    { key: 'orders',   label: 'Orders',   count: orders.length   },
    { key: 'users',    label: 'Users',    count: users.length    },
    { key: 'contacts', label: 'Contacts', count: contacts.length },
    { key: 'reviews',  label: 'Reviews',  count: reviews.length, pending: pendingReviewsCount }, // ✅ NEW
  ];

  return (
    <div style={{ fontFamily: font, minHeight: '100vh', background: '#f3f4f6' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: red, padding: '0 40px', height: '72px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}>
        <SpiceDecor />
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '46px', height: '46px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: '11px', letterSpacing: '0.05em', fontFamily: font,
          }}>LOGO</div>
          <div>
            <p style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: '16px', fontFamily: font }}>Masala Store</p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: '12px', fontFamily: font }}>Admin Panel</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '34px', height: '34px', background: 'rgba(255,255,255,0.25)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', color: '#fff', fontWeight: 700, fontFamily: font,
            }}>{adminName?.charAt(0).toUpperCase()}</div>
            <span style={{ color: '#fff', fontSize: '14px', fontFamily: font, fontWeight: 600 }}>{adminName}</span>
          </div>
          <button onClick={handleLogout} style={{
            padding: '8px 22px', background: 'transparent', color: '#fff',
            border: "2px solid rgba(255,255,255,0.7)", borderRadius: '50px', fontFamily: font,
            fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor = '#fff'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'; }}
          >Logout</button>
        </div>
      </nav>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 40px', display: 'flex', gap: '4px' }}>
        {tabs.map(tab => (
          <button key={tab.key}
            onClick={() => { setActiveTab(tab.key); setMessage({ text: '', type: '' }); setSelectedContact(null); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '16px 20px', background: 'none', border: 'none',
              borderBottom: activeTab === tab.key ? `2px solid ${green}` : '2px solid transparent',
              color: activeTab === tab.key ? green : '#6b7280',
              fontFamily: font, fontSize: '14px',
              fontWeight: activeTab === tab.key ? 700 : 500,
              cursor: 'pointer', transition: 'all 0.15s', marginBottom: '-1px',
            }}
          >
            {tab.label}
            <span style={{
              background: activeTab === tab.key ? '#f0fdf4' : '#f3f4f6',
              color: activeTab === tab.key ? green : '#6b7280',
              fontSize: '11px', fontWeight: 700, padding: '2px 8px',
              borderRadius: '999px', fontFamily: font,
            }}>{tab.count}</span>
            {/* ✅ Red dot for pending reviews */}
            {tab.key === 'reviews' && tab.pending > 0 && (
              <span style={{
                background: red, color: '#fff',
                fontSize: '10px', fontWeight: 700,
                padding: '1px 7px', borderRadius: '999px', fontFamily: font,
              }}>{tab.pending} pending</span>
            )}
          </button>
        ))}
      </div>

      {/* Toast */}
      {message.text && (
        <div style={{
          margin: '16px 40px 0', padding: '12px 18px', borderRadius: '50px',
          fontFamily: font, fontSize: '13px', fontWeight: 600,
          background: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
          color: message.type === 'error' ? red : '#15803d',
          border: `1px solid ${message.type === 'error' ? '#fca5a5' : '#bbf7d0'}`,
        }}>{message.text}</div>
      )}

      <div style={{ padding: '32px 40px' }}>

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 24px', fontFamily: font, fontWeight: 800, fontSize: '18px', color: dark }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 24px', marginBottom: '24px' }}>
                {formFields.map(field => (
                  <div key={field.key}>
                    <label style={{ fontFamily: font, fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {field.label} <span style={{ color: red }}>*</span>
                    </label>
                    <input style={pillInput} type={field.type} value={productForm[field.key]}
                      onChange={e => setProductForm({ ...productForm, [field.key]: e.target.value })}
                      onFocus={e => e.target.style.borderColor = green}
                      onBlur={e => e.target.style.borderColor = 'transparent'}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <input type="checkbox" id="bestSeller" checked={productForm.bestSeller}
                  onChange={e => setProductForm({ ...productForm, bestSeller: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: green }}
                />
                <label htmlFor="bestSeller" style={{ fontFamily: font, fontSize: '13px', fontWeight: 600, color: dark, cursor: 'pointer' }}>
                  Mark as Best Seller ⭐
                </label>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={saveProduct} style={{
                  padding: '11px 32px', background: dark, color: '#fff',
                  border: 'none', borderRadius: '50px', fontFamily: font,
                  fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                  letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'background 0.2s',
                }}
                  onMouseOver={e => e.currentTarget.style.background = green}
                  onMouseOut={e => e.currentTarget.style.background = dark}
                >{editingProduct ? 'Update Product' : 'Add Product'}</button>
                {editingProduct && (
                  <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '', ingredients: '', bestSeller: false }); }}
                    style={{
                      padding: '11px 24px', background: 'transparent', color: dark,
                      border: '2px solid #d1d5db', borderRadius: '50px', fontFamily: font,
                      fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'border-color 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = dark}
                    onMouseOut={e => e.currentTarget.style.borderColor = '#d1d5db'}
                  >Cancel</button>
                )}
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontFamily: font, fontWeight: 800, fontSize: '18px', color: dark }}>All Products</h3>
                <Badge label={`${products.length} items`} bg="#f0fdf4" color={green} border="#bbf7d0" />
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                    {['Name', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: font, fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} style={{ borderBottom: '1px solid #f9fafb' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {product.imageUrl
                            ? <img src={product.imageUrl} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                            : <div style={{ width: '40px', height: '40px', background: '#f1f5f0', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🌶️</div>
                          }
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: font, fontSize: '14px', fontWeight: 600, color: dark }}>{product.name}</span>
                            {product.bestSeller && (
                              <span style={{ fontSize: '10px', fontWeight: 700, background: '#fefce8', color: '#854d0e', border: '1px solid #fde68a', borderRadius: '999px', padding: '2px 8px', fontFamily: font }}>⭐ Best Seller</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px', fontFamily: font, fontSize: '13px', color: '#6b7280' }}>{product.category || '—'}</td>
                      <td style={{ padding: '14px', fontFamily: font, fontSize: '14px', fontWeight: 700, color: dark }}>₹{product.price}</td>
                      <td style={{ padding: '14px' }}>
                        <Badge label={product.stock > 0 ? product.stock : 'Out of Stock'} bg={product.stock > 0 ? '#f0fdf4' : '#fef2f2'} color={product.stock > 0 ? '#15803d' : red} border={product.stock > 0 ? '#bbf7d0' : '#fca5a5'} />
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => editProduct(product)} style={{ padding: '6px 18px', background: 'transparent', color: dark, border: '2px solid #e5e7eb', borderRadius: '50px', fontFamily: font, fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                            onMouseOver={e => { e.currentTarget.style.borderColor = green; e.currentTarget.style.color = green; }}
                            onMouseOut={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = dark; }}
                          >Edit</button>
                          <button onClick={() => deleteProduct(product.id)} style={{ padding: '6px 18px', background: 'transparent', color: red, border: '2px solid #fca5a5', borderRadius: '50px', fontFamily: font, fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                            onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                          >Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontFamily: font, fontWeight: 800, fontSize: '18px', color: dark }}>All Orders</h3>
              <Badge label={`${orders.length} orders`} bg="#f0fdf4" color={green} border="#bbf7d0" />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                  {['Order ID', 'Customer', 'Amount', 'Payment', 'Status', 'Update'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: font, fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const s = statusColors[order.status] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' };
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid #f9fafb' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px', fontFamily: font, fontSize: '14px', fontWeight: 700, color: dark }}>#{order.id}</td>
                      <td style={{ padding: '14px', fontFamily: font, fontSize: '13px', color: '#374151', fontWeight: 500 }}>{order.user?.name || order.guestName || '—'}</td>
                      <td style={{ padding: '14px', fontFamily: font, fontSize: '14px', fontWeight: 700, color: dark }}>₹{order.totalAmount?.toFixed(2)}</td>
                      <td style={{ padding: '14px', fontFamily: font, fontSize: '13px', color: '#6b7280' }}>{order.paymentMethod}</td>
                      <td style={{ padding: '14px' }}><Badge label={order.status} bg={s.bg} color={s.color} border={s.border} /></td>
                      <td style={{ padding: '14px' }}>
                        <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)}
                          style={{ padding: '7px 16px', border: '1.5px solid #e5e7eb', borderRadius: '50px', fontFamily: font, fontSize: '12px', fontWeight: 600, color: dark, background: '#f1f5f0', cursor: 'pointer', outline: 'none', transition: 'border-color 0.2s' }}
                          onFocus={e => e.target.style.borderColor = green}
                          onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                        >
                          {['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontFamily: font, fontWeight: 800, fontSize: '18px', color: dark }}>All Users</h3>
              <Badge label={`${users.length} users`} bg="#f0fdf4" color={green} border="#bbf7d0" />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                  {['Name', 'Email', 'Phone', 'Role'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: font, fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f9fafb' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: user.role === 'ADMIN' ? red : dark, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: font, fontWeight: 700, fontSize: '13px' }}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontFamily: font, fontSize: '14px', fontWeight: 600, color: dark }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px', fontFamily: font, fontSize: '13px', color: '#6b7280' }}>{user.email}</td>
                    <td style={{ padding: '14px', fontFamily: font, fontSize: '13px', color: '#6b7280' }}>{user.phone || '—'}</td>
                    <td style={{ padding: '14px' }}>
                      <Badge label={user.role} bg={user.role === 'ADMIN' ? '#fef2f2' : '#f0fdf4'} color={user.role === 'ADMIN' ? red : '#15803d'} border={user.role === 'ADMIN' ? '#fca5a5' : '#bbf7d0'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CONTACTS TAB */}
        {activeTab === 'contacts' && (
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontFamily: font, fontWeight: 800, fontSize: '18px', color: dark }}>Contact Submissions</h3>
                <Badge label={`${contacts.length} messages`} bg="#f0fdf4" color={green} border="#bbf7d0" />
              </div>
              {contacts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontFamily: font, fontSize: '14px' }}>📭 No contact submissions yet.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                      {['#', 'Name', 'Email', 'Phone', 'Subject', 'Date', 'View'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: font, fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #f9fafb', background: selectedContact?.id === c.id ? '#f0fdf4' : 'transparent', cursor: 'pointer' }}
                        onMouseEnter={e => { if (selectedContact?.id !== c.id) e.currentTarget.style.background = '#f9fafb'; }}
                        onMouseLeave={e => { if (selectedContact?.id !== c.id) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <td style={{ padding: '14px', fontFamily: font, fontSize: '13px', color: '#9ca3af', fontWeight: 600 }}>#{c.id}</td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: dark, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: font, fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                              {c.name?.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontFamily: font, fontSize: '14px', fontWeight: 600, color: dark }}>{c.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px', fontFamily: font, fontSize: '13px', color: '#6b7280' }}>{c.email}</td>
                        <td style={{ padding: '14px', fontFamily: font, fontSize: '13px', color: '#6b7280' }}>{c.phone || '—'}</td>
                        <td style={{ padding: '14px', fontFamily: font, fontSize: '13px', color: '#374151', fontWeight: 500 }}>{c.subject || '—'}</td>
                        <td style={{ padding: '14px', fontFamily: font, fontSize: '12px', color: '#9ca3af' }}>{formatDate(c.createdAt)}</td>
                        <td style={{ padding: '14px' }}>
                          <button onClick={() => setSelectedContact(selectedContact?.id === c.id ? null : c)}
                            style={{ padding: '6px 18px', background: 'transparent', color: selectedContact?.id === c.id ? green : dark, border: `2px solid ${selectedContact?.id === c.id ? green : '#e5e7eb'}`, borderRadius: '50px', fontFamily: font, fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                            onMouseOver={e => { e.currentTarget.style.borderColor = green; e.currentTarget.style.color = green; }}
                            onMouseOut={e => { if (selectedContact?.id !== c.id) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = dark; } }}
                          >{selectedContact?.id === c.id ? 'Close' : 'View'}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {selectedContact && (
              <div style={{ width: '340px', flexShrink: 0, background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'sticky', top: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontFamily: font, fontWeight: 800, fontSize: '16px', color: dark }}>Message Details</h3>
                  <button onClick={() => setSelectedContact(null)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#6b7280' }}>✕</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: dark, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: font, fontWeight: 700, fontSize: '18px', flexShrink: 0 }}>
                    {selectedContact.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontFamily: font, fontWeight: 700, fontSize: '15px', color: dark }}>{selectedContact.name}</p>
                    <p style={{ margin: 0, fontFamily: font, fontSize: '12px', color: '#6b7280' }}>{formatDate(selectedContact.createdAt)}</p>
                  </div>
                </div>
                {[
                  { label: 'Email', value: selectedContact.email, icon: '✉️' },
                  { label: 'Phone', value: selectedContact.phone || '—', icon: '📞' },
                  { label: 'Subject', value: selectedContact.subject || '—', icon: '📌' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '14px', marginTop: '1px' }}>{row.icon}</span>
                    <div>
                      <p style={{ margin: 0, fontFamily: font, fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.label}</p>
                      <p style={{ margin: '2px 0 0', fontFamily: font, fontSize: '13px', color: dark, fontWeight: 500, wordBreak: 'break-all' }}>{row.value}</p>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '16px' }}>
                  <p style={{ margin: '0 0 8px', fontFamily: font, fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>💬 Message</p>
                  <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '14px', fontFamily: font, fontSize: '13px', color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap', border: '1px solid #f3f4f6' }}>
                    {selectedContact.message}
                  </div>
                </div>
                <a href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Your Message'}`}
                  style={{ display: 'block', marginTop: '20px', textAlign: 'center', padding: '11px 0', background: dark, color: '#fff', borderRadius: '50px', fontFamily: font, fontSize: '13px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.04em', transition: 'background 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = green}
                  onMouseOut={e => e.currentTarget.style.background = dark}
                >✉️ Reply via Email</a>
              </div>
            )}
          </div>
        )}

        {/* ✅ REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: font, fontWeight: 800, fontSize: '18px', color: dark }}>Customer Reviews</h3>
                <p style={{ margin: '4px 0 0', fontFamily: font, fontSize: '13px', color: '#6b7280' }}>
                  Verify reviews before they appear on the website
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Badge label={`${reviews.filter(r => !r.verified).length} pending`} bg="#fff7ed" color="#c2410c" border="#fed7aa" />
                <Badge label={`${reviews.filter(r => r.verified).length} verified`} bg="#f0fdf4" color="#15803d" border="#bbf7d0" />
              </div>
            </div>

            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontFamily: font, fontSize: '14px' }}>
                ⭐ No reviews submitted yet.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                    {['#', 'Customer', 'Rating', 'Review', 'Date', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: font, fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id}
                      style={{ borderBottom: '1px solid #f9fafb', background: review.verified ? 'transparent' : '#fffbeb' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = review.verified ? 'transparent' : '#fffbeb'}
                    >
                      <td style={{ padding: '14px', fontFamily: font, fontSize: '13px', color: '#9ca3af', fontWeight: 600 }}>#{review.id}</td>

                      {/* Customer */}
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: dark, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: font, fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                            {review.reviewerName?.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontFamily: font, fontSize: '13px', fontWeight: 600, color: dark }}>{review.reviewerName}</span>
                        </div>
                      </td>

                      {/* Rating */}
                      <td style={{ padding: '14px' }}>
                        <StarDisplay rating={review.rating} />
                        <p style={{ margin: '2px 0 0', fontFamily: font, fontSize: '11px', color: '#9ca3af' }}>{review.rating}/5</p>
                      </td>

                      {/* Comment */}
                      <td style={{ padding: '14px', maxWidth: '260px' }}>
                        <p style={{ margin: 0, fontFamily: font, fontSize: '13px', color: '#374151', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {review.comment}
                        </p>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '14px', fontFamily: font, fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                        {formatDate(review.createdAt)}
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: '14px' }}>
                        {review.verified
                          ? <Badge label="✓ Verified" bg="#f0fdf4" color="#15803d" border="#bbf7d0" />
                          : <Badge label="⏳ Pending" bg="#fff7ed" color="#c2410c" border="#fed7aa" />
                        }
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {!review.verified && (
                            <button onClick={() => verifyReview(review.id)}
                              style={{ padding: '6px 16px', background: '#f0fdf4', color: '#15803d', border: '2px solid #bbf7d0', borderRadius: '50px', fontFamily: font, fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                              onMouseOver={e => { e.currentTarget.style.background = '#15803d'; e.currentTarget.style.color = '#fff'; }}
                              onMouseOut={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#15803d'; }}
                            >✓ Verify</button>
                          )}
                          <button onClick={() => deleteReview(review.id)}
                            style={{ padding: '6px 16px', background: 'transparent', color: red, border: '2px solid #fca5a5', borderRadius: '50px', fontFamily: font, fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                            onMouseOver={e => { e.currentTarget.style.background = '#fef2f2'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                          >Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;