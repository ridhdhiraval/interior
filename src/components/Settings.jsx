import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.j@iconicinteriors.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    role: 'Pro Interior Designer ✨',
    bio: 'Passionate interior designer with 5+ years of experience creating beautiful spaces.'
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    projectReminders: true,
    marketingEmails: false,
    pushNotifications: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    dataSharing: false
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'en',
    units: 'metric'
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrivacy(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAppearanceChange = (e) => {
    const { name, value } = e.target;
    setAppearance(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert('Settings updated successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'account', label: 'Account', icon: '🔐' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'subscription', label: 'Subscription', icon: '💳' }
  ];

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Settings</h1>
          <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        </div>

        <div className="settings-content">
          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="settings-panel">
            {activeTab === 'profile' && (
              <div className="settings-section">
                <h2>Profile Information</h2>
                <form className="profile-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Professional Role</label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={profile.role}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={profile.location}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profile.bio}
                      onChange={handleProfileChange}
                      rows="3"
                    />
                  </div>
                  <button type="button" className="btn-primary" onClick={handleSave}>Save Profile</button>
                </form>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="settings-section">
                <h2>Account Settings</h2>
                <div className="account-info">
                  <div className="info-item">
                    <span className="info-label">Account Type:</span>
                    <span className="info-value">Pro Interior Designer</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Member Since:</span>
                    <span className="info-value">October 2023</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Login:</span>
                    <span className="info-value">Today</span>
                  </div>
                </div>
                <div className="account-actions">
                  <button className="btn-secondary">Change Password</button>
                  <button className="btn-danger">Delete Account</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h2>Notification Preferences</h2>
                <div className="notification-settings">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Email Updates</h3>
                      <p>Receive updates about your projects and account</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="emailUpdates"
                        checked={notifications.emailUpdates}
                        onChange={handleNotificationChange}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Project Reminders</h3>
                      <p>Get reminded about upcoming deadlines</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="projectReminders"
                        checked={notifications.projectReminders}
                        onChange={handleNotificationChange}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Marketing Emails</h3>
                      <p>Receive promotional content and offers</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="marketingEmails"
                        checked={notifications.marketingEmails}
                        onChange={handleNotificationChange}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Push Notifications</h3>
                      <p>Receive push notifications on your device</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        checked={notifications.pushNotifications}
                        onChange={handleNotificationChange}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                <button className="btn-primary" onClick={handleSave}>Save Preferences</button>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="settings-section">
                <h2>Privacy Settings</h2>
                <div className="privacy-settings">
                  <div className="form-group">
                    <label htmlFor="profileVisibility">Profile Visibility</label>
                    <select
                      id="profileVisibility"
                      name="profileVisibility"
                      value={privacy.profileVisibility}
                      onChange={handlePrivacyChange}
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Show Email Address</h3>
                      <p>Display your email on your public profile</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="showEmail"
                        checked={privacy.showEmail}
                        onChange={handlePrivacyChange}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Show Phone Number</h3>
                      <p>Display your phone number on your public profile</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="showPhone"
                        checked={privacy.showPhone}
                        onChange={handlePrivacyChange}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Data Sharing</h3>
                      <p>Allow sharing of usage data for improvements</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="dataSharing"
                        checked={privacy.dataSharing}
                        onChange={handlePrivacyChange}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                <button className="btn-primary" onClick={handleSave}>Save Privacy Settings</button>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="settings-section">
                <h2>Appearance</h2>
                <div className="appearance-settings">
                  <div className="form-group">
                    <label htmlFor="theme">Theme</label>
                    <select
                      id="theme"
                      name="theme"
                      value={appearance.theme}
                      onChange={handleAppearanceChange}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="language">Language</label>
                    <select
                      id="language"
                      name="language"
                      value={appearance.language}
                      onChange={handleAppearanceChange}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="units">Measurement Units</label>
                    <select
                      id="units"
                      name="units"
                      value={appearance.units}
                      onChange={handleAppearanceChange}
                    >
                      <option value="metric">Metric (cm, m)</option>
                      <option value="imperial">Imperial (in, ft)</option>
                    </select>
                  </div>
                </div>
                <button className="btn-primary" onClick={handleSave}>Save Appearance</button>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="settings-section">
                <h2>Subscription & Billing</h2>
                <div className="subscription-info">
                  <div className="subscription-card">
                    <h3>Current Plan</h3>
                    <div className="plan-details">
                      <span className="plan-name">Pro Interior Designer</span>
                      <span className="plan-price">$29.99/month</span>
                    </div>
                    <p className="plan-features">
                      ✓ Unlimited projects<br/>
                      ✓ Advanced AI tools<br/>
                      ✓ Priority support<br/>
                      ✓ Commercial license
                    </p>
                  </div>
                  <div className="billing-info">
                    <h3>Billing Information</h3>
                    <div className="info-item">
                      <span className="info-label">Next Billing Date:</span>
                      <span className="info-value">April 15, 2026</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Payment Method:</span>
                      <span className="info-value">**** **** **** 1234</span>
                    </div>
                  </div>
                </div>
                <div className="subscription-actions">
                  <button className="btn-secondary">Update Payment Method</button>
                  <button className="btn-secondary">View Billing History</button>
                  <button className="btn-outline">Cancel Subscription</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .settings-page {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 100px 20px 40px; /* top padding so header doesn't cut content */
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .settings-container {
          max-width: 1100px;
          width: 100%;
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .settings-header h1 {
          color: #2c3e50;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }

        .back-button {
          background: #ecf0f1;
          border: none;
          color: #2c3e50;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s;
        }

        .back-button:hover {
          background: #bdc3c7;
        }

        .settings-content {
          display: flex;
          gap: 30px;
        }

        .settings-tabs {
          width: 200px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: none;
          border: none;
          border-radius: 10px;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
          color: #7f8c8d;
        }

        .tab-button:hover {
          background: #f8f9fa;
          color: #2c3e50;
        }

        .tab-button.active {
          background: #2874a6;
          color: white;
        }

        .tab-icon {
          font-size: 16px;
        }

        .settings-panel {
          flex: 1;
          min-height: 500px;
        }

        .settings-section h2 {
          margin-bottom: 20px;
          color: #34495e;
          font-size: 20px;
          font-weight: 600;
        }

        .profile-form, .appearance-settings, .privacy-settings {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 5px;
          font-weight: 600;
          color: #2c3e50;
        }

        .form-group input, .form-group select, .form-group textarea {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none;
          border-color: #2874a6;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .account-info, .billing-info {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .info-item:last-child {
          margin-bottom: 0;
        }

        .info-label {
          font-weight: 600;
          color: #2c3e50;
        }

        .info-value {
          color: #34495e;
        }

        .account-actions, .subscription-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .notification-settings, .privacy-settings {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #edf2f7;
        }

        .setting-info h3 {
          margin: 0 0 4px 0;
          color: #2c3e50;
          font-size: 16px;
          font-weight: 600;
        }

        .setting-info p {
          margin: 0;
          color: #7f8c8d;
          font-size: 14px;
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #2874a6;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .subscription-info {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }

        .subscription-card {
          flex: 1;
          background: linear-gradient(135deg, #2874a6 0%, #1f618d 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
        }

        .subscription-card h3 {
          margin: 0 0 15px 0;
          font-size: 18px;
        }

        .plan-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .plan-name {
          font-size: 16px;
          font-weight: 600;
        }

        .plan-price {
          font-size: 18px;
          font-weight: 700;
        }

        .plan-features {
          font-size: 14px;
          line-height: 1.5;
        }

        .btn-primary, .btn-secondary, .btn-danger, .btn-outline {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
        }

        .btn-primary {
          background: #2874a6;
          color: white;
        }

        .btn-primary:hover {
          background: #1f618d;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #ecf0f1;
          color: #2c3e50;
        }

        .btn-secondary:hover {
          background: #bdc3c7;
        }

        .btn-danger {
          background: #e74c3c;
          color: white;
        }

        .btn-danger:hover {
          background: #c0392b;
        }

        .btn-outline {
          background: transparent;
          color: #e74c3c;
          border: 1px solid #e74c3c;
        }

        .btn-outline:hover {
          background: #e74c3c;
          color: white;
        }

        @media (max-width: 768px) {
          .settings-content {
            flex-direction: column;
          }

          .settings-tabs {
            width: 100%;
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 10px;
          }

          .tab-button {
            flex-shrink: 0;
            white-space: nowrap;
          }

          .subscription-info {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}