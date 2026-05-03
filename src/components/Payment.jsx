import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Payment() {
  const { plan } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [dbPlans, setDbPlans] = useState([]);
  const [settings, setSettings] = useState({ currency: 'INR' });

  useEffect(() => {
    // Redirect if not logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    fetchGlobalData();
  }, [navigate]);

  const fetchGlobalData = async () => {
    try {
      const [settingsRes, plansRes] = await Promise.all([
        axios.get('http://localhost:5001/api/public/settings'),
        axios.get('http://localhost:5001/api/public/plans')
      ]);
      setSettings(settingsRes.data);
      setDbPlans(plansRes.data);
    } catch (err) {
      console.error('Failed to fetch global data', err);
      // Ensure we have some default plans if API fails
      setDbPlans([
        { name: 'STANDARD', monthly: 5.00, yearly: 50.00 },
        { name: 'PRO', monthly: 10.00, yearly: 100.00 }
      ]);
    }
  };

  const getCurrencySymbol = (code) => {
    const symbols = { 'USD': '$', 'INR': '₹', 'EUR': '€', 'GBP': '£' };
    return symbols[code] || code;
  };

  const data = useMemo(() => {
    const normalized = (plan || '').toLowerCase();
    const label = normalized === 'pro' ? 'PRO' : 'STANDARD';
    
    const planInfo = dbPlans.find(p => p.name === label);
    // Use pricing from DB if available, otherwise fallback to defaults from screenshot
    const amount = planInfo ? parseFloat(planInfo.monthly) : (label === 'PRO' ? 10.00 : 5.00);
    
    const upiId = 'iconicinterior@upi';
    return { label, amount, upiId };
  }, [plan, dbPlans]);

  const handlePaymentDone = async () => {
    setLoading(true);
    setMessage('Verifying your payment...');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not logged in. Please sign in again.');
        setLoading(false);
        return;
      }
      await axios.post('http://localhost:5001/api/orders/confirm-upi', {
        plan_type: data.label,
        amount: data.amount
      }, {
        headers: { 'x-auth-token': token }
      });

      // Update local user data
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.plan = data.label;
        localStorage.setItem('user', JSON.stringify(user));
      }

      setIsSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate('/my-profile');
      }, 3000);

    } catch (err) {
      console.error('Payment error detail:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Verification failed. Please ensure you have completed the payment via QR.';
      setMessage(errorMsg);
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="payment-page">
        <style>{`
          .payment-page {
            padding-top: 100px;
            min-height: 100vh;
            background: #f7f9fc;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Inter', sans-serif;
          }
          .success-card {
            background: white;
            width: 100%;
            max-width: 450px;
            padding: 50px 40px;
            border-radius: 24px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          }
          .success-icon {
            width: 80px;
            height: 80px;
            background: #e8f5e9;
            color: #4caf50;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            margin: 0 auto 24px;
          }
          .success-title {
            font-size: 26px;
            font-weight: 800;
            color: #1a1a1a;
            margin-bottom: 12px;
          }
          .success-msg {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .redirect-loader {
            width: 100%;
            height: 4px;
            background: #f0f0f0;
            border-radius: 2px;
            overflow: hidden;
            margin-top: 20px;
          }
          .loader-bar {
            height: 100%;
            background: #4caf50;
            animation: loading 3s linear forwards;
          }
          @keyframes loading {
            0% { width: 0; }
            100% { width: 100%; }
          }
        `}</style>
        <div className="success-card">
          <div className="success-icon">✓</div>
          <div className="success-title">Payment Received!</div>
          <div className="success-msg">
            Your subscription to <strong>{data.label} Plan</strong> is now active. 
            Enjoy your new features!
          </div>
          <div className="redirect-loader">
            <div className="loader-bar"></div>
          </div>
          <p style={{ marginTop: '15px', color: '#999', fontSize: '13px' }}>Redirecting to profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <style>{`
        .payment-page {
          padding-top: 100px;
          min-height: 100vh;
          background: #f7f9fc;
          font-family: 'Inter', sans-serif;
          padding-bottom: 60px;
        }
        .container {
          max-width: 500px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          color: #64748b;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 24px;
          transition: color 0.2s;
        }
        .back-link:hover { color: #1a1a1a; }
        
        .payment-card {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.05);
          padding: 40px;
          text-align: center;
        }
        .plan-badge {
          display: inline-block;
          padding: 6px 16px;
          background: #f1f7ff;
          color: #2196f3;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .amount-display {
          font-size: 36px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 8px;
        }
        .amount-sub {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 32px;
        }
        
        .qr-section {
          background: #f8fafc;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 32px;
          border: 1px solid #f1f5f9;
        }
        .qr-title {
          font-size: 15px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 16px;
        }
        .qr-image-wrapper {
          background: white;
          padding: 16px;
          border-radius: 16px;
          display: inline-block;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          margin-bottom: 16px;
        }
        .upi-id-display {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: #64748b;
          background: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px dashed #cbd5e1;
        }

        .done-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 14px;
          background: #00c853;
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(0, 200, 83, 0.2);
        }
        .done-btn:hover {
          background: #00b34a;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 200, 83, 0.3);
        }
        .done-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .status-msg {
          margin-top: 16px;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
        }
        .msg-info { background: #eff6ff; color: #3b82f6; }
        .msg-error { background: #fef2f2; color: #ef4444; }

        .steps {
          text-align: left;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
        }
        .step-item {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 13px;
          color: #64748b;
        }
        .step-num {
          width: 20px;
          height: 20px;
          background: #e2e8f0;
          color: #475569;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
        }
      `}</style>

      <div className="container">
        <Link to="/pricing" className="back-link">
          ← Back to Pricing
        </Link>

        <div className="payment-card">
          <div className="plan-badge">{data.label} Plan</div>
          <div className="amount-display">{getCurrencySymbol(settings.currency)}{data.amount}</div>
          <div className="amount-sub">per month</div>

          <div className="qr-section">
            <div className="qr-title">Scan QR Code to Pay</div>
            <div className="qr-image-wrapper">
              <img 
                src="/qr-placeholder.jpg" 
                alt="UPI QR Code" 
                width="200" 
                height="200"
                style={{ display: 'block' }}
              />
            </div>
            <div className="upi-id-display">
              ID: {data.upiId}
            </div>
          </div>

          <button 
            className="done-btn"
            onClick={handlePaymentDone}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'I have completed the payment'}
          </button>

          {message && (
            <div className={`status-msg ${message.includes('failed') ? 'msg-error' : 'msg-info'}`}>
              {message}
            </div>
          )}

          <div className="steps">
            <div className="step-item">
              <span className="step-num">1</span>
              <span>Open any UPI App (GPay, PhonePe, Paytm, etc.)</span>
            </div>
            <div className="step-item">
              <span className="step-num">2</span>
              <span>Scan the QR code shown above</span>
            </div>
            <div className="step-item">
              <span className="step-num">3</span>
              <span>Complete the payment of {getCurrencySymbol(settings.currency)}{data.amount}</span>
            </div>
            <div className="step-item">
              <span className="step-num">4</span>
              <span>Click "I have completed the payment" button</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
