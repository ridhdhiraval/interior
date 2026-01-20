import React from "react";

/*
  RoomFeatures Component
  ---------------------
  Displays feature sections for an interior design platform.
  Includes visual hierarchy, motion effects, and perception-based UI principles.
*/

export default function RoomFeatures() {
  return (
    <>
      {/* ================= INLINE CSS ================= */}
      <style>{`
        /* Base Section Styling */
        .features-section {
          padding: 80px 8%;
          background: #f8f8f8;
          font-family: "Segoe UI", sans-serif;
          scroll-behavior: smooth;
        }

        /* Section Title */
        .features-title {
          text-align: center;
          font-size: 42px;
          font-weight: 600;
          color: #333;
          margin-bottom: 80px;
        }

        /* Feature Row Layout */
        .feature-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          margin-bottom: 100px;

          /* Motion & perception */
          opacity: 0;
          transform: translateY(40px);
          animation: fadeUp 0.9s ease-out forwards;
        }

        .feature-row:nth-of-type(odd) {
          animation-delay: 0.15s;
        }

        .feature-row:nth-of-type(even) {
          animation-delay: 0.3s;
        }

        /* Reverse Layout */
        .feature-row.reverse {
          direction: rtl;
        }

        .feature-row.reverse > * {
          direction: ltr;
        }

        /* Text Content */
        .feature-text h3 {
          font-size: 28px;
          color: #222;
          margin-bottom: 20px;
          letter-spacing: 0.2px; /* Visual priority */
          transition: transform 0.35s ease;
        }

        .feature-text p {
          font-size: 16px;
          line-height: 1.7;
          color: #555;
          margin-bottom: 16px;
          max-width: 520px; /* Reading comfort */
        }

        .feature-text a {
          color: #7cb342;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
        }

        .feature-text a:hover {
          text-decoration: underline;
        }

        /* Image Container */
        .feature-image {
          background: #f8f8f8;
          padding: 0;
          position: relative;
        }

        .feature-image img {
          width: 100%;
          display: block;
          background: #f8f8f8;
          border-radius: 0;
          box-shadow: none;
          mix-blend-mode: multiply;
          transition: transform 0.6s ease;
        }

        /* Hover Microinteractions */
        .feature-row:hover .feature-text h3 {
          transform: translateX(4px);
        }

        .feature-row:hover .feature-image img {
          transform: scale(1.015);
        }

        /* Fade-up Animation */
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 900px) {
          .feature-row {
            grid-template-columns: 1fr;
            text-align: center;
            animation-delay: 0s;
          }

          .feature-row.reverse {
            direction: ltr;
          }

          .feature-text p {
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>

      {/* ================= CONTENT ================= */}
      <section className="features-section">
        <h2 className="features-title">Program Features</h2>

        {/* FEATURE 1 */}
        <div className="feature-row">
          <div className="feature-text">
            <h3>Design your home in a smart 2D layout</h3>
            <p>
              Our simple and intuitive design tools help you plan your home
              layout with accuracy and ease.
            </p>
            <p>
              Customize rooms, adjust wall sizes, and experiment with
              different layouts to match your living style.
            </p>
            <a href="#">Turn your blueprint into a 3D design →</a>
          </div>
          <div className="feature-image">
            <img src="/floor-plan-2.png" alt="2D home layout" />
          </div>
        </div>

        {/* FEATURE 2 */}
        <div className="feature-row reverse">
          <div className="feature-text">
            <h3>Draw directly on your floor plan</h3>
            <p>
              Upload your existing blueprint or floor plan and start designing
              instantly without recreating everything from scratch.
            </p>
            <p>
              Outline rooms, walls, and spaces easily and prepare your home
              for realistic 3D interior design.
            </p>
          </div>
          <div className="feature-image">
            <img src="/floor-plan-3.png" alt="Blueprint to 3D design" />
          </div>
        </div>

        {/* FEATURE 3 */}
        <div className="feature-row">
          <div className="feature-text">
            <h3>Add windows and doors</h3>
            <p>
              Access a wide range of window and door models, including arches,
              columns, and other structural components.
            </p>
            <p>
              Easily place and adjust elements to reflect real architectural
              constraints.
            </p>
          </div>
          <div className="feature-image">
            <img src="/windows-doors.png" alt="Windows and doors" />
          </div>
        </div>

        {/* FEATURE 4 */}
        <div className="feature-row reverse">
          <div className="feature-text">
            <h3>Select finishing materials</h3>
            <p>
              Experiment with thousands of wall, floor, and ceiling finishes
              including tiles, wood, stone, and wallpapers.
            </p>
            <p>
              Preview material combinations instantly within your space.
            </p>
          </div>
          <div className="feature-image">
            <img src="/finishing-materials.png" alt="Finishing materials" />
          </div>
        </div>

        {/* FEATURE 5 */}
        <div className="feature-row">
          <div className="feature-text">
            <h3>Arrange furniture and decorative objects</h3>
            <p>
              Choose from hundreds of furniture and decor items with flexible
              customization options.
            </p>
            <p>
              Resize, reposition, and combine elements to create unique interiors.
            </p>
          </div>
          <div className="feature-image">
            <img src="/furniture-decor.png" alt="Furniture and decor" />
          </div>
        </div>

        {/* FEATURE 6 */}
        <div className="feature-row reverse">
          <div className="feature-text">
            <h3>Different view modes in 3D</h3>
            <p>
              Switch between drawing, 2D, 3D, and first-person views during
              the design process.
            </p>
            <p>
              Walk through rooms and evaluate results in real scale.
            </p>
          </div>
          <div className="feature-image">
            <img src="/3d-view-modes.png" alt="3D view modes" />
          </div>
        </div>
      </section>
    </>
  );
}
