import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Contacts() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:5001/api/admin/contacts', {
        headers: { 'x-auth-token': token }
      })
      setMessages(res.data)
    } catch (err) {
      setError('Failed to fetch contact messages')
    } finally {
      setLoading(false)
    }
  }

  const resolveMessage = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:5001/api/admin/contacts/${id}/resolve`, {}, {
        headers: { 'x-auth-token': token }
      })
      // Update local state to reflect change immediately
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_resolved: true } : m))
    } catch (err) {
      console.error('Resolve error:', err)
      alert('Failed to resolve message')
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Messages...</div>

  return (
    <div className="admin-contacts">
      <style>{`
        .contacts-container { background: #ffffff; border: 1px solid rgba(0,40,80,0.1); border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(11,42,74,0.05); }
        .header { padding: 24px; border-bottom: 1px solid #f1f5f9; }
        .header h3 { margin: 0; font-size: 20px; font-weight: 700; color: #0f172a; }
        .header p { margin: 4px 0 0; font-size: 14px; color: #64748b; }
        
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 14px 24px; background: #f8fafc; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; }
        td { padding: 18px 24px; font-size: 14px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: top; } // Adjusted td style to match original file's padding
        tr:hover td { background: #f8fafc; }
        
        .user-info { font-weight: 600; color: #0f172a; display: block; }
        .user-email { font-size: 12px; color: #64748b; display: block; }
        .subject { font-weight: 600; color: #0b2a4a; margin-bottom: 4px; display: block; }
        .message-text { font-size: 13px; line-height: 1.5; color: #475569; max-width: 400px; display: block; }
        
        .btn-resolve { 
          background: #0b2a4a; color: white; border: none; padding: 6px 14px; border-radius: 8px; 
          font-size: 12px; font-weight: 600; cursor: pointer; transition: opacity 0.2s;
        }
        .btn-resolve:disabled { background: #ecfdf5; color: #059669; cursor: default; }
        
        .status-badge { 
          font-size: 11px; font-weight: 700; text-transform: uppercase; 
          padding: 2px 8px; border-radius: 99px; display: inline-block; margin-top: 8px;
        }
        .status-pending { background: #fff7ed; color: #ea580c; }
        .status-resolved { background: #ecfdf5; color: #059669; }
      `}</style>

      <div className="contacts-container">
        <div className="header">
          <h3>Messages from users</h3>
          <p>Every row below is a message sent from the Contact page.</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>User Details</th>
              <th>Subject & Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No messages found</td></tr>
            ) : (
              messages.map(m => (
                <tr key={m.id}>
                  <td>
                    <span className="user-info">{m.name}</span>
                    <span className="user-email">{m.email}</span>
                  </td>
                  <td>
                    <span className="subject">{m.subject}</span>
                    <span className="message-text">{m.message}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${m.is_resolved ? 'status-resolved' : 'status-pending'}`}>
                      {m.is_resolved ? 'Resolved' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-resolve" 
                      onClick={() => resolveMessage(m.id)}
                      disabled={m.is_resolved}
                    >
                      {m.is_resolved ? 'Done' : 'Resolve'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
