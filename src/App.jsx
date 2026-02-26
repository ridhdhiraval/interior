import { Routes, Route } from 'react-router-dom'
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



export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <BeforeAfterHero />   {/* Hero + cards */}

            <AIWorkflow />   
            <WhatIsSection />
            <RoomFeatures/>
            <Footer/>
          </>
        } />
        <Route path="/virtualai" element={<VirtualAI />} />
        <Route path="/manual-design" element={<ManualDesign />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/subscribe/:plan" element={<Payment />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  )
}
