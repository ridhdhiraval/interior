import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from "./components/Navbar"
import BeforeAfterHero from "./components/BeforeAfter"
import VirtualAI from "./components/virtualai"
import AIWorkflow from "./components/AIWorkflow"
import WhatIsSection from "./components/WhatIsSection"
import RoomFeatures from "./components/RoomFeatures"
import ManualDesign from "./components/ManualDesign"
import Footer from "./components/Footer"
import Pricing from "./components/Pricing"
import ContactUs from "./components/ContactUs"
import About from "./components/About"
import SignIn from "./components/SignIn"
import Payment from "./components/Payment"
import ProfilePage from "./components/ProfilePage"
import UserNotifications from "./components/UserNotifications"
import ResetPassword from "./components/ResetPassword"

// ✅ ADMIN APP
import AdminApp from "./admin/AdminApp"

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Website */}
        <Route
          path="/"
          element={
            <>
              <BeforeAfterHero />
              <AIWorkflow />
              <WhatIsSection />
              <RoomFeatures />
            </>
          }
        />

        <Route path="/virtualai" element={<VirtualAI />} />
        <Route path="/manual-design" element={<ManualDesign />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/subscribe/:plan" element={<Payment />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/my-profile" element={<ProfilePage />} />
        <Route path="/settings" element={<Navigate to="/my-profile" replace />} />
        <Route path="/notifications" element={<UserNotifications />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* 🔐 ADMIN ROUTE */}
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}
