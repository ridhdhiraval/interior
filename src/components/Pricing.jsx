import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AIBot from './AIBot';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('year');
  const [userPlan, setUserPlan] = useState('FREE');
  const [settings, setSettings] = useState({ currency: 'INR' });
  const [dbPlans, setDbPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserPlan(user.plan || 'FREE');
    }
    fetchGlobalData();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const getCurrencySymbol = (code) => {
    const symbols = { 'USD': '$', 'INR': '₹', 'EUR': '€', 'GBP': '£' };
    return symbols[code] || code;
  };

  const getPrice = (planName) => {
    const plan = dbPlans.find(p => p.name === planName);
    if (!plan) {
      // Fallback prices from screenshot if DB fetch fails
      if (planName === 'STANDARD') return billingCycle === 'year' ? '50' : '5';
      if (planName === 'PRO') return billingCycle === 'year' ? '100' : '10';
      return '0';
    }
    return billingCycle === 'year' ? plan.yearly : plan.monthly;
  };

  const plans = [
    {
      name: 'FREE',
      price: getPrice('FREE'),
      active: true,
      features: {
        aiCredits: '3 Credits',
        manualCredits: '3 Credits',
        aiDesign: true,
        floorPlanner: true,
        furnitureCatalog: 'Basic',
        materials: 'Basic',
        hdRendering: false,
        projectHistory: true,
      }
    },
    {
      name: 'STANDARD',
      price: getPrice('STANDARD'),
      active: false,
      features: {
        aiCredits: 'Unlimited',
        manualCredits: 'Unlimited',
        aiDesign: true,
        floorPlanner: true,
        furnitureCatalog: 'Standard',
        materials: 'Standard',
        hdRendering: false,
        projectHistory: true,
      }
    },
    {
      name: 'PRO',
      price: getPrice('PRO'),
      active: false,
      features: {
        aiCredits: 'Unlimited',
        manualCredits: 'Unlimited',
        aiDesign: true,
        floorPlanner: true,
        furnitureCatalog: 'Premium',
        materials: 'Premium',
        hdRendering: true,
        projectHistory: true,
      }
    }
  ];

  return (
    <div className="pricing-page">
      <style>{`
        .pricing-page {
          padding-top: 100px;
          font-family: 'Inter', sans-serif;
          background: #f9fbff;
        }

        .pricing-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px 60px;
        }

        .pricing-header {
          display: flex;
          justify-content: center;
          margin-bottom: 40px;
        }

        .billing-cycle-text {
          display: flex;
          align-items: center;
          gap: 15px;
          font-weight: 700;
          color: #444;
          font-size: 18px;
        }

        .active-cycle {
          color: #2196f3;
        }

        .info-icon-small {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          background: #ddd;
          color: #777;
          border-radius: 50%;
          font-size: 10px;
          margin-left: 8px;
          cursor: help;
        }

        .feature-img {
          height: 30px;
          margin-left: auto;
        }

        .feature-labels {
          background: #f5f7fa;
        }

        .feature-name, .feature-value {
          height: 60px;
          box-sizing: border-box;
          border-bottom: 1px solid #eee;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #8bc34a;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .savings {
          color: #8bc34a;
          font-size: 12px;
          margin-left: 5px;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 0;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .plan-column {
          border: 1px solid #eee;
          display: flex;
          flex-direction: column;
        }

        .plan-header {
          padding: 30px 20px;
          text-align: center;
          border-bottom: 1px solid #eee;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .plan-name {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }

        .plan-price {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .plan-price span {
          font-size: 14px;
          font-weight: 400;
          color: #666;
        }

        .plan-btn {
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
          width: 100%;
          border: 1px solid #ddd;
          background: white;
        }

        .plan-btn.active-plan {
          background: #e3f2fd;
          color: #2196f3;
          border: none;
        }

        .plan-btn.basic-btn {
          background: #e3f2fd;
          color: #2196f3;
          border: 1px solid #2196f3;
        }

        .plan-btn.pro-btn {
          background: #ffb300;
          color: black;
          border: none;
        }

        .feature-row {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          border-bottom: 1px solid #f0f0f0;
        }

        .feature-name {
          padding: 15px 20px;
          font-size: 14px;
          color: #555;
          display: flex;
          align-items: center;
        }

        .feature-value {
          padding: 15px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          border-left: 1px solid #f0f0f0;
        }

        .check-icon {
          color: #4caf50;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .plans-grid {
            grid-template-columns: 1fr;
          }
          .feature-row {
            grid-template-columns: 1fr;
          }
          .feature-name {
            background: #eee;
            font-weight: bold;
          }
        }
      `}</style>

      <div className="pricing-container">
        <div className="pricing-header">
          <div className="billing-cycle-text">
            <span>MONTH</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={billingCycle === 'year'} 
                onChange={() => setBillingCycle(billingCycle === 'year' ? 'month' : 'year')}
              />
              <span className="slider"></span>
            </label>
            <span className={billingCycle === 'year' ? 'active-cycle' : ''}>YEAR <span className="savings">(50% savings)</span></span>
          </div>
        </div>

        <div className="plans-grid">
          <div className="plan-column feature-labels">
            <div className="plan-header"></div>
            <div className="feature-name">
              AI Design Credits
              <span className="info-icon-small">?</span>
            </div>
            <div className="feature-name">
              Manual Design Credits
              <span className="info-icon-small">?</span>
            </div>
            <div className="feature-name">AI Interior Design</div>
            <div className="feature-name">2D/3D Floor Planner</div>
            <div className="feature-name">Furniture Catalog</div>
            <div className="feature-name">Material & Decorations</div>
            <div className="feature-name">HD Rendering</div>
            <div className="feature-name">Project History</div>
          </div>

          {plans.map((plan, index) => (
            <div className="plan-column" key={index}>
              <div className="plan-header">
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">{plan.price === '0' || plan.price === 0 ? '0' : `${getCurrencySymbol(settings.currency)}${plan.price}`}<span>{plan.price !== '0' && plan.price !== 0 && '/MON'}</span></div>
                {userPlan === plan.name ? (
                  <button className="plan-btn active-plan">YOUR ACTIVE PLAN</button>
                ) : plan.name === 'FREE' ? (
                  <button className="plan-btn active-plan" disabled>FREE PLAN</button>
                ) : plan.name === 'STANDARD' ? (
                  <Link className="plan-btn basic-btn" to="/subscribe/standard">GET STANDARD</Link>
                ) : (
                  <Link className="plan-btn pro-btn" to="/subscribe/pro">GET PRO</Link>
                )}
              </div>
              <div className="feature-value">{plan.features.aiCredits}</div>
              <div className="feature-value">{plan.features.manualCredits}</div>
              <div className="feature-value">{plan.features.aiDesign && <span className="check-icon">✓</span>}</div>
              <div className="feature-value">{plan.features.floorPlanner && <span className="check-icon">✓</span>}</div>
              <div className="feature-value">{plan.features.furnitureCatalog}</div>
              <div className="feature-value">{plan.features.materials}</div>
              <div className="feature-value">{plan.features.hdRendering ? <span className="check-icon">✓</span> : <span style={{ color: '#ff4d4f' }}>✕</span>}</div>
              <div className="feature-value">{plan.features.projectHistory && <span className="check-icon">✓</span>}</div>
            </div>
          ))}
        </div>
      </div>

      <AIBot />
    </div>
  );
};

export default Pricing;
