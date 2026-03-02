import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <style>{`
        .about-page {
          padding-top: 100px;
          background: #fff;
          color: #333;
        }

        .about-hero {
          height: 400px;
          background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/living-room.jpg');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
        }

        .about-hero h1 {
          font-size: 48px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .about-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 80px 20px;
        }

        .about-section {
          margin-bottom: 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .about-section.reverse {
          direction: rtl;
        }

        .about-section.reverse .text-content {
          direction: ltr;
        }

        .text-content h2 {
          font-size: 32px;
          margin-bottom: 20px;
          color: #2c3e50;
        }

        .text-content p {
          font-size: 16px;
          line-height: 1.8;
          color: #666;
          margin-bottom: 20px;
        }

        .about-img {
          width: 100%;
          height: 350px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }

        .stats-section {
          background: #f9fbff;
          padding: 80px 0;
          text-align: center;
        }

        .stats-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .stat-item h3 {
          font-size: 40px;
          color: #3498db;
          margin-bottom: 10px;
        }

        .stat-item p {
          font-size: 14px;
          color: #777;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .about-section {
            grid-template-columns: 1fr;
          }
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="about-hero">
        <h1>Redefining Interior Design</h1>
      </div>

      <div className="about-content">
        <div className="about-section">
          <div className="text-content">
            <h2>Our Vision</h2>
            <p>At Iconic Interiors, we believe that everyone deserves to live in a space that reflects their personality and inspires their daily life. We combine cutting-edge AI technology with professional design principles to make high-end interior design accessible to everyone.</p>
            <p>Our platform allows you to visualize your dream home in seconds, removing the guesswork and uncertainty from the renovation process.</p>
          </div>
          <img src="/after bedroom.png" alt="Our Vision" className="about-img" />
        </div>

        <div className="about-section reverse">
          <div className="text-content">
            <h2>Expert Craftsmanship</h2>
            <p>While we leverage technology, we never lose sight of the human element. Our team consists of seasoned interior designers who curate every element of our AI's knowledge base, ensuring that every suggestion is both beautiful and functional.</p>
            <p>From modern minimalism to classic elegance, we provide the tools you need to create a space that is uniquely yours.</p>
          </div>
          <img src="/chair.jpg" alt="Expertise" className="about-img" />
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>50k+</h3>
            <p>Users Globally</p>
          </div>
          <div className="stat-item">
            <h3>120k+</h3>
            <p>Designs Created</p>
          </div>
          <div className="stat-item">
            <h3>15+</h3>
            <p>Design Styles</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>AI Support</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
