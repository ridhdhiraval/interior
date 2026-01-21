// src/Hero.jsx
export default function ModernMinimalist() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
        }

        .hero {
          display: flex;
          gap: 32px;
          padding: 40px 80px;
          background: #f4efe9;
          min-height: unset;
          height: 650px;
          width: 100%;
          max-width: 100%;
          align-items: stretch;
        }

        .hero-left {
          position: relative;
          flex: 1.8;
          border-radius: 32px;
          overflow: hidden;
          min-width: 0;
        }

        .hero-left img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: #fff;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
        }

        .hero-title {
          position: absolute;
          bottom: 24px;
          left: 24px;
          background: #fff;
          padding: 24px 28px;
          border-radius: 24px;
        }

        .hero-title h1 {
          margin: 0;
          font-size: 42px;
          line-height: 1.05;
          font-weight: 800;
        }

        .hero-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .text-card {
          background: #e9e1d6;
          padding: 28px;
          border-radius: 28px;
        }

        .tag {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 999px;
          background: #fff;
          font-size: 12px;
          margin-bottom: 12px;
        }

        .subtitle {
          margin: 0 0 16px;
          font-size: 14px;
          color: #555;
        }

        .text-card h2 {
          margin: 0;
          font-size: 32px;
          font-weight: 800;
        }

        .image-card {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          height: 100%;
        }

        .image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,.6), transparent);
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          color: #3b2a2a;
          position: absolute;
        }

        .tag.dark {
          background: rgba(255,255,255,.2);
          color: #fff;
          width: fit-content;
          margin-bottom: 8px;
        }

        .overlay p {
          margin: 0 0 12px;
          font-size: 14px;
        }

        .arrow {
          align-self: flex-end;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: #000;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .hero {
            flex-direction: column;
          }
        }
.corner-cut{
  position: absolute;
  right: 0;
  bottom: 0;

  width: 90px;
  height: 90px;

  background: #e9e1d6;       /* hero ka bg color */
  border-top-left-radius: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 14px;
  z-index: 5;
}

.arrow{
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;

  background: #000;
  color: #fff;

  font-size: 20px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
}

      `}</style>

      <section className="hero">
        <div className="hero-left">
          <img src="/living-room.jpg" alt="Interior" />
          <span className="badge">Gorgeous Interior</span>

          <div className="hero-title">
            <h1>
              Modern <br /> Minimalist
            </h1>
          </div>
        </div>

        <div className="hero-right">
          <div className="text-card">
            <span className="tag">Aesthetic</span>
            <p className="subtitle">
              Aesthetic furniture where every piece tells a story of style
            </p>
            <h2>Into a gallery of elegance</h2>
          </div>

<div className="image-card">
  <img src="/chair.jpg" alt="Furniture" />

  <div className="overlay">
    <span className="tag dark">Best Furniture</span>
    <p>Indulge in the artistry of everyday living</p>
  </div>

  <div className="corner-cut">
    <button className="arrow">↗</button>
  </div>
</div>
        </div>
      </section>
    </>
  );
}
