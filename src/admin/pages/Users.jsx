import React, { useState } from 'react'

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Aman Gupta', email: 'aman@example.com', plan: 'PRO', active: true },
    { id: 2, name: 'Sara Lee', email: 'sara@example.com', plan: 'STANDARD', active: true },
    { id: 3, name: 'John Park', email: 'john@example.com', plan: 'FREE', active: false },
    { id: 4, name: 'Ravi Kumar', email: 'ravi@example.com', plan: 'STANDARD', active: true },
    { id: 5, name: 'Neha Singh', email: 'neha@example.com', plan: 'PRO', active: true },
  ])
  const [modal, setModal] = useState(null)

  const upgrade = (id) => {
    const nextPlan = (p) => p === 'FREE' ? 'STANDARD' : p === 'STANDARD' ? 'PRO' : 'PRO'
    setModal({ type: 'upgrade', id, next: nextPlan(users.find(u => u.id === id).plan) })
  }
  const disable = (id) => setModal({ type: 'disable', id })
  const toggleActive = (id) => setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u))
  const confirm = () => {
    if (!modal) return
    if (modal.type === 'upgrade') {
      setUsers(users.map(u => u.id === modal.id ? { ...u, plan: modal.next } : u))
    }
    if (modal.type === 'disable') {
      setUsers(users.map(u => u.id === modal.id ? { ...u, active: false } : u))
    }
    setModal(null)
  }

  return (
    <div className="admin-users">
      <style>{`
        .table { width: 100%; border: 1px solid rgba(0,40,80,0.15); border-radius: 12px; overflow: hidden; background: #ffffff; color: #0b2a4a; box-shadow: 0 6px 20px rgba(11,42,74,0.08); }
        .table table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid rgba(0,40,80,0.1); }
        th { text-align: left; opacity: 0.95; background: #f5f8fb; color: #0b2a4a; }
        tr:hover td { background: #f8fbff; }
        .actions {
          display: flex;
          gap: 8px;
        }
        .btn { padding: 8px 10px; border-radius: 8px; font-size: 12px; border: 1px solid rgba(0,40,80,0.2); background: #0b2a4a; color: #ffffff; cursor: pointer; }
        .pill {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 12px;
          border: 1px solid rgba(0,40,80,0.2);
        }
        .pill.active { background: #e2efff; border-color: rgba(0,40,80,0.25); color: #0b2a4a; }
        .pill.inactive { background: #ffe6e6; border-color: rgba(255,100,100,0.4); color: #b30000; }
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: grid;
          place-items: center;
          z-index: 100;
        }
        .modal-card {
          width: 100%;
          max-width: 420px;
          border: 1px solid rgba(0,40,80,0.15);
          border-radius: 14px;
          background: #ffffff;
          padding: 16px;
          color: #0b2a4a;
          box-shadow: 0 10px 30px rgba(11,42,74,0.12);
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 12px;
        }
      `}</style>

      <h2 style={{ margin: '0 0 14px', fontSize: 18 }}>Users</h2>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
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
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.plan}</td>
                <td>
                  <span className={`pill ${u.active ? 'active' : 'inactive'}`}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button className="btn" onClick={() => upgrade(u.id)}>Upgrade</button>
                    <button className="btn" onClick={() => disable(u.id)}>Disable</button>
                    <button className="btn" onClick={() => toggleActive(u.id)}>{u.active ? 'Deactivate' : 'Activate'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="modal" onClick={() => setModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              {modal.type === 'upgrade' ? 'Upgrade User Plan' : 'Disable User'}
            </div>
            <div style={{ opacity: 0.8 }}>
              {modal.type === 'upgrade' && <>Upgrade to {modal.next}?</>}
              {modal.type === 'disable' && <>Disable this user account?</>}
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn" onClick={confirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
