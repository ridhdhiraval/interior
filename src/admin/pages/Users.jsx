import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)
  const [viewingUser, setViewingUser] = useState(null)
  const [userDesigns, setUserDesigns] = useState([])
  const [designsLoading, setDesignsLoading] = useState(false)
  const [notifText, setNotifText] = useState('')
  const [sendingNotif, setSendingNotif] = useState(false)

  const fetchUsers = async () => {
    console.log('Fetching users...');
    setLoading(true);
    setError(null);
    
    // Set a fallback timeout to stop loading if request hangs
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Request timed out. Please check if the backend server is running on port 5000.');
      }
    }, 10000);

    try {
      const token = localStorage.getItem('token')
      console.log('Token found:', token ? 'Yes' : 'No');
      const res = await axios.get('http://localhost:5001/api/admin/users', {
        headers: { 'x-auth-token': token }
      })
      console.log('Users fetched successfully:', res.data.length);
      setUsers(res.data)
      clearTimeout(timeout);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch users')
      clearTimeout(timeout);
    } finally {
      console.log('Loading set to false');
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleView = async (user) => {
    setViewingUser(user)
    setDesignsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`http://localhost:5001/api/admin/users/${user.id}/designs`, {
        headers: { 'x-auth-token': token }
      })
      setUserDesigns(res.data)
    } catch (err) {
      console.error('Failed to fetch user designs', err)
    } finally {
      setDesignsLoading(false)
    }
  }

  const updatePlan = async (id, plan) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:5001/api/admin/users/${id}/plan`, { plan }, {
        headers: { 'x-auth-token': token }
      })
      setUsers(prev => prev.map(u => u.id === id ? { ...u, plan } : u))
      if (viewingUser && viewingUser.id === id) {
        setViewingUser({ ...viewingUser, plan })
      }
      setModal(null)
    } catch (err) {
      alert('Failed to update plan')
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:5001/api/admin/users/${id}/status`, { status }, {
        headers: { 'x-auth-token': token }
      })
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u))
      if (viewingUser && viewingUser.id === id) {
        setViewingUser({ ...viewingUser, status })
      }
      setModal(null)
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const sendDirectNotif = async () => {
    if (!notifText || !viewingUser) return
    setSendingNotif(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:5001/api/admin/notify-user', {
        userId: viewingUser.id,
        text: notifText
      }, {
        headers: { 'x-auth-token': token }
      })
      alert('Notification sent!')
      setNotifText('')
    } catch (err) {
      alert('Failed to send notification')
    } finally {
      setSendingNotif(false)
    }
  }

  if (viewingUser) {
    return (
      <div className="user-details-view">
        <style>{`
          .details-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
          .back-btn { background: white; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; }
          
          .info-section { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 24px; }
          .section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
          .section-subtitle { font-size: 12px; color: #64748b; margin-bottom: 20px; }
          
          .info-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; }
          .info-item label { display: block; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; }
          .info-item .val { font-size: 14px; font-weight: 700; color: #0f172a; }
          .status-badge { background: #ecfdf5; color: #059669; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; }
          
          .designs-history { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 24px; }
          .designs-empty { border: 2px dashed #e2e8f0; border-radius: 12px; padding: 60px; text-align: center; color: #94a3b8; }
          
          .notif-section { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .notif-input-wrapper { display: flex; gap: 12px; margin-top: 16px; }
          .notif-input { flex: 1; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 10px; outline: none; font-size: 14px; }
          .btn-send { background: #0b2a4a; color: white; border: none; padding: 0 24px; border-radius: 10px; font-weight: 600; cursor: pointer; }
        `}</style>

        <div className="details-header">
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>User Details: {viewingUser.name}</h2>
          <button className="back-btn" onClick={() => setViewingUser(null)}>Back to List</button>
        </div>

        <div className="info-section">
          <div className="section-title">General Information</div>
          <div className="section-subtitle">Basic account details</div>
          <div className="info-grid">
            <div className="info-item"><label>Full Name</label><div className="val">{viewingUser.name}</div></div>
            <div className="info-item"><label>Email Address</label><div className="val">{viewingUser.email}</div></div>
            <div className="info-item"><label>Current Plan</label><div className="val">{viewingUser.plan || 'FREE'}</div></div>
            <div className="info-item"><label>Account Status</label><div><span className="status-badge">{viewingUser.status || 'Active'}</span></div></div>
            <div className="info-item"><label>Joined Date</label><div className="val">{new Date(viewingUser.created_at).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}</div></div>
          </div>
        </div>

        <div className="designs-history">
          <div className="section-title">AI Designs History</div>
          <div className="section-subtitle">Images uploaded and generated by user</div>
          {designsLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading designs...</div>
          ) : userDesigns.length === 0 ? (
            <div className="designs-empty">
              <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
              No designs generated yet by this user.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {userDesigns.map(d => (
                <div key={d.id} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                  <img src={d.thumbnail_url || "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&q=80"} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
                  <div style={{ padding: 10, fontSize: 12, fontWeight: 600 }}>{d.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="notif-section">
          <div className="section-title">Send Notification</div>
          <div className="section-subtitle">Direct message to user panel</div>
          <div className="notif-input-wrapper">
            <input 
              className="notif-input" 
              placeholder="Type notification message here..." 
              value={notifText}
              onChange={(e) => setNotifText(e.target.value)}
            />
            <button className="btn-send" onClick={sendDirectNotif} disabled={sendingNotif}>
              {sendingNotif ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-users">
      <style>{`
        .table-container { background: #ffffff; border: 1px solid rgba(0,40,80,0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(11,42,74,0.05); }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 14px 20px; background: #f8fafc; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; }
        td { padding: 16px 20px; font-size: 13px; border-bottom: 1px solid #f1f5f9; color: #334155; }
        tr:hover td { background: #f8fafc; }
        
        .actions { display: flex; gap: 8px; }
        .btn-act { 
          padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: 600; cursor: pointer; 
          border: 1px solid #e2e8f0; background: white; color: #334155; transition: all 0.2s;
        }
        .btn-act.view { background: #0b2a4a; color: white; border-color: #0b2a4a; }
        .btn-act:hover { background: #f1f5f9; border-color: #cbd5e1; color: #0b2a4a !important; }
        .btn-act.view:hover { background: #1e40af; color: white !important; border-color: #1e40af; }

        .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: grid; place-items: center; z-index: 100; backdrop-filter: blur(4px); }
        .modal-card { width: 100%; max-width: 420px; background: white; border-radius: 24px; padding: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
        .modal-title { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
        .modal-body { color: #64748b; font-size: 14px; margin-bottom: 24px; }
        
        .radio-group { display: flex; gap: 20px; margin-bottom: 30px; }
        .radio-item { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 12px; flex: 1; }
        .radio-item.active { border-color: #0b2a4a; background: #f8fbff; }
        
        .modal-btns { display: flex; justify-content: flex-end; gap: 12px; }
        .btn-cancel { padding: 10px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; background: white; border: 1px solid #e2e8f0; }
        .btn-confirm { padding: 10px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; background: #0b2a4a; color: white; border: none; }
      `}</style>

      <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 800 }}>Users</h2>
      
      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #fee2e2', fontSize: '14px', fontWeight: 500 }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading users...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td style={{ fontSize: 11, fontWeight: 700 }}>{u.plan || 'FREE'}</td>
                  <td><span style={{ color: (u.status || 'Active') === 'Deactivated' ? '#ef4444' : '#22c55e', fontSize: 12, fontWeight: 600 }}>{u.status || 'Active'}</span></td>
                  <td>
                    <div className="actions">
                      <button className="btn-act view" onClick={() => handleView(u)}>View</button>
                      <button className="btn-act" onClick={() => setModal({ type: 'upgrade', user: u, selectedPlan: u.plan || 'FREE' })}>Upgrade</button>
                      <button 
                        className="btn-act" 
                        onClick={() => setModal({ 
                          type: (u.status || 'Active') === 'Active' ? 'deactivate' : 'activate', 
                          user: u 
                        })}
                      >
                        {(u.status || 'Active') === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal">
          <div className="modal-card">
            <div className="modal-title">
              {modal.type === 'upgrade' ? 'Upgrade user' : modal.type === 'activate' ? 'Activate user' : 'Deactivate user'}
            </div>
            <div className="modal-body">
              {modal.type === 'upgrade' ? `Choose a new plan for ${modal.user.name}.` : 
               modal.type === 'activate' ? `Activate access for ${modal.user.name}?` : 
               `Deactivate account for ${modal.user.name}?`}
            </div>

            {modal.type === 'upgrade' && (
              <div className="radio-group">
                {['FREE', 'STANDARD', 'PRO'].map(p => (
                  <div 
                    key={p} 
                    className={`radio-item ${modal.selectedPlan === p ? 'active' : ''}`}
                    onClick={() => setModal({ ...modal, selectedPlan: p })}
                  >
                    <input type="radio" checked={modal.selectedPlan === p} readOnly />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{p}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-btns">
              <button className="btn-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn-confirm" onClick={() => {
                if (modal.type === 'upgrade') updatePlan(modal.user.id, modal.selectedPlan)
                else if (modal.type === 'activate') updateStatus(modal.user.id, 'Active')
                else if (modal.type === 'deactivate') updateStatus(modal.user.id, 'Deactivated')
              }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

