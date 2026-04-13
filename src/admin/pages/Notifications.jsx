import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifyData, setNotifyData] = useState({ userId: 'all', text: '' })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [notifRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5001/api/admin/notifications', {
          headers: { 'x-auth-token': token }
        }),
        axios.get('http://localhost:5001/api/admin/users', {
          headers: { 'x-auth-token': token }
        })
      ])
      setNotifications(notifRes.data)
      setUsers(usersRes.data)
    } catch (err) {
      console.error('Failed to fetch notifications', err)
    } finally {
      setLoading(false)
    }
  }

  const markRead = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:5001/api/admin/notifications/${id}`, {}, {
        headers: { 'x-auth-token': token }
      })
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch (err) {
      alert('Failed to update notification')
    }
  }

  const handleNotify = async () => {
    if (!notifyData.text) return
    setSending(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:5001/api/admin/notify-user', notifyData, {
        headers: { 'x-auth-token': token }
      })
      alert('Notification sent to user(s)!')
      setNotifyData({ ...notifyData, text: '' })
    } catch (err) {
      alert('Failed to send notification')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Notifications...</div>

  return (
    <div className="admin-notifications">
      <style>{`
        .notif-card { background: #ffffff; border: 1px solid rgba(0,40,80,0.1); border-radius: 20px; padding: 24px; box-shadow: 0 4px 12px rgba(11,42,74,0.05); margin-bottom: 24px; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .card-header h3 { margin: 0; font-size: 18px; font-weight: 700; color: #0f172a; }
        
        .notify-form { display: grid; grid-template-columns: 200px 1fr 120px; gap: 12px; margin-bottom: 30px; }
        .notify-form select, .notify-form input { 
          padding: 10px 14px; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 14px; outline: none; 
        }
        .btn-notify { background: #0b2a4a; color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; }
        
        .notif-list { display: grid; gap: 12px; }
        .notif-item { 
          display: flex; justify-content: space-between; align-items: center; 
          padding: 16px 20px; border-radius: 14px; border: 1px solid #f1f5f9; background: #fff;
          transition: transform 0.2s;
        }
        .notif-item.unread { border-left: 4px solid #0b2a4a; background: #f8fbff; }
        .notif-content { flex: 1; }
        .notif-msg { display: block; font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 4px; }
        .notif-time { font-size: 12px; color: #94a3b8; }
        
        .btn-read { 
          background: #f1f5f9; color: #64748b; border: none; padding: 6px 14px; border-radius: 8px; 
          font-size: 12px; font-weight: 600; cursor: pointer; 
        }
        .btn-read:hover { background: #e2e8f0; }
        
        .badge-new { 
          background: #eff6ff; color: #2563eb; font-size: 10px; font-weight: 700; 
          padding: 2px 6px; border-radius: 4px; margin-right: 8px; vertical-align: middle;
        }
      `}</style>

      <div className="notif-card">
        <div className="card-header">
          <h3>Send Notification</h3>
        </div>
        <div className="notify-form">
          <select 
            value={notifyData.userId} 
            onChange={e => setNotifyData({...notifyData, userId: e.target.value})}
          >
            <option value="all">All Users</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="Type notification message here..." 
            value={notifyData.text}
            onChange={e => setNotifyData({...notifyData, text: e.target.value})}
          />
          <button className="btn-notify" onClick={handleNotify} disabled={sending}>
            {sending ? 'Sending...' : 'Notify'}
          </button>
        </div>

        <div className="card-header">
          <h3>Recent Admin Alerts</h3>
        </div>
        <div className="notif-list">
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No notifications found</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`notif-item ${!n.is_read ? 'unread' : ''}`}>
                <div className="notif-content">
                  <span className="notif-msg">
                    {!n.is_read && <span className="badge-new">NEW</span>}
                    {n.message}
                  </span>
                  <span className="notif-time">{new Date(n.created_at).toLocaleString()}</span>
                </div>
                {!n.is_read && (
                  <button className="btn-read" onClick={() => markRead(n.id)}>Mark Read</button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
