import React from 'react'

export default function Profile() {
  return (
    <div className="admin-profile" style={{ padding: '24px' }}>
      <style>{`
        .admin-profile .wrap { max-width: 920px; margin: 0 auto; background: #ffffff; border: 1px solid rgba(0,40,80,0.15); border-radius: 18px; padding: 24px; color: #0b2a4a; box-shadow: 0 8px 24px rgba(11,42,74,0.1); }
        .admin-profile .card { display: grid; grid-template-columns: 180px 1fr; gap: 24px; align-items: start; }
        .admin-profile .avatar { width: 140px; height: 140px; border-radius: 20px; background: linear-gradient(135deg, #0b2a4a, #0e3a63); display: grid; place-items: center; color: #fff; font-weight: 800; font-size: 40px; box-shadow: 0 12px 32px rgba(11,42,74,0.2); }
        .admin-profile .row { display: grid; grid-template-columns: 130px 1fr; gap: 14px; align-items: center; margin-bottom: 12px; }
        .admin-profile .row div:first-child { font-weight: 600; color: #0e3a63; }
        .admin-profile .value { padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(0,40,80,0.2); background: #f5f8fb; }
        .admin-profile .btn { padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(0,40,80,0.2); background: #0b2a4a; color: #fff; cursor: pointer; font-size: 14px; margin-top: 14px; transition: transform .2s ease, filter .2s ease; }
        .admin-profile .btn:hover { transform: translateY(-1px); filter: brightness(1.05); }

        @media (max-width: 820px) {
          .admin-profile .card { grid-template-columns: 1fr; }
          .admin-profile .row { grid-template-columns: 120px 1fr; }
          .admin-profile .avatar { margin: 0 auto; }
        }
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
