import { useEffect, useRef } from "react";

export default function WhatIsSection() {
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && e.target.classList.add("show"),
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
  }, []);

  return (
    <>
      <style>{`
        .what-section {

          /* ⚪ Background color */
          background: #ffffff;

          padding: 120px 20px;
          opacity: 0;
          transform: translateY(60px);
          transition: all 0.9s ease;
        }

        .what-section.show {
          opacity: 1;
          transform: translateY(0);
        }

        .what-container {
          max-width: 1200px;
          margin: auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 80px;
          align-items: center;
        }

        .what-title {
          font-size: 42px;
          font-weight: 500;
          margin-bottom: 24px;
          color: #333;
        }

        .what-desc {
          font-size: 16px;
          line-height: 1.8;
          color: #666;
          max-width: 520px;
        }

        .what-desc p {
          margin-bottom: 16px;
        }

        .what-image img {
         width: 100%;
         border-radius: 0;
         box-shadow: none;
         filter: drop-shadow(0 25px 40px rgba(0,0,0,0.15));
         transform: perspective(1200px) rotateX(6deg) rotateY(-8deg);
         transition: transform 0.6s ease;
        }
 
        .what-image img:hover {
        transform: perspective(1200px) rotateX(0deg) rotateY(0deg);
        }

        .what-image img:hover {
          transform: perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1.03);
        }

        .what-image {
        background: #ffffff; 
        }


        @media (max-width: 900px) {
        .what-container {
        padding-top: 20px;
        }

          .what-desc {
            margin: auto;
          }
        }
      `}</style>

      <section ref={ref} className="what-section">
        <div className="what-container">

          {/* LEFT CONTENT */}
          <div>
            <h2 className="what-title">What is RoomAI?</h2>

            <div className="what-desc">
              <p>Simple and playful interior design software.</p>
              <p>
                Online-based tool with an intuitive interface and powerful
                features to design and decorate interiors.
              </p>
              <p>
                Create realistic visuals and experiment freely using AI.
              </p>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="what-image">
            <img
              src="/floor-plan.png"
              alt="3D Interior Floor Plan"
            />
          </div>

        </div>
      </section>
    </>
  );
}
