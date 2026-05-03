import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Plans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:5001/api/admin/plans', {
        headers: { 'x-auth-token': token }
      })
      setPlans(res.data)
    } catch (err) {
      console.error('Failed to load plans', err)
      setMessage({ text: 'Failed to load plans', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage({ text: '', type: '' })
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:5001/api/admin/plans', { plans }, {
        headers: { 'x-auth-token': token }
      })
      setMessage({ text: 'Plans updated successfully!', type: 'success' })
    } catch (err) {
      console.error('Failed to save plans', err)
      setMessage({ text: 'Failed to save plans', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const update = (idx, field, value) => {
    const next = plans.slice()
    next[idx] = { ...next[idx], [field]: Number(value) }
    setPlans(next)
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Plans...</div>

  return (
    <div className="admin-plans">
      <style>{`
        .grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .card { background: #ffffff; border: 1px solid rgba(0,40,80,0.15); border-radius: 14px; padding: 16px; color: #0b2a4a; }
        .title { font-size: 16px; font-weight: 700; margin: 0 0 8px; }
        .row { display: grid; grid-template-columns: 120px 1fr; gap: 10px; align-items: center; margin-bottom: 8px; }
        .input { padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(0,40,80,0.2); width: 100%; }
        .save { margin-top: 10px; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(0,40,80,0.2); background: #0b2a4a; color: #fff; cursor: pointer; width: 100%; font-weight: 600; }
        .save:disabled { opacity: 0.6; cursor: not-allowed; }
        .alert { padding: 12px; border-radius: 10px; margin-bottom: 16px; font-size: 14px; }
        .alert.success { background: #ecfdf5; color: #059669; }
        .alert.error { background: #fef2f2; color: #dc2626; }
        @media (max-width: 1100px) { .grid { grid-template-columns: 1fr; } }
      `}</style>
      <h2 style={{ margin: '0 0 14px', fontSize: 18, color: '#0b2a4a' }}>Plans</h2>
      
      {message.text && (
        <div className={`alert ${message.type}`}>{message.text}</div>
      )}

      <div className="grid">
        {plans.map((p, idx) => (
          <div className="card" key={p.name}>
            <div className="title">{p.name}</div>
            <div className="row"><div>Monthly</div><input className="input" type="number" value={p.monthly} onChange={(e) => update(idx, 'monthly', e.target.value)} /></div>
            <div className="row"><div>Yearly</div><input className="input" type="number" value={p.yearly} onChange={(e) => update(idx, 'yearly', e.target.value)} /></div>
            <button className="save" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
