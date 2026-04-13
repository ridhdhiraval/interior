import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function AdminLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [admin, setAdmin] = useState({ name: 'Admin', role: 'Superuser' })
  const theme = 'navy'

  useEffect(() => {
    window.scrollTo(0, 0)
    const userStr = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!userStr || !token) {
      navigate('/admin/signin')
      return
    }

    try {
      const user = JSON.parse(userStr)
      if (user.role === 'admin') {
        setAdmin({ name: user.name, role: 'Administrator' })
      } else {
        navigate('/admin/signin')
      }
    } catch (err) {
      navigate('/admin/signin')
    }
  }, [pathname, navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('adminAuth')
    window.dispatchEvent(new Event('storage'))
    navigate('/admin/signin')
  }

  return (
    <div className={`admin-root theme-${theme}`}>
      <style>{`
        .theme-navy {
          --bg: #f6f9ff;
          --panel: #ffffff;
          --border: rgba(0,40,80,0.15);
          --accent1: #0b2a4a;
          --accent2: #0e3a63;
          --text: #0b2a4a;
          --muted: #3e5b74;
        }
        .theme-light {
          --bg: #ffffff;
          --panel: #ffffff;
          --border: rgba(0,0,0,0.1);
          --accent1: #1f3b63;
          --accent2: #3c69a3;
          --text: #1a1a1a;
          --muted: #5c6b7a;
        }
        .admin-root {
          display: grid;
          grid-template-columns: 260px 1fr;
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
        }
        .admin-sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          background: linear-gradient(180deg, #0b2a4a 0%, #0e3a63 100%);
          border-right: none;
          padding: 24px 18px;
          color: #ffffff;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          letter-spacing: 0.4px;
          color: #ffffff;
          margin-bottom: 22px;
        }
        .brand-badge {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.2);
          display: grid;
          place-items: center;
          font-size: 16px;
          color: #ffffff;
          font-weight: 800;
        }
        .sidebar-section {
          margin-top: 16px;
        }
        .sidebar-title {
          font-size: 12px;
          text-transform: uppercase;
          opacity: 0.8;
          margin: 14px 10px;
          color: #d7e6f3;
        }
        .nav-list {
          display: grid;
          gap: 4px;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          color: #eaf2f8;
          text-decoration: none;
          border-radius: 10px;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .nav-link:hover {
          background: rgba(255,255,255,0.12);
          color: #ffffff;
        }
        .nav-link.active {
          background: rgba(255,255,255,0.18);
          color: #ffffff;
          outline: 1px solid rgba(255,255,255,0.25);
        }
        .nav-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(255,255,255,0.16);
          display: grid;
          place-items: center;
          font-size: 14px;
          color: #eaf2f8;
        }

        .admin-main {
          min-height: 100vh;
          display: grid;
          grid-template-rows: 64px 1fr;
        }
        .topbar {
          position: sticky;
          top: 0;
          backdrop-filter: blur(10px);
          background: #ffffff;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          z-index: 10;
        }
        .topbar h1 {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.2px;
          opacity: 0.9;
          color: var(--accent1);
        }
        .top-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .profile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 10px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--panel);
        }
        .avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0b2a4a, #0e3a63);
          display: grid;
          place-items: center;
          color: #ffffff;
          font-weight: 800;
          font-size: 12px;
        }
        .content {
          padding: 20px;
        }

        @media (max-width: 960px) {
          .admin-root {
            grid-template-columns: 1fr;
          }
          .admin-sidebar {
            display: none;
          }
        }
      `}</style>

      <aside className="admin-sidebar">
        <div className="brand">
          <div className="brand-badge">ID</div>
          Interior Admin
        </div>

        <div className="sidebar-section">
          <div className="sidebar-title">Overview</div>
          <nav className="nav-list">
            <NavItem to="/admin" label="Dashboard" icon="📊" exact />
            <NavItem to="/admin/users" label="Users" icon="👥" />
            <NavItem to="/admin/plans" label="Plans" icon="💳" />
            <NavItem to="/admin/orders" label="Orders" icon="🧾" />
            <NavItem to="/admin/analytics" label="Analytics" icon="📈" />
            <NavItem to="/admin/settings" label="Settings" icon="⚙️" />
            <NavItem to="/admin/contacts" label="Contacts" icon="✉️" />
            <NavItem to="/admin/notifications" label="Notifications" icon="🔔" />
            <NavItem to="/admin/profile" label="Profile" icon="👤" />
          </nav>
        </div>
      </aside>

      <main className="admin-main">
        <div className="topbar">
          <h1>Admin Panel</h1>
          <div className="top-actions">
            <div className="profile">
              <div className="avatar">{admin.name.split(' ').map(n => n[0]).join('')}</div>
              <div style={{ fontSize: 12 }}>
                <div>{admin.name}</div>
                <div style={{ opacity: 0.7 }}>{admin.role}</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              style={{ 
                padding: '6px 12px', 
                borderRadius: '8px', 
                border: '1px solid var(--border)',
                background: '#ff4d4f',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function NavItem({ to, label, icon, exact }) {
  const { pathname } = useLocation()
  const isActive = exact ? pathname === to : pathname.startsWith(to)
  return (
    <Link className={`nav-link ${isActive ? 'active' : ''}`} to={to}>
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
