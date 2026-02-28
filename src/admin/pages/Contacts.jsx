import React, { useState } from 'react'

const defaultQuestions = [
  {
    name: 'Aman Gupta',
    email: 'aman@example.com',
    subject: 'Can you design my 2BHK living room?',
    message: 'I want a modern look with neutral colors and space for a projector.',
  },
  {
    name: 'Sara Lee',
    email: 'sara@example.com',
    subject: 'How many revisions are included?',
    message: 'If I do not like the first AI design, how many changes can I request?',
  },
  {
    name: 'Ravi Kumar',
    email: 'ravi@example.com',
    subject: 'Timeline for full house design',
    message: 'By when can I get the final designs for a 3BHK flat?',
  },
]

export default function Contacts() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('contactMessages')
    return saved ? JSON.parse(saved) : defaultQuestions
  })

  const remove = (idx) => {
    const next = items.slice()
    next.splice(idx, 1)
    setItems(next)
    localStorage.setItem('contactMessages', JSON.stringify(next))
  }

  return (
    <div className="admin-contacts">
      <style>{`
        .card { background: #ffffff; border: 1px solid rgba(0,40,80,0.15); border-radius: 14px; padding: 16px; color: #0b2a4a; box-shadow: 0 6px 20px rgba(11,42,74,0.08); }
        .table { border-radius: 14px; overflow: hidden; background: #ffffff; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px 12px; font-size: 12px; border-bottom: 1px solid rgba(0,40,80,0.1); }
        th { text-align: left; background: #f5f8fb; }
        .btn { padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(0,40,80,0.2); background: #0b2a4a; color: #fff; cursor: pointer; }
      `}</style>
      <div className="card">
        <h2 style={{ margin: '0 0 6px', fontSize: 18, color: '#0b2a4a' }}>Messages from users</h2>
        <p style={{ margin: '0 0 14px', fontSize: 13, opacity: 0.8 }}>Every row below is a message sent from the Contact page.</p>
        <div className="table">
        <table>
          <thead><tr><th>User name</th><th>Email</th><th>Subject</th><th>Message from user</th><th>Action</th></tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan="5" style={{ padding: 12, opacity: 0.7 }}>No messages</td></tr>}
            {items.map((m, idx) => (
              <tr key={idx}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.subject}</td>
                <td>{m.message}</td>
                <td><button className="btn" onClick={() => remove(idx)}>Resolve</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
