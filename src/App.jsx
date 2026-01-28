import { Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar"
import BeforeAfterHero from "./components/BeforeAfter"
import VirtualAI from "./components/virtualai"
import AIWorkflow from "./components/AIWorkflow"
import WhatIsSection from "./components/WhatIsSection"
import RoomOptions from "./components/RoomOptions"
import RoomFeatures from "./components/RoomFeatures"
import ManualDesign from "./components/ManualDesign"




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
            <RoomOptions />
            <RoomFeatures/>
          </>
        } />
        <Route path="/virtualai" element={<VirtualAI />} />
        <Route path="/manual-design" element={<ManualDesign />} />
      </Routes>
    </>
  )
}
