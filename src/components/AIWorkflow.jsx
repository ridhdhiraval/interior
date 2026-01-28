import { useEffect, useRef } from "react";

export default function AIWorkflow() {
  const sectionRef = useRef(null);

  // Fade-in on scroll (simple & human)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
  }, []);

  return (
    <>
      {/* ===== STYLE INSIDE SAME FILE ===== */}
      <style>{`
        .ai-section {
          min-height: 100vh;
          scroll-snap-align: start;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #f7f8ff, #ffffff);
          opacity: 0;
          transform: translateY(60px);
          transition: all 0.9s ease;
          margin-top: 70px;
        }

        .ai-section.show {
          opacity: 1;
          transform: translateY(0);
        }

        .ai-container {
          max-width: 1200px;
          margin: auto;
          padding: 60px 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }

        /* LEFT IMAGE */
        .ai-visual img {
          width: 100%;
          border-radius: 22px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.18);
          transform: perspective(1000px) rotateY(-6deg);
          transition: all 0.6s ease;
        }

        .ai-visual img:hover {
          transform: perspective(1000px) rotateY(0deg) scale(1.03);
        }

        /* RIGHT CONTENT */
        .ai-tag {
          font-size: 12px;
          letter-spacing: 2px;
          color: #777;
        }

        .ai-content h2 {
          font-size: 44px;
          margin: 12px 0 28px;
          line-height: 1.2;
        }

        .ai-steps {
          display: flex;
          flex-direction: column;
          gap: 26px;
        }

        .step {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          transition: transform 0.3s ease;
        }

        .step:hover {
          transform: translateX(8px);
        }

        .step span {
          font-size: 20px;
          color: #aaa;
        }

        .step h4 {
          margin: 0;
          font-size: 18px;
        }

        .step p {
          margin: 6px 0 0;
          color: #666;
          font-size: 15px;
        }

        /* BUTTON */
        .ai-btn {
          margin-top: 40px;
          padding: 14px 34px;
          border-radius: 30px;
          border: none;
          background: #111;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .ai-btn:hover {
          background: #6c63ff;
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(108,99,255,0.35);
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .ai-container {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .step {
            justify-content: center;
          }
        }
      `}</style>

      {/* ===== SECTION ===== */}
      <section ref={sectionRef} className="ai-section">
        <div className="ai-container">

          {/* LEFT */}
          <div className="ai-visual">
            <img
              src="/ai-room-ui.png"  // put image in public folder
              alt="AI Room Designer"
            />
          </div>

          {/* RIGHT */}
          <div className="ai-content">
            <span className="ai-tag">RESTYLE YOUR SPACE</span>

            <h2>
              Effortless Room Design <br /> with AI
            </h2>

            <div className="ai-steps">
              <div className="step">
                <span>01</span>
                <div>
                  <h4>Upload and analyze</h4>
                  <p>Upload a room photo and let AI understand layout instantly.</p>
                </div>
              </div>

              <div className="step">
                <span>02</span>
                <div>
                  <h4>Choose your style</h4>
                  <p>Select curated styles or customize every detail.</p>
                </div>
              </div>

              <div className="step">
                <span>03</span>
                <div>
                  <h4>Chat with AI</h4>
                  <p>Ask AI to change walls, lighting, furniture or mood.</p>
                </div>
              </div>
            </div>

            <button className="ai-btn">Try it now</button>
          </div>

        </div>
      </section>
    </>
  );
}
