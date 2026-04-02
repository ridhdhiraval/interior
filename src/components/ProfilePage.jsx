import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage({ onClose }) {
  const navigate = useNavigate();
  return (
    <div className="profile-overlay">
      <div className="profile-card">
        <button className="close-button" onClick={onClose} title="Close Profile">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="profile-header">
           <div className="cover-photo"></div>
           <div className="avatar-wrapper">
              <img className="avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80" alt="User Avatar" />
              <div className="status-indicator" title="Online"></div>
           </div>
        </div>
        
        <div className="profile-info">
           <h2>Sarah Jenkins</h2>
           <p className="role">Pro Interior Designer ✨</p>
           
           <div className="stats-container">
             <div className="stat-box">
                <span className="stat-value">42</span>
                <span className="stat-label">Projects</span>
             </div>
             <div className="stat-box">
                <span className="stat-value">318</span>
                <span className="stat-label">Renders</span>
             </div>
             <div className="stat-box">
                <span className="stat-value">25</span>
                <span className="stat-label">Saved Items</span>
             </div>
           </div>
           
           <div className="details-section">
              <div className="detail-item">
                 <div className="icon">📧</div>
                 <div className="detail-content">
                    <span className="detail-title">Email Address</span>
                    <span className="detail-value">sarah.j@iconicinteriors.com</span>
                 </div>
              </div>
              <div className="detail-item">
                 <div className="icon">📱</div>
                 <div className="detail-content">
                    <span className="detail-title">Phone Number</span>
                    <span className="detail-value">+1 (555) 123-4567</span>
                 </div>
              </div>
              <div className="detail-item">
                 <div className="icon">📍</div>
                 <div className="detail-content">
                    <span className="detail-title">Location</span>
                    <span className="detail-value">San Francisco, CA</span>
                 </div>
              </div>
              <div className="detail-item">
                 <div className="icon">📅</div>
                 <div className="detail-content">
                    <span className="detail-title">Member Since</span>
                    <span className="detail-value">October 2023</span>
                 </div>
              </div>
           </div>
           
           <div className="action-buttons">
             <button className="btn-primary" onClick={() => navigate('/settings')}>Edit Profile</button>
             <button className="btn-secondary" onClick={() => { onClose?.(); navigate('/settings'); }}>Settings</button>
           </div>
        </div>
      </div>

      <style>{`
        .profile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(5px); }
        }

        .profile-card {
          width: 100%;
          max-width: 600px;
          background: #ffffff;
          border-radius: 20px;
          position: relative;
          box-shadow: 0 24px 48px rgba(0,0,0,0.2);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .close-button {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        }

        .close-button:hover {
          background: rgba(0, 0, 0, 0.4);
          transform: scale(1.1) rotate(90deg);
        }

        .profile-header {
          position: relative;
          height: 140px;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          overflow: hidden;
        }

        .cover-photo {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1D2B64 0%, #F8CDDA 100%);
        }

        .avatar-wrapper {
          position: absolute;
          bottom: -45px;
          left: 30px;
          z-index: 2;
        }

        .avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 4px solid #fff;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: transform 0.3s ease;
        }

        .avatar:hover {
          transform: scale(1.05);
        }

        .status-indicator {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 16px;
          height: 16px;
          background: #2ecc71;
          border-radius: 50%;
          border: 3px solid #fff;
        }

        .profile-info {
          padding: 55px 30px 30px;
        }

        .profile-info h2 {
          margin: 0;
          font-size: 24px;
          color: #2c3e50;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .profile-info .role {
          margin: 4px 0 24px;
          color: #e67e22;
          font-weight: 600;
          font-size: 13.5px;
        }

        .stats-container {
          display: flex;
          justify-content: space-between;
          background: #f8f9fa;
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 24px;
          border: 1px solid #edf2f7;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .stats-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 800;
          color: #2c3e50;
        }

        .stat-label {
          font-size: 12px;
          color: #7f8c8d;
          margin-top: 2px;
          font-weight: 500;
        }

        .details-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 30px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 10px;
          border-radius: 12px;
          transition: background 0.2s ease;
        }

        .detail-item:hover {
          background: #f8f9fa;
        }

        .detail-item .icon {
          width: 42px;
          height: 42px;
          background: #f1f2f6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #2874a6;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .detail-content {
          display: flex;
          flex-direction: column;
        }

        .detail-title {
          font-size: 12px;
          color: #95a5a6;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }

        .detail-value {
          font-size: 14px;
          color: #34495e;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .btn-primary, .btn-secondary {
          flex: 1;
          padding: 12px 0;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          border: none;
          letter-spacing: 0.5px;
        }

        .btn-primary {
          background: #2874a6;
          color: white;
          box-shadow: 0 4px 15px rgba(40, 116, 166, 0.3);
        }

        .btn-primary:hover {
          background: #1f618d;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(40, 116, 166, 0.4);
        }

        .btn-secondary {
          background: #ecf0f1;
          color: #2c3e50;
        }

        .btn-secondary:hover {
          background: #bdc3c7;
          transform: translateY(-3px);
          box-shadow: 0 8px 15px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}
