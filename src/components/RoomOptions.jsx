import React from "react";

export default function RoomOptions() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin:0; font-family: Inter, system-ui; }

        .wrapper {
          background:#fff;
          padding:60px 20px;
          display:flex;
          justify-content:center;
          margin-top: 70px;
        }

        /* EXACT COLLAGE GRID */
        .grid {
          width:1200px;
          display:grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 240px 240px 240px;
          gap:24px;
        }

        .card {
          position:relative;
          border-radius:28px;
          overflow:hidden;
          background:#000;
        }

        .card img {
          width:100%;
          height:100%;
          object-fit:cover;
        }

        /* ===== POSITIONS & SIZES ===== */

        .mondrian {
          grid-column:1;
          grid-row:1;
        }

        .nirnia-center {
          grid-column:2;
          grid-row:1 / 3; /* TALL */
        }

        .artex {
          grid-column:3;
          grid-row:1;
        }

        /* 🔥 BRERA NOW SAME SIZE AS NIRNIA */
        .brera {
          grid-column:1;
          grid-row:2 / 4; /* TALL */
        }

        .alea {
          grid-column:2;
          grid-row:3;
        }

        .nirnia-right {
          grid-column:3;
          grid-row:2 / 4; /* TALL */
        }

        /* TEXT */
        .label {
          position:absolute;
          bottom:18px;
          left:18px;
          color:#fff;
          font-size:20px;
          font-weight:600;
          text-shadow:0 6px 20px rgba(0,0,0,.6);
        }

        .arrow {
          position:absolute;
          bottom:18px;
          right:18px;
          width:36px;
          height:36px;
          background:#fff;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight:700;
        }

        /* MOBILE */
        @media (max-width:900px) {
          .grid {
            grid-template-columns:1fr;
            grid-template-rows:auto;
          }
          .card {
            grid-column:auto !important;
            grid-row:auto !important;
            height:220px;
          }
        }
      `}</style>

      <div className="wrapper">
        <div className="grid">

          <div className="card mondrian">
            <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511" />
            <div className="label">BEDROOM</div>
            <div className="arrow">↗</div>
          </div>

          <div className="card nirnia-center">
            <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6" />
            <div className="label">Living room</div>
            <div className="arrow">↗</div>
          </div>

          <div className="card artex">
            <img src="https://images.unsplash.com/photo-1600566752355-35792bedcfea" />
            <div className="label">KITCHEN</div>
            <div className="arrow">↗</div>
          </div>

          <div className="card brera">
            <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f" />
            <div className="label">BATHROOM</div>
            <div className="arrow">↗</div>
          </div>

          <div className="card alea">
            <img src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0" />
            <div className="label">GARDEN</div>
            <div className="arrow">↗</div>
          </div>

          <div className="card nirnia-right">
            <img src="https://images.unsplash.com/photo-1615873968403-89e068629265" />
            <div className="label">Dining Room</div>
            <div className="arrow">↗</div>
          </div>

        </div>
      </div>
    </>
  );
}
