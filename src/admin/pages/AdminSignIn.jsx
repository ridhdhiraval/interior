import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function AdminSignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', {
        email: email,
        password: password
      })

      if (res.data.user.role !== 'admin') {
        setError('Access denied: You are not an admin')
        setLoading(false)
        return
      }

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      localStorage.setItem('adminAuth', 'true')
      window.dispatchEvent(new Event('storage'))
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
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
          <label style={{ fontSize: 12, opacity: 0.7 }}>Email / Username</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="row">
          <label style={{ fontSize: 12, opacity: 0.7 }}>Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}
