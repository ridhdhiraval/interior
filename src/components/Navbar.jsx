import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [siteName, setSiteName] = useState('Iconic Interior')

  useEffect(() => {
    fetchSettings()
    const checkUser = () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
        fetchUnreadCount()
      } else {
        setUser(null)
        setUnreadCount(0)
      }
    }
    checkUser()
    window.addEventListener('storage', checkUser)
    
    // Poll for notifications every 30 seconds
    const interval = setInterval(() => {
      if (localStorage.getItem('user')) {
        fetchUnreadCount()
      }
    }, 30000)

    return () => {
      window.removeEventListener('storage', checkUser)
      clearInterval(interval)
    }
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/public/settings')
      if (res.data.siteName) setSiteName(res.data.siteName)
    } catch (err) {
      console.error('Failed to fetch settings', err)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return;
      const res = await axios.get('http://localhost:5001/api/notifications', {
        headers: { 'x-auth-token': token }
      })
      const unread = res.data.filter(n => !n.is_read).length
      setUnreadCount(unread)
    } catch (err) {
      console.error('Failed to fetch unread count', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <>
      <style>{`
        .navbar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          z-index: 50;
          background: #1a1a1a;
          backdrop-filter: blur(6px);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          box-sizing: border-box;
        }

        /* LEFT AREA */
        .nav-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-logo-img {
          height: 28px;
          cursor: pointer;
        }

        .nav-left a {
          color: white;
          text-decoration: none;
          font-size: 13px;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .nav-left a:hover {
          opacity: 1;
        }

        /* Center logo text */
        .nav-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .nav-logo {
          font-size: 20px;
          font-weight: 600;
          color: white;
          letter-spacing: 1px;
          text-decoration: none;
          text-transform: uppercase;
        }

        /* RIGHT AREA */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-icon {
          color: white;
          font-size: 20px;
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
        }

        .nav-icon:hover {
          opacity: 1;
        }

        .nav-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .notif-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid #1a1a1a;
        }

        .sign-out-btn {
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.9;
        }

        .sign-out-btn:hover {
          opacity: 1;
        }

        .sign-in-btn {
          background: #ffffff;
          color: #000000;
          padding: 6px 20px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
        }

        .sign-in-btn:hover {
          background: #f0f0f0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .navbar-overlay {
            padding: 0 20px;
          }
          .nav-left a:not(:first-child) {
            display: none;
          }
          .nav-logo {
            font-size: 16px;
          }
        }
      `}</style>

      <nav className="navbar-overlay">
        <div className="nav-left">
          <Link to="/">
            <img
              src="/logo.png"
              alt="Logo"
              className="nav-logo-img"
            />
          </Link>

          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/pricing">Prices</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="nav-center">
          <Link to="/" className="nav-logo">{siteName}</Link>
        </div>

        <div className="nav-right">
          {user ? (
            <>
              <Link to="/notifications" className="nav-icon-wrapper" title="Notifications">
                <div className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  {unreadCount > 0 && <span className="notif-badge"></span>}
                </div>
              </Link>
              <Link to="/my-profile" className="nav-icon" title="Profile">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>
              <button onClick={handleLogout} className="sign-out-btn">Sign out</button>
            </>
          ) : (
            <Link to="/signin" className="sign-in-btn">Sign In</Link>
          )}
        </div>
      </nav>
    </>
  )
}