// React aur useState hook import kar rahe hain
import React, { useState } from 'react';

// React Router ka Link component (future navigation ke liye)
import { Link } from 'react-router-dom';

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="signin-page">
      <style>{`
        .signin-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }

        .signin-card {
          background: white;
          width: 100%;
          max-width: 450px;
          padding: 50px;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          text-align: center;
          transition: all 0.4s ease;
        }

        .signin-logo {
          font-size: 28px;
          font-weight: 800;
          color: #2c3e50;
          margin-bottom: 10px;
          display: block;
          text-decoration: none;
        }

        .signin-card h2 {
          font-size: 24px;
          color: #333;
          margin-bottom: 30px;
          font-weight: 500;
        }

        /* Form group spacing */
        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }

        /* Label styling */
        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #777;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Input field styling */
        .form-group input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          font-size: 15px;
          transition: 0.3s;
          box-sizing: border-box;
        }

        .form-group input:focus {
          border-color: #3498db;
          background: white;
          outline: none;
          box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
        }

        .forgot-pass {
          display: block;
          text-align: right;
          font-size: 13px;
          color: #3498db;
          text-decoration: none;
          margin-bottom: 25px;
        }

        .signin-btn {
          width: 100%;
          padding: 16px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
          margin-bottom: 25px;
        }

        .signin-btn:hover {
          background: #2980b9;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 30px 0;
          color: #bbb;
          font-size: 14px;
        }

        .divider::before, .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #eee;
        }

        .divider span {
          padding: 0 15px;
        }

        .social-signin {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
        }

        .social-btn {
          flex: 1;
          padding: 12px;
          border: 1px solid #eee;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 14px;
          color: #555;
        }

        .social-btn:hover {
          background: #f9f9f9;
          border-color: #ddd;
        }

        .signup-link {
          font-size: 14px;
          color: #777;
        }

        .signup-link span {
          color: #3498db;
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .signin-card {
            padding: 30px;
          }
        }

      `}</style>

      <div className="signin-card">
        <Link to="/" className="signin-logo">ICONIC INTERIORS</Link>
        <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        
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
          
          {!isSignUp && <a href="#" className="forgot-pass">Forgot password?</a>}
          
          <button type="submit" className="signin-btn">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="social-signin">
          <button className="social-btn">
            <img src="https://www.google.com/favicon.ico" width="16" alt="Google" />
            Google
          </button>
          <button className="social-btn">
            <img src="https://github.com/favicon.ico" width="16" alt="GitHub" />
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
