import React, { useEffect, useState } from 'react'

const defaultPlans = [
  { name: 'FREE', monthly: 0, yearly: 0 },
  { name: 'STANDARD', monthly: 9, yearly: 5 },
  { name: 'PRO', monthly: 19, yearly: 10 },
]

export default function Plans() {
  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem('adminPlans')
    return saved ? JSON.parse(saved) : defaultPlans
  })

  useEffect(() => {
    localStorage.setItem('adminPlans', JSON.stringify(plans))
  }, [plans])

  const update = (idx, field, value) => {
    const next = plans.slice()
    next[idx] = { ...next[idx], [field]: Number(value) }
    setPlans(next)
  }

  return (
    <div className="admin-plans">
      <style>{`
        .grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .card { background: #ffffff; border: 1px solid rgba(0,40,80,0.15); border-radius: 14px; padding: 16px; color: #0b2a4a; }
        .title { font-size: 16px; font-weight: 700; margin: 0 0 8px; }
        .row { display: grid; grid-template-columns: 120px 1fr; gap: 10px; align-items: center; margin-bottom: 8px; }
        .input { padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(0,40,80,0.2); }
        .save { margin-top: 10px; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(0,40,80,0.2); background: #0b2a4a; color: #fff; cursor: pointer; }
        @media (max-width: 1100px) { .grid { grid-template-columns: 1fr; } }
      `}</style>
      <h2 style={{ margin: '0 0 14px', fontSize: 18, color: '#0b2a4a' }}>Plans</h2>
      <div className="grid">
        {plans.map((p, idx) => (
          <div className="card" key={p.name}>
            <div className="title">{p.name}</div>
            <div className="row"><div>Monthly</div><input className="input" type="number" value={p.monthly} onChange={(e) => update(idx, 'monthly', e.target.value)} /></div>
            <div className="row"><div>Yearly</div><input className="input" type="number" value={p.yearly} onChange={(e) => update(idx, 'yearly', e.target.value)} /></div>
            <button className="save" onClick={() => localStorage.setItem('adminPlans', JSON.stringify(plans))}>Save</button>
          </div>
        ))}
      </div>
    </div>
  )
}
