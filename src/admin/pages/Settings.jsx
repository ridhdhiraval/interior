import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: '',
    supportEmail: '',
    currency: 'USD',
    invoicePrefix: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('http://localhost:5001/api/admin/settings', {
          headers: { 'x-auth-token': token }
        })
        setSettings(res.data)
      } catch (err) {
        console.error('Failed to load settings', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ text: '', type: '' })
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:5001/api/admin/settings', settings, {
        headers: { 'x-auth-token': token }
      })
      setMessage({ text: 'Settings saved successfully!', type: 'success' })
      // Trigger a global update if necessary (e.g., through a context or simple reload)
      setTimeout(() => window.location.reload(), 1500)
    } catch (err) {
      console.error('Failed to save settings', err)
      setMessage({ text: 'Failed to save settings', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Settings...</div>

  return (
    <div className="admin-settings">
      <style>{`
        .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .card { background: #ffffff; border: 1px solid rgba(0,40,80,0.1); border-radius: 20px; padding: 24px; box-shadow: 0 4px 12px rgba(11,42,74,0.05); }
        .card h3 { margin: 0 0 20px; font-size: 18px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
        
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 14px; font-weight: 600; color: #64748b; margin-bottom: 8px; }
        .form-group input, .form-group select { 
          width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid #e2e8f0; 
          font-size: 14px; color: #0f172a; outline: none; transition: border-color 0.2s;
        }
        .form-group input:focus { border-color: #0b2a4a; }
        
        .btn-save { 
          background: #0b2a4a; color: white; border: none; padding: 10px 24px; border-radius: 10px; 
          font-weight: 600; cursor: pointer; transition: opacity 0.2s;
        }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .alert { 
          padding: 12px 16px; border-radius: 10px; margin-bottom: 20px; font-size: 14px; font-weight: 500;
        }
        .alert.success { background: #ecfdf5; color: #059669; border: 1px solid #10b98133; }
        .alert.error { background: #fef2f2; color: #dc2626; border: 1px solid #ef444433; }
        
        @media (max-width: 900px) { .settings-grid { grid-template-columns: 1fr; } }
      `}</style>

      {message.text && (
        <div className={`alert ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSave} className="settings-grid">
        <div className="card">
          <h3>General Settings</h3>
          <div className="form-group">
            <label>Site Name</label>
            <input 
              type="text" 
              value={settings.siteName} 
              onChange={e => setSettings({...settings, siteName: e.target.value})}
              placeholder="e.g. Iconic Interior"
            />
          </div>
          <div className="form-group">
            <label>Support Email</label>
            <input 
              type="email" 
              value={settings.supportEmail} 
              onChange={e => setSettings({...settings, supportEmail: e.target.value})}
              placeholder="support@example.com"
            />
          </div>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : 'Save General Settings'}
          </button>
        </div>

        <div className="card">
          <h3>Payments & Local</h3>
          <div className="form-group">
            <label>Currency</label>
            <select 
              value={settings.currency} 
              onChange={e => setSettings({...settings, currency: e.target.value})}
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Invoice Prefix</label>
            <input 
              type="text" 
              value={settings.invoicePrefix} 
              onChange={e => setSettings({...settings, invoicePrefix: e.target.value})}
              placeholder="e.g. INV-"
            />
          </div>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : 'Save Payment Settings'}
          </button>
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
