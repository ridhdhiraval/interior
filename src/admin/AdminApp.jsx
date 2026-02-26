import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Settings from './pages/Settings'
import AdminSignIn from './pages/AdminSignIn'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'
import Plans from './pages/Plans'
import Contacts from './pages/Contacts'

export default function AdminApp() {
  return (
    <Routes>
      <Route path="signin" element={<AdminSignIn />} />
      <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="plans" element={<Plans />} />
        <Route path="orders" element={<Orders />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}

function RequireAuth({ children }) {
  const ok = typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true'
  return ok ? children : <Navigate to="/admin/signin" replace />
}

function Orders() {
  const rows = [
    { id: 'ORD-1024', user: 'Aman Gupta', amount: '$10', status: 'Paid' },
    { id: 'ORD-1025', user: 'Sara Lee', amount: '$5', status: 'Paid' },
    { id: 'ORD-1026', user: 'John Park', amount: '$0', status: 'Free' },
  ]
  return (
    <div className="admin-orders">
      <style>{`
        .card { background: #ffffff; border: 1px solid rgba(0,40,80,0.15); border-radius: 14px; padding: 16px; color: #0b2a4a; box-shadow: 0 6px 20px rgba(11,42,74,0.08); }
        .table { width: 100%; border-radius: 12px; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid rgba(0,40,80,0.1); }
        th { text-align: left; opacity: 0.95; background: #f5f8fb; color: #0b2a4a; }
        tr:hover td { background: #f8fbff; }
      `}</style>
      <div className="card">
        <h2 style={{ margin: '0 0 14px', fontSize: 18, color: '#0e3a63' }}>Orders</h2>
        <div className="table">
          <table>
            <thead>
              <tr><th>Order</th><th>User</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}><td>{r.id}</td><td>{r.user}</td><td>{r.amount}</td><td>{r.status}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
