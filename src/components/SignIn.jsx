import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';

export default function Auth() {
  const [page, setPage] = useState("login");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Google login successful, sending to backend...', tokenResponse);
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:5001/api/auth/google", {
          access_token: tokenResponse.access_token
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event('storage'));
        navigate("/");
      } catch (err) {
        console.error('Backend Google login error:', err.response?.data || err.message);
        setError(err.response?.data?.message || "Google login failed on server");
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      setError("Google OAuth failed: Please check your configuration");
    }
  });

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5001/api/auth/forgot-password", { email: forgotEmail });
      setPage("success");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event('storage'));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/api/auth/register", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event('storage'));
      navigate("/"); // Redirect directly to home
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

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
          background:transparent;
          border-radius:20px;
          display:flex;
          overflow:hidden;
          box-shadow:0 30px 60px rgba(0,0,0,.4);
          border:none;
          outline:none;
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
          background:#fffaf2;
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
            <h1>ICONIC INTERIOR</h1>
            <h2>Welcome Back</h2>

            {error && <div style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>{error}</div>}

            <form onSubmit={handleLogin}>
              <label>Email Address</label>
              <input 
                name="email" 
                type="email" 
                required 
                value={formData.email} 
                onChange={handleChange} 
              />

              <label>Password</label>
              <input 
                name="password" 
                type="password" 
                required 
                value={formData.password} 
                onChange={handleChange} 
              />

              <div className="forgot" onClick={() => setPage("forgot")}>
                Forgot password?
              </div>

              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="divider">
              <span />OR CONTINUE WITH<span />
            </div>

            <div className="google" onClick={() => handleGoogleLogin()}>
              <img src="/google.png" width="18" /> Google
            </div>

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
            <h1>ICONIC INTERIOR</h1>
            <h2>Create Account</h2>

            {error && <div style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>{error}</div>}

            <form onSubmit={handleRegister}>
              <label>Full Name</label>
              <input 
                name="name" 
                required 
                value={formData.name} 
                onChange={handleChange} 
              />

              <label>Email Address</label>
              <input 
                name="email" 
                type="email" 
                required 
                value={formData.email} 
                onChange={handleChange} 
              />

              <label>Password</label>
              <input 
                name="password" 
                type="password" 
                required 
                value={formData.password} 
                onChange={handleChange} 
              />

              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

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

          {error && <div style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>{error}</div>}

          <form onSubmit={handleForgotPassword}>
            <label style={{ textAlign: "left" }}>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
              value={forgotEmail} 
              onChange={(e) => setForgotEmail(e.target.value)}
            />

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="back" onClick={() => setPage("login")}>
            ← Back To Login
          </div>

          <div className="small">
            Need Help? Contact our support team at <br />
            <span style={{ color: "#2563eb" }}>
              support@iconicinterior.com
            </span>
          </div>
        </div>
      )}

      {/* REGISTRATION SUCCESS */}
      {page === "reg-success" && (
        <div className="center">
          <div className="icon success">
            <img src="/check.png" width="30" />
          </div>

          <h1>Registration Successful!</h1>
          <h2>
            Welcome to ICONIC INTERIOR! Your account has been created successfully.
          </h2>

          <button
            className="btn"
            style={{ marginTop: 25 }}
            onClick={() => navigate("/")}
          >
            Go To Home
          </button>
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