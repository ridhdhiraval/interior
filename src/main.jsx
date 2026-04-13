import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import './index.css'
import { PlannerProvider } from './planner/PlannerContext'

// Create root and render App component inside index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="677863061504-rru22a648fug00e0pi3c26oc40et5o91.apps.googleusercontent.com">
      <BrowserRouter>
        <PlannerProvider>
          <App />
        </PlannerProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
