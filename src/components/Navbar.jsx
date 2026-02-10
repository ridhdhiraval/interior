export default function Navbar() {
  return (
    <>
      {/* ===== NAVBAR CSS ===== */}
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

        /* Left links */
        .nav-left a {
          margin-right: 18px;
          color: white;
          text-decoration: none;
          font-size: 13px;
          opacity: 0.9;
          position: relative;
          transition: color 0.3s ease;
        }

        /* Hover underline animation */
        .nav-left a::after,
        .nav-right a::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 0%;
          height: 2px;
          background: #ffffff;
          transition: width 0.3s ease;
        }

        .nav-left a:hover::after,
        .nav-right a:hover::after {
          width: 100%;
        }

        .nav-left a:hover,
        .nav-right a:hover {
          color: #ffffff;
        }

        /* Center logo */
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
        }

        /* Right link */
        .nav-right a {
          color: white;
          text-decoration: none;
          font-size: 13px;
          position: relative;
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
        }
      `}</style>
      
      {/* ===== NAVBAR JSX ===== */}
      <nav className="navbar-overlay">
        <div className="nav-left">
          <a href="#">About</a>
          <a href="#">Prices</a>
          <a href="#">For Business</a>
          <a href="#">Blog</a>
          <a href="#">Contact Us</a>
        </div>

        <div className="nav-center">
          <span className="nav-logo">ROOMAI</span>
        </div>

        <div className="nav-right">
          <a href="#">Sign in</a>
        </div>
      </nav>
    </>
  )
}
