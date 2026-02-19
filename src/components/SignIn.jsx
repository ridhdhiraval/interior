import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignIn = () => {

  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="auth-page">

      <style>{`

        /* FULL PAGE */
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          font-family: 'Inter', sans-serif;
          padding: 40px 20px;
        }

        /* MAIN CARD */
        .auth-card {
          width: 100%;
          max-width: 1000px;
          background: #fefaf2;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
        }

        /* LEFT IMAGE */
        .left-section {
          flex: 1;
          background-image: url("/sofa.png"); /* Put sofa.png inside public folder */
          background-size: cover;
          background-position: center;
          min-height: 520px;
        }

        /* RIGHT FORM SECTION */
        .right-section {
          flex: 1;
          padding: 40px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .logo {
          font-size: 26px;
          font-weight: 800;
          text-align: center;
          color: #2c3e50;
          text-decoration: none;
          margin-bottom: 5px;
        }

        .subtitle {
          text-align: center;
          margin-bottom: 25px;
          color: #555;
          font-size: 16px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 6px;
          color: #777;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          background: #fff;
          font-size: 14px;
          box-sizing: border-box;
          transition: 0.3s;
        }

        .form-group input:focus {
          border-color: #4c6ef5;
          outline: none;
          box-shadow: 0 0 0 4px rgba(76,110,245,0.1);
        }

        .forgot-pass {
          text-align: right;
          font-size: 13px;
          color: #4c6ef5;
          margin-bottom: 18px;
          cursor: pointer;
        }

        .auth-btn {
          width: 100%;
          padding: 14px;
          background: #4c6ef5;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .auth-btn:hover {
          background: #364fc7;
          transform: translateY(-2px);
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 25px 0;
          font-size: 13px;
          color: #aaa;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #ddd;
        }

        .divider span {
          padding: 0 10px;
        }

        .social-btn {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 15px;
          transition: 0.3s;
        }

        .social-btn:hover {
          background: #f9f9f9;
        }

        .toggle-text {
          text-align: center;
          font-size: 14px;
          margin-top: 10px;
        }

        .toggle-text span {
          color: #4c6ef5;
          font-weight: 600;
          cursor: pointer;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .auth-card {
            flex-direction: column;
          }

          .left-section {
            height: 250px;
          }

          .right-section {
            padding: 30px;
          }
        }

      `}</style>

      <div className="auth-card">

        {/* LEFT IMAGE */}
        <div className="left-section"></div>

        {/* RIGHT FORM */}
        <div className="right-section">

          <Link to="/" className="logo">ICONIC INTERIORS</Link>

          <div className="subtitle">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </div>

          <form onSubmit={(e) => e.preventDefault()}>

            {isSignUp && (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Komal Mishra" required />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="name@company.com" required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>

            {!isSignUp && (
              <div className="forgot-pass">Forgot password?</div>
            )}

            <button className="auth-btn">
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>

          </form>

          <div className="divider">
            <span>OR CONTINUE WITH</span>
          </div>

          <button className="social-btn">Continue with Google</button>

          <div className="toggle-text">
            {isSignUp
              ? "Already have an account? "
              : "Don't have an account? "}
            <span onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Sign In" : "Create one for free"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignIn;
