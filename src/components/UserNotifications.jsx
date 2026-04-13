import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function UserNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/signin');
      return;
    }
    fetchNotifications();
    markAllAsRead();
  }, []);

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5001/api/notifications/read-all', {}, {
        headers: { 'x-auth-token': token }
      });
      // After marking as read, notify the navbar to update
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  };

  const fetchNotifications = async () => {
    console.log('Fetching notifications...');
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Exists' : 'Missing');
      const res = await axios.get('http://localhost:5001/api/notifications', {
        headers: { 'x-auth-token': token }
      });
      console.log('Notifications received:', res.data);
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notif-page">
      <style>{`
        .notif-page {
          padding: 120px 40px 40px;
          background: #f8f9fa;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .notif-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .notif-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .notif-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .back-link {
          color: #22c55e;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .notif-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .notif-item {
          background: white;
          padding: 30px 40px;
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          border: 1px solid #f1f5f9;
        }

        .notif-msg {
          font-size: 16px;
          color: #334155;
          margin-bottom: 12px;
          display: block;
        }

        .notif-date {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 13px;
        }

        .empty-state {
          text-align: center;
          padding: 60px;
          color: #64748b;
        }
      `}</style>

      <div className="notif-container">
        <div className="notif-header">
          <h2>Notifications</h2>
          <Link to="/my-profile" className="back-link">← Back to Profile</Link>
        </div>

        <div className="notif-list">
          {loading ? (
            <p>Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <div className="empty-state">No notifications yet.</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className="notif-item">
                <span className="notif-msg">{n.message}</span>
                <div className="notif-date">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {new Date(n.created_at).toLocaleString('en-US', { 
                    month: 'short', 
                    day: '2-digit', 
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
