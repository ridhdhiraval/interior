import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">

          {/* Logo Section */}
          <div className="footer-section brand">
            <Link to="/">
              <img
                src="/logo.png"
                alt="Iconic Interior Logo"
                className="footer-logo"
              />
            </Link>
            <p>
              Creating modern, elegant, and functional interior designs for
              beautiful living spaces.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/virtualai">AI Interior Design</Link></li>
              <li><Link to="/manual-design">Manual Design</Link></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Iconic Interior. All rights reserved.
        </div>
      </footer>

      <style>{`
        .footer {
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          color: #ffffff;
          padding: 60px 20px 20px;
        }

        .footer-container {
          max-width: 1200px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 40px;
        }

        .brand {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .footer-logo {
          width: 160px;
          object-fit: contain;
        }

        .footer-section h3 {
          margin-bottom: 15px;
        }

        .footer-section h3::after {
          content: "";
          width: 40px;
          height: 3px;
          background: #ffb703;
          display: block;
          margin-top: 6px;
          border-radius: 5px;
        }

        .footer-section p {
          font-size: 14px;
          line-height: 1.6;
          color: #e0e0e0;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
        }

        .footer-section ul li {
          margin-bottom: 10px;
          cursor: pointer;
          color: #dcdcdc;
          transition: all 0.3s ease;
        }

        .footer-section ul li a {
          color: inherit;
          text-decoration: none;
          display: block;
          width: 100%;
        }

        .footer-section ul li:hover {
          color: #ffb703;
          transform: translateX(6px);
        }

        .footer-bottom {
          text-align: center;
          margin-top: 40px;
          font-size: 13px;
          color: #cfcfcf;
          border-top: 1px solid rgba(255,255,255,0.2);
          padding-top: 20px;
        }
      `}</style>
    </>
  );
}