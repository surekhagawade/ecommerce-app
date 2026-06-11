import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // State Management
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  // Authentication Form State
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

  // 1. Fetch Products on Component Mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error loading products:", err));
  }, []);

  // 2. Authentication Handler (Signup & Login Flow)
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const url = isLoginView 
      ? 'http://localhost:5000/api/auth/login' 
      : 'http://localhost:5000/api/auth/signup';

    try {
      const res = await axios.post(url, authForm);
      if (isLoginView) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        setShowAuthModal(false);
        alert("Login successful!");
      } else {
        alert("Registration successful! Please login now.");
        setIsLoginView(true);
      }
      setAuthForm({ name: '', email: '', password: '' });
    } catch (err) {
      alert(err.response?.data?.message || "An authentication error occurred.");
    }
  };

  // 3. Protected Route Purchase Action
  const handlePurchase = async (product) => {
    if (!user) {
      alert("Authentication required. Please log in to complete your purchase.");
      setIsLoginView(true);
      setShowAuthModal(true);
      return;
    }

    try {
      const config = { headers: { Authorization: token } };
      const purchaseData = {
        productId: product._id,
        quantity: 1,
        totalPrice: product.price
      };

      await axios.post('http://localhost:5000/api/purchase', purchaseData, config);
      alert(`Success! Your order for the "${product.title}" has been placed.`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to process the transaction.");
    }
  };

  // 4. Logout Handler
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setToken('');
    alert("You have been successfully logged out.");
  };
  return (
    <div style={{ fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', padding: '0', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* PROFESSIONAL NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', color: '#fff', padding: '16px 48px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>⚡ E-Commerce Platform</h2>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <span style={{ fontSize: '15px', color: '#94a3b8' }}>Welcome, <b style={{ color: '#38bdf8' }}>{user.name}</b></span>
              <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', transition: '0.2s', boxShadow: '0 2px 4px rgba(239,68,68,0.2)' }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => { setIsLoginView(true); setShowAuthModal(true); }} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', transition: '0.2s', boxShadow: '0 4px 6px rgba(37,99,235,0.2)' }}>Sign In / Sign Up</button>
          )}
        </div>
      </nav>

      {/* MAIN LAYOUT CONTAINER */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <h3 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '32px', fontWeight: '700', letterSpacing: '-0.5px' }}>Explore Products</h3>
        
        {/* PRODUCT GRID SECTION */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
          {products.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', backgroundColor: '#fff', padding: '40px', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <p style={{ color: '#64748b', fontSize: '16px', margin: '0' }}>No products found in the database inventory. Please execute a backend POST request to insert data.</p>
            </div>
          ) : (
            products.map(product => (
              <div key={product._id} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
                <div>
                  <div style={{ backgroundColor: '#f1f5f9', borderRadius: '12px', padding: '12px', marginBottom: '16px', textAlign: 'center' }}>
                    <img src="https://unsplash.com" alt={product.title} style={{ width: '100%', height: '180px', objectFit: 'contain' }} />
                  </div>
                  <h4 style={{ fontSize: '19px', color: '#0f172a', margin: '12px 0 6px 0', fontWeight: '600' }}>{product.title}</h4>
                  <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 20px 0', lineHeight: '1.6' }}>{product.description}</p>
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: '20px' }}>
                    <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>₹{product.price.toLocaleString()}</span>
                    <span style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', backgroundColor: product.stock > 0 ? '#dcfce7' : '#fee2e2', color: product.stock > 0 ? '#16a34a' : '#dc2626' }}>
                      Stock: {product.stock}
                    </span>
                  </div>
                  <button onClick={() => handlePurchase(product)} style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', boxShadow: '0 4px 6px rgba(16,185,129,0.2)', transition: 'background-color 0.2s' }}>
                    🛒 Buy Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AUTHENTICATION POP-UP OVERLAY */}
      {showAuthModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', width: '350px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <span onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', top: '16px', right: '24px', cursor: 'pointer', fontSize: '26px', fontWeight: '300', color: '#94a3b8' }}>&times;</span>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '22px', fontWeight: '700', color: '#0f172a', textAlign: 'center', letterSpacing: '-0.5px' }}>
              {isLoginView ? '🔒 Sign In to Account' : '📝 Create New Account'}
            </h3>
            
            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!isLoginView && (
                <input type="text" placeholder="Full Name" required value={authForm.name} onChange={(e) => setAuthForm({...authForm, name: e.target.value})} style={{ padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
              )}
              <input type="email" placeholder="Email Address" required value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} style={{ padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
              <input type="password" placeholder="Password" required value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} style={{ padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
              <button type="submit" style={{ padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', marginTop: '8px', boxShadow: '0 4px 6px rgba(37,99,235,0.2)' }}>
                {isLoginView ? 'Sign In' : 'Register Account'}
              </button>
            </form>
            
            <p style={{ marginTop: '24px', fontSize: '14px', textAlign: 'center', color: '#64748b', margin: '24px 0 0 0' }}>
              {isLoginView ? "Don't have an account?" : "Already registered?"} {' '}
              <span onClick={() => setIsLoginView(!isLoginView)} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}>
                {isLoginView ? 'Sign Up' : 'Log In'}
              </span>
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
