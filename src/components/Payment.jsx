import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Payment() {
  const { plan } = useParams();

  const data = useMemo(() => {
    const normalized = (plan || '').toLowerCase();
    const label = normalized === 'pro' ? 'PRO' : 'STANDARD';
    const amount = normalized === 'pro' ? 19 : 9;
    const upiId = 'iconicinterior@upi';
    const payeeName = 'Iconic Interior';
    const note = `${label} Subscription`;
    const intent = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    return { label, amount, upiId, intent };
  }, [plan]);

  return (
    <div className="payment-page">
      <style>{`
        .payment-page {
          padding-top: 100px;
          min-height: 100vh;
          background: #f7f9fc;
          font-family: 'Inter', sans-serif;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px 70px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .title {
          font-size: 32px;
          font-weight: 700;
          color: #222;
        }
        .back {
          color: #2196f3;
          text-decoration: none;
          font-weight: 600;
        }
        .card {
          background: #fff;
          border: 1px solid #e6e9ef;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          padding: 28px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 28px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #444;
          margin-bottom: 12px;
        }
        .summary {
          background: #f1f7ff;
          border: 1px solid #cfe4ff;
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 18px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #333;
        }
        .upi-box {
          background: #fafafa;
          border: 1px dashed #d0d0d0;
          border-radius: 10px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .upi-id {
          font-weight: 700;
          color: #222;
        }
        .copy-btn {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #2196f3;
          color: #2196f3;
          background: #eaf5ff;
          cursor: pointer;
        }
        .qr-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: 1px solid #e6e9ef;
          border-radius: 12px;
          padding: 16px;
        }
        .pay-btn {
          width: 100%;
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          background: #00c853;
          color: white;
          font-weight: 700;
          cursor: pointer;
          margin-top: 16px;
        }
        .note {
          font-size: 13px;
          color: #777;
          margin-top: 8px;
        }
        @media (max-width: 900px) {
          .card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="container">
        <div className="header">
          <div className="title">Subscribe {data.label}</div>
          <Link className="back" to="/pricing">← Back to Pricing</Link>
        </div>

        <div className="card">
          <div>
            <div className="section-title">Payment Summary</div>
            <div className="summary">
              <div className="summary-row"><span>Plan</span><span>{data.label}</span></div>
              <div className="summary-row"><span>Amount</span><span>₹{data.amount} / month</span></div>
            </div>
            <div className="section-title">Pay via UPI ID</div>
            <div className="upi-box">
              <div className="upi-id">{data.upiId}</div>
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard && navigator.clipboard.writeText(data.upiId)}
              >
                Copy UPI
              </button>
            </div>
            <a className="pay-btn" href={data.intent}>Pay via UPI App</a>
            <div className="note">UPI supported apps will open on mobile.</div>
          </div>
          <div>
            <div className="section-title">Scan QR to Pay</div>
            <div className="qr-wrap">
              <img src="/qr-placeholder.jpg" alt="UPI QR" width="200" height="200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
