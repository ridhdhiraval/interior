import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminSignIn() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminAuth', 'true')
      setError('')
      navigate('/admin', { replace: true })
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="admin-signin">
      <style>{`
        .admin-signin {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #f6f9ff;
          color: #0b2a4a;
          font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
        }
        .card {
          width: 100%;
          max-width: 380px;
          border: 1px solid rgba(0,40,80,0.15);
          border-radius: 16px;
          background: #ffffff;
          padding: 22px 22px 20px;
          box-shadow: 0 16px 40px rgba(11,42,74,0.16);
        }
        .title {
          margin: 0 0 10px;
          font-size: 20px;
          font-weight: 700;
          color: #0e3a63;
        }
        .row {
          display: grid;
          gap: 8px;
          margin-bottom: 12px;
        }
        .input {
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid rgba(0,40,80,0.2);
          background: #f5f8fb;
          color: #0b2a4a;
          font-size: 13px;
        }
        .btn {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid rgba(0,40,80,0.2);
          background: #0b2a4a;
          color: #ffffff;
          cursor: pointer;
          font-size: 13px;
        }
        .error {
          color: #c0392b;
          font-size: 12px;
          margin-top: 8px;
        }
      `}</style>
      <form className="card" onSubmit={submit}>
        <div className="title">Admin Sign In</div>
        <div className="row">
          <label style={{ fontSize: 12, opacity: 0.7 }}>Username</label>
          <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="row">
          <label style={{ fontSize: 12, opacity: 0.7 }}>Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn" type="submit">Sign In</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}
