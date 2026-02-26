import React, { useEffect, useState } from 'react'

export default function Notifications() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('adminNotifications')
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'New user signed up: Aman Gupta', read: false },
      { id: 2, text: 'Monthly revenue crossed $5k', read: false },
      { id: 3, text: 'Order ORD-1025 marked as Paid', read: true },
    ]
  })
  const [compose, setCompose] = useState({ to: 'ALL', userId: '', message: '' })

  const markRead = (id) => setItems(items.map(i => i.id === id ? { ...i, read: true } : i))
  const clearAll = () => { setItems([]); localStorage.setItem('adminNotifications', JSON.stringify([])) }
  useEffect(() => { localStorage.setItem('adminNotifications', JSON.stringify(items)) }, [items])

  const users = [
    { id: 1, name: 'Aman Gupta' },
    { id: 2, name: 'Sara Lee' },
    { id: 3, name: 'John Park' },
    { id: 4, name: 'Ravi Kumar' },
    { id: 5, name: 'Neha Singh' },
  ]

  const send = () => {
    const msg = compose.message.trim()
    if (!msg) return
    if (compose.to === 'ALL') {
      const broadcast = { id: Date.now(), text: msg, read: false, scope: 'ALL' }
      setItems([broadcast, ...items])
      const saved = JSON.parse(localStorage.getItem('userNotifications') || '{}')
      saved.broadcast = [...(saved.broadcast || []), { ts: Date.now(), text: msg }]
      localStorage.setItem('userNotifications', JSON.stringify(saved))
    } else {
      const target = users.find(u => String(u.id) === String(compose.userId))
      if (!target) return
      const saved = JSON.parse(localStorage.getItem('userNotifications') || '{}')
      saved.perUser = saved.perUser || {}
      saved.perUser[target.id] = [...(saved.perUser[target.id] || []), { ts: Date.now(), text: msg }]
      localStorage.setItem('userNotifications', JSON.stringify(saved))
      setItems([{ id: Date.now(), text: `To ${target.name}: ${msg}`, read: false, scope: 'USER' }, ...items])
    }
    setCompose({ to: 'ALL', userId: '', message: '' })
  }

  return (
    <div className="admin-notifications">
      <style>{`
        .panel { border: 1px solid rgba(0,40,80,0.15); border-radius: 12px; background: #ffffff; color: #0b2a4a; box-shadow: 0 6px 20px rgba(11,42,74,0.08); }
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(0,40,80,0.15);
        }
        .top-title { font-size: 18px; font-weight: 700; color: #0e3a63; }
        .compose {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(0,40,80,0.08);
        }
        .compose-row { display: grid; grid-template-columns: 160px 1fr 120px; gap: 10px; margin-top: 8px; }
        .label { font-size: 12px; opacity: 0.8; margin-bottom: 4px; }
        .select, .input { padding: 8px 10px; border-radius: 10px; border: 1px solid rgba(0,40,80,0.2); background: #f5f8fb; color: #0b2a4a; font-size: 12px; }
        .input-message { min-height: 36px; }
        .list {
          padding: 8px 16px 14px;
        }
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
        }
        .item:hover {
          background: #f8fbff;
        }
        .btn { padding: 8px 14px; border-radius: 8px; font-size: 12px; border: 1px solid rgba(0,40,80,0.2); background: #0b2a4a; color: #ffffff; cursor: pointer; }
        .btn-secondary { background: #ffffff; color: #0b2a4a; }
        .badge {
          font-size: 12px; padding: 4px 8px; border-radius: 8px; background: #e2efff; border: 1px solid rgba(0,40,80,0.25); color: #0b2a4a;
        }
      `}</style>
      <div className="panel">
        <div className="top">
          <div className="top-title">Notifications</div>
          <button className="btn btn-secondary" onClick={clearAll}>Clear all</button>
        </div>
        <div className="compose">
          <div className="label">Who to notify</div>
          <div className="compose-row">
            <select className="select" value={compose.to} onChange={(e) => setCompose({ ...compose, to: e.target.value })}>
              <option value="ALL">All users</option>
              <option value="USER">Single user</option>
            </select>
            {compose.to === 'USER' ? (
              <select className="select" value={compose.userId} onChange={(e) => setCompose({ ...compose, userId: e.target.value })}>
                <option value="">Select user</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            ) : (
              <input className="input input-message" placeholder="Notification text" value={compose.message} onChange={(e) => setCompose({ ...compose, message: e.target.value })} />
            )}
            <button className="btn" onClick={send}>Notify</button>
          </div>
          {compose.to === 'USER' && (
            <div style={{ marginTop: 10 }}>
              <div className="label">Notification text</div>
              <input className="input input-message" placeholder="Write a message" value={compose.message} onChange={(e) => setCompose({ ...compose, message: e.target.value })} />
            </div>
          )}
        </div>
        <div className="list">
          {items.length === 0 && <div style={{ padding: 12, opacity: 0.7 }}>No notifications</div>}
          {items.map(i => (
            <div key={i.id} className="item">
              <div>
                <div>{i.text}</div>
                {!i.read && <span className="badge">New</span>}
              </div>
              {!i.read && <button className="btn" onClick={() => markRead(i.id)}>Mark Read</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
