import { useRef, useState } from "react"

export default function BeforeAfterHero() {
  const ref = useRef(null)
  const [pos, setPos] = useState(60)
  const [drag, setDrag] = useState(false)
  

  // 🔑 NEW: room images state (default same as tumhara)
  const [images, setImages] = useState({
    before: "/before.jpg",
    after: "/after bedroom.png",
  })

  const [activeRoom, setActiveRoom] = useState("Bedroom")
  const update = (x) => {
    const rect = ref.current.getBoundingClientRect()
    let p = ((x - rect.left) / rect.width) * 100
    p = Math.max(0, Math.min(100, p))
    setPos(p)
  }

  // 🔑 Room tabs data (exact RoomTabs.jsx se)
  const rooms = [
    {
      name: "Kitchen",
      thumb: "/thumb-kitchen.jpg",
      before: "/after-kitchen.jpg",
      after: "/before-kitchen.jpg",
    },
    {
      name: "Living Room",
      thumb: "/thumb-living.jpg",
      before: "/before-Living Room.jpg",
      after: "/after-Living Room.png",
    },
    {
      name: "Bedroom",
      thumb: "/thumb-bedroom.jpg",
      before: "/after bedroom.png",
      after: "/before.jpg",
    },
    {
      name: "Bathroom",
      thumb: "/thumb-bathroom.jpg",
      before: "/after bathroom.png",
      after: "/before-bathroom.jpg",
    },
  ]

  return (
    <>
      {/* ================= CSS (MERGED) ================= */}
      <style>{`
        /* ===== HERO ===== */

        .hero-full {
          position: relative;
          width: 100%;
          height: 100vh;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          cursor: ew-resize;
        }
 
        /* subtle dark layer over images so white text/buttons stay readable */
        .hero-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.32);
          z-index: 3;
          pointer-events: none;
        }
        .hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }
        
        .hero-before {
          z-index: 2;
        }

        .hero-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: white;
          z-index: 4;
        }

        .hero-handle {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: white;
          color: black;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          box-shadow: 0 0 15px rgba(0,0,0,0.4);
        }

        .hero-overlay {
          position: absolute;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          color: white;
          z-index: 6;
          max-width: 720px;
        }

        .hero-actions {
          margin-top: 20px;
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .hero-btn {
          padding: 12px 28px;
          border-radius: 999px;
          font-size: 15px;
          border: none;
          cursor: pointer;
        }

        .hero-btn.primary {
          background: white;
          color: black;
        }

        .hero-btn.ghost {
          background: transparent;
          color: white;
          border: 1px solid rgba(255,255,255,0.6);
        }

        .hero-label {
          position: absolute;
          top: 20px;
          padding: 6px 14px;
          background: rgba(0,0,0,0.55);
          color: white;
          font-size: 14px;
          border-radius: 20px;
          z-index: 7;
        }

        .hero-label.left { left: 20px; }
        .hero-label.right { right: 20px; }

        /* ===== ROOM TABS ===== */

        .room-tabs {
          background: #ffffff;
          padding: 40px 0 60px;
        }

        .room-tabs-inner {
          max-width: 1200px;
          margin: auto;
          display: flex;
          gap: 22px;
          justify-content: center;
        }

        .room-card {
          width: 260px;
          border-radius: 16px;
          overflow: hidden;
          background: #f6f6f6;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .room-card img {
          width: 100%;
          height: 170px;
          object-fit: cover;
          display: block;
        }

        .room-card p {
          text-align: center;
          padding: 12px 0;
          font-size: 16px;
          font-weight: 500;
          background: #eae6df;
        }

        .room-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 35px rgba(0,0,0,0.18);
        }

        .room-card.active {
        outline: 2px solid #6c63ff;
        box-shadow: 0 0 0 3px rgba(108,99,255,0.25);
     }

      `}</style>

      {/* ================= HERO ================= */}
      <section className="hero-full">
        <div
          ref={ref}
          className="hero-bg"
          onMouseDown={(e) => {
            setDrag(true)
            update(e.clientX)
          }}
          onMouseMove={(e) => drag && update(e.clientX)}
          onMouseUp={() => setDrag(false)}
          onMouseLeave={() => setDrag(false)}
        >
          <img src={images.after} className="hero-img" />
          <img
            src={images.before}
            className="hero-img hero-before"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          />

          <div className="hero-line" style={{ left: `${pos}%` }} />
          <div className="hero-handle" style={{ left: `${pos}%` }}>⇆</div>

          <div className="hero-overlay">
            <h1>See Your Room Transform</h1>
            <p>
              Upload a photo and get instant redesigns, virtual staging,
              or fresh inspiration with AI.
            </p>
            <div className="hero-actions">
              <button className="hero-btn primary">Get Started</button>
              <button className="hero-btn ghost">Learn how it works →</button>
            </div>
          </div>

          <span className="hero-label left">After</span>
          <span className="hero-label right">Before</span>
        </div>
      </section>

      {/* ================= ROOM TABS ================= */}
      <section className="room-tabs">
        <div className="room-tabs-inner">
          {rooms.map((room, i) => (
            <div
              key={i}
              className={`room-card ${activeRoom === room.name ? "active" : ""}`}

onClick={() => {
  setImages({
    before: room.before,
    after: room.after,
  })
  setActiveRoom(room.name) // active card
  setPos(60)               // slider reset
}}
            >
              <img src={room.thumb} alt={room.name} />
              <p>{room.name}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
