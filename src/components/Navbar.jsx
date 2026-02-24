import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <>
      <style>{`
        .navbar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          z-index: 50;
          background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
          backdrop-filter: blur(6px);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          box-sizing: border-box;
        }

        /* LEFT AREA */
        .nav-left {
          display: flex;
          align-items: center;
        }

        .nav-logo-img {
          height: 28px;
          margin-right: 14px;
          cursor: pointer;
        }

        .nav-left a {
          margin-right: 18px;
          color: white;
          text-decoration: none;
          font-size: 13px;
          opacity: 0.9;
          position: relative;
        }

        /* Center logo text */
        .nav-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .nav-logo {
          font-size: 20px;
          font-weight: 600;
          color: white;
          letter-spacing: 1px;
          text-decoration: none;
        }

        /* RIGHT — IMAGE STYLE SIGN IN BUTTON */
        .nav-right a {
          background: #ffffff;
          color: #000000;
          padding: 5px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          text-decoration: none;
          border: 1px solid rgba(0,0,0,0.2);
          line-height: 1;
        }

        .nav-right a:hover {
          background: #f3f3f3;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .navbar-overlay {
            padding: 0 20px;
          }
          .nav-left a {
            margin-right: 12px;
            font-size: 12px;
          }
          .nav-logo {
            font-size: 18px;
          }
          .nav-logo-img {
            height: 24px;
          }
        }
      `}</style>

      <nav className="navbar-overlay">
        <div className="nav-left">
          <Link to="/">
            <img
              src="/logo.png"
              alt="Iconic Interiors Logo"
              className="nav-logo-img"
            />
          </Link>

          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/pricing">Prices</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="nav-center">
          <Link to="/" className="nav-logo">Iconic Interiors</Link>
        </div>

        <div className="nav-right">
          <Link to="/signin">Sign In</Link>
        </div>
      </nav>
    </>
  )
}