import React from 'react'

export default function Profile() {
  return (
    <div className="admin-profile">
      <style>{`
        .wrap { background: #ffffff; border: 1px solid rgba(0,40,80,0.15); border-radius: 14px; padding: 16px; color: #0b2a4a; box-shadow: 0 6px 20px rgba(11,42,74,0.08); }
        .card { display: grid; grid-template-columns: 160px 1fr; gap: 16px; }
        .avatar { width: 120px; height: 120px; border-radius: 16px; background: linear-gradient(135deg, #0b2a4a, #0e3a63); display: grid; place-items: center; color: #fff; font-weight: 800; font-size: 36px; box-shadow: 0 10px 30px rgba(11,42,74,0.12); }
        .row { display: grid; grid-template-columns: 160px 1fr; gap: 10px; align-items: center; margin-bottom: 8px; }
        .value { padding: 8px 10px; border-radius: 10px; border: 1px solid rgba(0,40,80,0.2); background: #f5f8fb; }
        .btn { padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(0,40,80,0.2); background: #0b2a4a; color: #fff; cursor: pointer; font-size: 13px; margin-top: 10px; }
      `}</style>
      <div className="wrap">
        <div className="card">
          <div className="avatar">KM</div>
          <div>
            <div className="row"><div>Name</div><div className="value">Komal Mishra</div></div>
            <div className="row"><div>Role</div><div className="value">Superuser</div></div>
            <div className="row"><div>Email</div><div className="value">komal.mishra@interior.design</div></div>
            <div className="row"><div>Last Login</div><div className="value">Just now</div></div>
            <button className="btn" onClick={() => { localStorage.setItem('adminAuth','false'); window.location.href = '/admin/signin' }}>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  )
}
