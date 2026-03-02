import React, { useState } from "react";

export default function Auth() {
  const [page, setPage] = useState("login");
  // login | register | forgot | success

  return (
    <div className="wrapper">
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif}

        .wrapper{
          min-height:100vh;
          background:#1f3544;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .card{
          width:1050px;
          height:540px;
          background:#fffaf2;
          border-radius:20px;
          display:flex;
          overflow:hidden;
          box-shadow:0 30px 60px rgba(0,0,0,.4);
        }

        .left{
          width:50%;
          background:url("/interior.jpg") center/cover no-repeat;
        }

        .right{
          width:50%;
          padding:60px 70px;
          display:flex;
          flex-direction:column;
          justify-content:center;
        }

        h1{
          text-align:center;
          font-size:26px;
          margin-bottom:6px;
        }

        h2{
          text-align:center;
          font-size:16px;
          font-weight:500;
          margin-bottom:30px;
        }

        label{
          font-size:14px;
          margin-bottom:6px;
        }

        input{
          width:100%;
          padding:12px;
          margin-bottom:18px;
          border-radius:8px;
          border:1px solid #ddd;
          background:#f1f1f1;
        }

        .btn{
          width:100%;
          padding:14px;
          border:none;
          border-radius:8px;
          background:#4f7cff;
          color:#fff;
          font-size:16px;
          font-weight:600;
          cursor:pointer;
        }

        .link{
          margin-top:16px;
          text-align:center;
          font-size:14px;
          color:#2563eb;
          cursor:pointer;
        }

        .forgot{
          text-align:right;
          font-size:13px;
          color:#2563eb;
          cursor:pointer;
          margin-bottom:20px;
        }

        .divider{
          display:flex;
          align-items:center;
          margin:25px 0;
          font-size:12px;
          color:#999;
        }

        .divider span{
          flex:1;
          height:1px;
          background:#ddd;
        }

        .google{
          border:1px solid #ddd;
          background:#fff;
          padding:12px;
          border-radius:8px;
          display:flex;
          justify-content:center;
          align-items:center;
          gap:10px;
          cursor:pointer;
          margin-bottom:18px;
        }

        /* CENTER SCREENS */
        .center{
          width:520px;
          background:#fff;
          padding:50px 55px;
          border-radius:16px;
          text-align:center;
        }

        .icon{
          width:70px;
          height:70px;
          margin:0 auto 25px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#e6efff;
        }

        .icon.success{
          background:#dcfce7;
        }

        .small{
          font-size:13px;
          color:#666;
          line-height:1.6;
          margin-top:20px;
        }

        .back{
          margin-top:20px;
          cursor:pointer;
          font-size:14px;
        }

        @media(max-width:900px){
          .card{flex-direction:column;height:auto;width:95%}
          .left{height:240px;width:100%}
          .right{width:100%}
        }
      `}</style>

      {/* LOGIN */}
      {page === "login" && (
        <div className="card">
          <div className="left" />
          <div className="right">
            <h1>ICONIC INTERIORS</h1>
            <h2>Welcome Back</h2>

            <label>Email Address</label>
            <input />

            <label>Password</label>
            <input type="password" />

            <div className="forgot" onClick={() => setPage("forgot")}>
              Forgot password?
            </div>

            <div className="divider">
              <span />OR CONTINUE WITH<span />
            </div>

            <div className="google">
              <img src="/google.png" width="18" /> Google
            </div>

            <button className="btn">Sign In</button>

            <div className="link" onClick={() => setPage("register")}>
              Don’t have an account? Create one for free
            </div>
          </div>
        </div>
      )}

      {/* REGISTER */}
      {page === "register" && (
        <div className="card">
          <div className="left" />
          <div className="right">
            <h1>ICONIC INTERIORS</h1>
            <h2>Create Account</h2>

            <label>Full Name</label>
            <input />

            <label>Email Address</label>
            <input />

            <label>Password</label>
            <input type="password" />

            <button className="btn">Sign Up</button>

            <div className="link" onClick={() => setPage("login")}>
              Already have an account? Sign In
            </div>
          </div>
        </div>
      )}

      {/* FORGOT */}
      {page === "forgot" && (
        <div className="center">
          <div className="icon">
            <img src="/mail.png" width="30" />
          </div>

          <h1>Forgot Password?</h1>
          <h2>
            No Worries! Enter your email and we’ll send you a link to reset your
            password.
          </h2>

          <label style={{ textAlign: "left" }}>Email Address</label>
          <input placeholder="Enter your email" />

          <button className="btn" onClick={() => setPage("success")}>
            Send Reset Link
          </button>

          <div className="back" onClick={() => setPage("login")}>
            ← Back To Login
          </div>

          <div className="small">
            Need Help? Contact our support team at <br />
            <span style={{ color: "#2563eb" }}>
              support@iconicinteriors.com
            </span>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {page === "success" && (
        <div className="center">
          <div className="icon success">
            <img src="/check.png" width="30" />
          </div>

          <h1>Email Sent!</h1>
          <h2>
            We've sent a password reset link to your email. Please check your
            inbox.
          </h2>

          <div className="small">
            Didn’t receive the email? Check spam or try again.
          </div>

          <button
            className="btn"
            style={{ background: "#e5e5e5", color: "#333", marginTop: 25 }}
            onClick={() => setPage("login")}
          >
            ← Back To Login
          </button>
        </div>
      )}
    </div>
  );
}