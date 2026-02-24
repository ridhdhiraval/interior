import React, { useState } from "react";

const Auth = () => {
  const [mode, setMode] = useState("login"); 
  // login | signup | forgot | success

  return (
    <div className="auth-wrapper">
      <style>{`

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        .auth-wrapper{
          height:100vh;
          background:linear-gradient(to right,#0f2a33,#0c3c44);
          display:flex;
          align-items:center;
          justify-content:center;
          font-family: Arial, Helvetica, sans-serif;
        }

        .auth-card{
          width:1050px;
          height:540px;
          border-radius:20px;
          display:flex;
          overflow:hidden;
          box-shadow:0 30px 60px rgba(0,0,0,0.4);
        }

        /* LEFT IMAGE */
        .left-side{
          width:50%;
          background-image:url("/interior.jpg");
          background-size:cover;
          background-position:center;
          background-repeat:no-repeat;
        }

        /* RIGHT SIDE */
        .right-side{
          width:50%;
          background:#fffaf2;
          padding:60px 70px;
          display:flex;
          flex-direction:column;
          justify-content:center;
        }

        /* FULL WIDTH (Forgot + Success) */
        .full-box{
          width:100%;
          background:#fffaf2;
          padding:80px 140px;
          text-align:center;
        }

        .icon-circle{
          width:80px;
          height:80px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          margin:0 auto 25px auto;
          font-size:32px;
          font-weight:bold;
        }

        .blue-bg{
          background:#dbeafe;
          color:#2563eb;
        }

        .green-bg{
          background:#dcfce7;
          color:#16a34a;
        }

        .title{
          font-weight:700;
          font-size:26px;
          margin-bottom:10px;
        }

        .subtitle{
          font-size:15px;
          color:#555;
          margin-bottom:30px;
          line-height:1.6;
        }

        label{
          font-size:14px;
          margin-bottom:8px;
          display:block;
          text-align:left;
        }

        input{
          width:100%;
          padding:12px;
          border-radius:8px;
          border:1px solid #ddd;
          margin-bottom:20px;
          background:#e9e9e9;
        }

        .main-btn{
          width:100%;
          padding:14px;
          border-radius:8px;
          border:none;
          background:#4f7cff;
          color:white;
          font-size:16px;
          font-weight:600;
          cursor:pointer;
          margin-top:10px;
        }

        .secondary-btn{
          margin-top:20px;
          padding:10px 25px;
          border-radius:8px;
          border:none;
          background:#e5e5e5;
          cursor:pointer;
        }

        .forgot-link{
          text-align:right;
          font-size:12px;
          color:#3b82f6;
          margin-bottom:20px;
          cursor:pointer;
        }

        .support{
          margin-top:25px;
          font-size:13px;
          color:#666;
        }

        @media(max-width:900px){
          .auth-card{
            flex-direction:column;
            height:auto;
            width:95%;
          }

          .left-side{
            width:100%;
            height:250px;
          }

          .right-side{
            width:100%;
            padding:40px;
          }

          .full-box{
            padding:40px;
          }
        }

      `}</style>

      <div className="auth-card">

        {/* LOGIN & SIGNUP */}
        {(mode === "login" || mode === "signup") && (
          <>
            <div className="left-side"></div>

            <div className="right-side">

              <div className="title" style={{textAlign:"center"}}>
                ICONIC INTERIORS
              </div>

              <div className="subtitle" style={{textAlign:"center"}}>
                {mode === "signup" ? "Create Account" : "Welcome Back"}
              </div>

              {mode === "signup" && (
                <>
                  <label>Full Name</label>
                  <input type="text" />
                </>
              )}

              <label>Email Address</label>
              <input type="email" />

              <label>Password</label>
              <input type="password" />

              {mode === "login" && (
                <div
                  className="forgot-link"
                  onClick={() => setMode("forgot")}
                >
                  Forgot password?
                </div>
              )}

              <button className="main-btn">
                {mode === "signup" ? "Sign Up" : "Sign In"}
              </button>

              <div style={{marginTop:"20px", textAlign:"center"}}>
                {mode === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <span
                      style={{color:"#3b82f6", cursor:"pointer"}}
                      onClick={() => setMode("login")}
                    >
                      Sign In
                    </span>
                  </>
                ) : (
                  <>
                    Don’t have an account?{" "}
                    <span
                      style={{color:"#3b82f6", cursor:"pointer"}}
                      onClick={() => setMode("signup")}
                    >
                      Create one for free
                    </span>
                  </>
                )}
              </div>

            </div>
          </>
        )}

        {/* FORGOT PASSWORD */}
        {mode === "forgot" && (
          <div className="full-box">

            <div className="icon-circle blue-bg">✉</div>

            <div className="title">Forgot Password?</div>

            <div className="subtitle">
              No worries! Enter your email address and we’ll send
              you a link to reset your password.
            </div>

            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" />

            <button
              className="main-btn"
              onClick={() => setMode("success")}
            >
              Send Reset Link
            </button>

            <div
              style={{marginTop:"20px", cursor:"pointer"}}
              onClick={() => setMode("login")}
            >
              ← Back To Login
            </div>

            <div className="support">
              Need Help? Contact Our Support Team At <br/>
              support@iconicinteriors.com
            </div>

          </div>
        )}

        {/* SUCCESS SCREEN */}
        {mode === "success" && (
          <div className="full-box">

            <div className="icon-circle green-bg">✓</div>

            <div className="title">Email Sent!</div>

            <div className="subtitle">
              We've sent a password reset link to your email ID.
              Please check your inbox and click the link to reset
              your password.
            </div>

            <div className="subtitle" style={{fontSize:"14px"}}>
              Didn’t receive the email? Check your spam folder or
              try again with a different email address.
            </div>

            <button
              className="secondary-btn"
              onClick={() => setMode("login")}
            >
              ← Back To Login
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default Auth;