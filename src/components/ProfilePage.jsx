import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If the URL is still /settings, redirect to /my-profile
    if (window.location.pathname === '/settings') {
      navigate('/my-profile', { replace: true });
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      console.log('Initial user from localStorage:', parsed);
      setUser(parsed);
      fetchUserProfile(); // Fetch full profile including created_at
      fetchDesigns();
    } else {
      navigate('/signin');
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/auth/me', {
        headers: { 'x-auth-token': token }
      });
      // console.log('User profile fetched from DB response:', res.data);
      setUser(res.data);
      // Update local storage with the full user info
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      // console.error('Failed to fetch user profile error:', err.response?.data || err.message);
    }
  };

  const fetchDesigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/designs', {
        headers: { 'x-auth-token': token }
      });
      setDesigns(res.data);
    } catch (err) {
      console.error('Failed to fetch designs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <style>{`
        .profile-container {
          padding: 100px 40px 40px;
          background: #f8f9fa;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .stat-info h3 {
          margin: 0;
          font-size: 13px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-info .value {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin-top: 4px;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 30px;
        }

        .left-panel {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .user-card {
          background: white;
          padding: 40px 30px;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          background: #1a1a1a;
          color: white;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          font-weight: 700;
          margin: 0 auto 20px;
          position: relative;
        }

        .online-dot {
          width: 16px;
          height: 16px;
          background: #22c55e;
          border: 3px solid white;
          border-radius: 50%;
          position: absolute;
          bottom: 0;
          right: 0;
        }

        .user-card h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
        }

        .user-card p {
          margin: 4px 0 24px;
          color: #64748b;
          font-size: 14px;
        }

        .user-detail {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
        }

        .detail-label { color: #64748b; }
        .detail-value { font-weight: 600; color: #0f172a; }
        .detail-value.active { color: #22c55e; }

        .btn-logout {
          width: 100%;
          margin-top: 24px;
          padding: 12px;
          background: white;
          border: 1px solid #fecaca;
          color: #ef4444;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-logout:hover {
          background: #fef2f2;
        }

        .security-card {
          background: white;
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .security-card h4 { margin: 0 0 12px; color: #0f172a; font-size: 15px; }
        .security-msg { display: flex; gap: 12px; color: #64748b; font-size: 13px; line-height: 1.5; }

        .showcase-panel {
          background: white;
          padding: 30px;
          border-radius: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .showcase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .showcase-title h3 { margin: 0; font-size: 20px; font-weight: 700; color: #0f172a; }
        .showcase-title p { margin: 4px 0 0; color: #64748b; font-size: 14px; }
        .item-count { background: #f1f5f9; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; color: #64748b; }

        .design-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .design-card {
          border-radius: 20px;
          overflow: hidden;
          background: #f8fafc;
          transition: transform 0.2s;
        }

        .design-card:hover { transform: translateY(-4px); }

        .design-img {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
          position: relative;
        }

        .design-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255,255,255,0.9);
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .design-info { padding: 16px; }
        .design-date { color: #64748b; font-size: 12px; }
        .design-date span { display: block; font-weight: 600; color: #0f172a; font-size: 13px; margin-top: 2px; }

        @media (max-width: 1024px) {
          .main-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>🖼️</div>
          <div className="stat-info">
            <h3>Total Designs</h3>
            <div className="value">{designs.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>🛡️</div>
          <div className="stat-info">
            <h3>Plan Status</h3>
            <div className="value">{user.plan || (user.role === 'admin' ? 'ADMIN' : 'FREE')}</div>
          </div>
        </div>
        {user.plan === 'FREE' ? (
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fff7ed', color: '#f97316' }}>💳</div>
            <div className="stat-info">
              <h3>Credits (AI / Manual)</h3>
              <div className="value">{user.ai_credits} / {user.manual_credits}</div>
            </div>
          </div>
        ) : (
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fdf2f8', color: '#ec4899' }}>📅</div>
            <div className="stat-info">
              <h3>Member Since</h3>
              <div className="value">
                {user.created_at 
                  ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
                  : 'Loading...'}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="main-grid">
        <div className="left-panel">
          <div className="user-card">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
              <div className="online-dot"></div>
            </div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            
            <div className="user-detail">
              <span className="detail-label">Status</span>
              <span className="detail-value active">Active</span>
            </div>
            <div className="user-detail">
              <span className="detail-label">User ID</span>
              <span className="detail-value">#{String(user.id).padStart(4, '0')}</span>
            </div>

            <button onClick={handleLogout} className="btn-logout">Logout Account</button>
          </div>

          <div className="security-card">
            <h4>Security Tips</h4>
            <div className="security-msg">
              <span>⚠️</span>
              <span>Keep your account secure by using a strong password and signing out from shared devices.</span>
            </div>
          </div>
        </div>

        <div className="showcase-panel">
          <div className="showcase-header">
            <div className="showcase-title">
              <h3>Design Showcase</h3>
              <p>Your personal collection of AI-crafted interior spaces.</p>
            </div>
            <span className="item-count">{designs.length} Items</span>
          </div>

          <div className="design-grid">
            {loading ? (
              <p>Loading designs...</p>
            ) : designs.length === 0 ? (
              <p>No designs yet. Start creating!</p>
            ) : (
              designs.map(d => (
                <div key={d.id} className="design-card">
                  <div className="design-img-wrapper" style={{ position: 'relative' }}>
                    <img src={d.thumbnail_url || "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80"} className="design-img" alt={d.name} />
                    <span className="design-tag">{d.name}</span>
                  </div>
                  <div className="design-info">
                    <div className="design-date">
                      Created on
                      <span>
                        {d.created_at && !isNaN(new Date(d.created_at).getTime()) 
                          ? new Date(d.created_at).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }) 
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
