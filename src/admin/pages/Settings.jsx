import React from 'react'

export default function Settings() {
  return (
    <div className="admin-settings">
      <style>{`
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .panel { border: 1px solid rgba(0,40,80,0.15); border-radius: 12px; padding: 16px; background: #ffffff; color: #0b2a4a; box-shadow: 0 6px 20px rgba(11,42,74,0.08); }
        .panel h3 { margin: 0 0 12px; font-size: 16px; font-weight: 700; color: #0e3a63; }
        .form-row { display: grid; grid-template-columns: 160px 1fr; gap: 12px; align-items: center; margin-bottom: 12px; }
        .input { padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(0,40,80,0.2); background: #f5f8fb; color: #0b2a4a; font-size: 13px; }
        .save { margin-top: 8px; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(0,40,80,0.2); background: #0b2a4a; color: #ffffff; cursor: pointer; }
        @media (max-width: 1100px) { .grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="grid">
        <div className="panel">
          <h3>General</h3>
          <div className="form-row">
            <label>Site Name</label>
            <input className="input" defaultValue="Interior Design" />
          </div>
          <div className="form-row">
            <label>Support Email</label>
            <input className="input" defaultValue="support@interior.design" />
          </div>
          <button className="save">Save</button>
        </div>
        <div className="panel">
          <h3>Payments</h3>
          <div className="form-row">
            <label>Currency</label>
            <select className="input" defaultValue="USD">
              <option>USD</option>
              <option>EUR</option>
              <option>INR</option>
            </select>
          </div>
          <div className="form-row">
            <label>Invoice Prefix</label>
            <input className="input" defaultValue="INT-" />
          </div>
          <button className="save">Save</button>
        </div>
      </div>
    </div>
  )
}
