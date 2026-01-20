import Navbar from "./components/Navbar"
import BeforeAfterHero from "./components/BeforeAfter"
import ModernMinimalist from "./components/ModernMinimalist";

import AIWorkflow from "./components/AIWorkflow"
import WhatIsSection from "./components/WhatIsSection"
import RoomOptions from "./components/RoomOptions"
import RoomFeatures from "./components/RoomFeatures"



export default function App() {
  return (
    <>
      <Navbar />
      <BeforeAfterHero />   {/* Hero + cards */}
            <ModernMinimalist />

      <AIWorkflow />   
      <WhatIsSection />
      <RoomOptions />
      <RoomFeatures/>
    </>
  )
}
