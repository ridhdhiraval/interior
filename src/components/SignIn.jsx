// React aur useState hook import kar rahe hain
import React, { useState } from 'react';

// React Router ka Link component (future navigation ke liye)
import { Link } from 'react-router-dom';

const SignIn = () => {

  // State banayi hai login aur signup toggle ke liye
  const [isSignUp, setIsSignUp] = useState(false);

  return (

    // Main outer container
    <div className="auth-page">

      {/* Internal CSS styling */}
      <style>{`

        /* Full page background styling */
        .auth-page {
          min-height: 100vh; /* Full screen height */
          display: flex; /* Flexbox layout */
          align-items: center; /* Vertical center */
          justify-content: center; /* Horizontal center */
          background: #183642; /* Background color */
          font-family: 'Inter', sans-serif; /* Font style */
          padding: 30px; /* Outer spacing */
        }

        /* Main card container (image + form) */
        .auth-container {
          width: 100%;
          max-width: 1100px; /* Maximum width */
          display: flex; /* Image and form side by side */
          border-radius: 20px; /* Rounded corners */
          overflow: hidden; /* Hide overflow outside radius */
          box-shadow: 0 20px 50px rgba(0,0,0,0.4); /* Shadow effect */
        }

        /* LEFT IMAGE SECTION */
        .left-section {
          flex: 1; /* Equal width */
          background: url("/sofa.jpg") center/cover no-repeat; /* Background image */
          min-height: 550px; /* Minimum height */
        }

        /* RIGHT FORM SECTION */
        .right-section {
          flex: 1; /* Equal width */
          background: #e8dfd3; /* Beige background */
          padding: 60px; /* Inner spacing */
          display: flex;
          flex-direction: column; /* Vertical layout */
          justify-content: center; /* Center content vertically */
        }

        /* Logo text styling */
        .logo {
          font-size: 26px;
          font-weight: 800;
          text-align: center;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }

        /* Title styling */
        .title {
          text-align: center;
          font-size: 20px;
          margin-bottom: 30px;
        }

        /* Form group spacing */
        .form-group {
          margin-bottom: 20px;
        }

        /* Label styling */
        .form-group label {
          font-size: 14px;
          font-weight: 600;
          display: block;
          margin-bottom: 8px;
          color: #555;
        }

        /* Input field styling */
        .form-group input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          background: #f2f2f2;
          font-size: 14px;
        }

        /* Input focus effect */
        .form-group input:focus {
          outline: none;
          border-color: #4a6cf7;
          background: #fff;
        }

        /* Forgot password link */
        .forgot {
          text-align: right;
          font-size: 13px;
          color: #4a6cf7;
          margin-bottom: 20px;
          cursor: pointer;
        }

        /* Button styling */
        .btn {
          width: 100%;
          padding: 14px;
          background: #4a6cf7;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          transition: 0.3s ease;
        }

        /* Button hover effect */
        .btn:hover {
          background: #3655d1;
        }

        /* Bottom signup/login text */
        .bottom-text {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
        }

        /* Clickable toggle text */
        .bottom-text span {
          color: #4a6cf7;
          cursor: pointer;
          font-weight: 600;
        }

        /* Responsive for mobile */
        @media (max-width: 768px) {

          .auth-container {
            flex-direction: column; /* Stack vertically */
          }

          .left-section {
            height: 250px; /* Smaller image on mobile */
          }

          .right-section {
            padding: 40px;
          }
        }

      `}</style>

      {/* Main card container */}
      <div className="auth-container">

        {/* LEFT IMAGE SECTION */}
        <div className="left-section"></div>

        {/* RIGHT FORM SECTION */}
        <div className="right-section">

          {/* Website Logo */}
          <div className="logo">ICONIC INTERIORS</div>

          {/* Dynamic title based on login/signup */}
          <div className="title">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </div>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()}>

            {/* Show Full Name only in Signup mode */}
            {isSignUp && (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Komal Mishra" required />
              </div>
            )}

            {/* Email field */}
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="name@email.com" required />
            </div>

            {/* Password field */}
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>

            {/* Show forgot password only in login mode */}
            {!isSignUp && (
              <div className="forgot">Forgot password?</div>
            )}

            {/* Submit button */}
            <button type="submit" className="btn">
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>

          </form>

          {/* Toggle between login and signup */}
          <div className="bottom-text">
            {isSignUp
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
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
