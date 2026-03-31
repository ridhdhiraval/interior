import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('year');
  const [openFaq, setOpenFaq] = useState(0);

  const plans = [
    {
      name: 'FREE',
      price: '0',
      active: true,
      features: {
        projects: '3',
        initialCatalog: true,
        advancedCatalog: false,
        commercialSpaces: false,
        baseboardEditor: false,
        combiningMaterials: false,
        uploadPictures: false,
        uploadTextures: false,
        upload3dModels: false,
        viewOnlySharing: false,
      }
    },
    {
      name: 'STANDARD',
      price: billingCycle === 'year' ? '5' : '9',
      active: false,
      features: {
        projects: 'Unlimited',
        initialCatalog: true,
        advancedCatalog: true,
        commercialSpaces: false,
        baseboardEditor: true,
        combiningMaterials: true,
        uploadPictures: true,
        uploadTextures: true,
        upload3dModels: false,
        viewOnlySharing: true,
      }
    },
    {
      name: 'PRO',
      price: billingCycle === 'year' ? '10' : '19',
      active: false,
      features: {
        projects: 'Unlimited',
        initialCatalog: true,
        advancedCatalog: true,
        commercialSpaces: true,
        baseboardEditor: true,
        combiningMaterials: true,
        uploadPictures: true,
        uploadTextures: true,
        upload3dModels: true,
        viewOnlySharing: true,
      }
    }
  ];

  const faqs = [
    {
      question: "Can I change my subscription?",
      answer: "Sure, you can change your subscription in your account settings. Upgrading subscription plan: From the FREE plan, you can switch to the BASIC or PRO plan at any time. When switching from the BASIC subscription to PRO, an additional fee will be charged for the remaining period until the end of your BASIC subscription plan. Downgrading subscription plan: Downgrading the subscription plan is possible after the current plan expires. To do this, you need to unsubscribe from the existing subscription plan, and after its expiration, choose another tariff plan that you desire."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription at any time from your account dashboard. Your access will remain active until the end of the current billing period."
    },
    {
      question: "What happens when the subscription ends?",
      answer: "When your subscription ends and is not renewed, your account will revert to the FREE plan. You will still be able to view your projects, but some editing features may be limited according to the FREE plan's restrictions."
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

        .faq-section {
          margin-top: 80px;
          background: #73c2fb;
          padding: 80px 0;
          color: white;
        }

        .faq-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .faq-title {
          text-align: center;
          font-size: 48px;
          margin-bottom: 60px;
          font-weight: 400;
          letter-spacing: 1px;
        }

        .faq-item {
          border-top: 1px solid rgba(255,255,255,0.4);
          padding: 0;
          overflow: hidden;
        }

        .faq-item:last-child {
          border-bottom: 1px solid rgba(255,255,255,0.4);
        }

        .faq-question {
          font-size: 20px;
          font-weight: 400;
          padding: 25px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: color 0.3s;
        }

        .faq-question:hover {
          color: #fff;
        }

        .faq-question.active {
          color: #ffff00;
        }

        .faq-answer {
          font-size: 15px;
          line-height: 1.8;
          color: white;
          padding-bottom: 30px;
          max-height: 0;
          opacity: 0;
          transition: all 0.4s ease;
          pointer-events: none;
        }

        .faq-item.open .faq-answer {
          max-height: 500px;
          opacity: 1;
          pointer-events: auto;
        }

        .faq-arrow {
          font-size: 24px;
          transition: transform 0.3s ease;
          opacity: 0.8;
        }

        .faq-item.open .faq-arrow {
          transform: rotate(180deg);
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
              Projects available
              <span className="info-icon-small">?</span>
            </div>
            <div className="feature-name">
              Initial catalog of products and materials
            </div>
            <div className="feature-name">
              Advanced catalog of products and materials
            </div>
            <div className="feature-name">Products for commercial spaces</div>
            <div className="feature-name">Baseboard editor</div>
            <div className="feature-name">Combining materials on the walls</div>
            <div className="feature-name">Uploading your own pictures</div>
            <div className="feature-name">Uploading your own textures</div>
            <div className="feature-name">Uploading your own 3D-models</div>
            <div className="feature-name">"View-only" projects for sharing</div>
          </div>

          {plans.map((plan, index) => (
            <div className="plan-column" key={index}>
              <div className="plan-header">
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">{plan.price === '0' ? '0' : `$${plan.price}`}<span>{plan.price !== '0' && '/MON'}</span></div>
                {plan.name === 'FREE' ? (
                  <button className="plan-btn active-plan">YOUR ACTIVE PLAN</button>
                ) : plan.name === 'STANDARD' ? (
                  <Link className="plan-btn basic-btn" to="/subscribe/standard">GET STANDARD</Link>
                ) : (
                  <Link className="plan-btn pro-btn" to="/subscribe/pro">GET PRO</Link>
                )}
              </div>
              <div className="feature-value">{plan.features.projects}</div>
              <div className="feature-value">{plan.features.initialCatalog && <span className="check-icon">✓</span>}</div>
              <div className="feature-value">{plan.features.advancedCatalog && <span className="check-icon">✓</span>}</div>
              <div className="feature-value">{plan.features.commercialSpaces && <span className="check-icon">✓</span>}</div>
              <div className="feature-value">{plan.features.baseboardEditor && <span className="check-icon">✓</span>}</div>
              <div className="feature-value">{plan.features.combiningMaterials && <span className="check-icon">✓</span>}</div>
              <div className="feature-value">{plan.features.uploadPictures && <span className="check-icon">✓</span>}</div>
              <div className="feature-value">{plan.features.uploadTextures && <span className="check-icon">✓</span>}</div>
              <div className="feature-value">{plan.features.upload3dModels && <span className="check-icon">✓</span>}</div>
              <div className="feature-value">{plan.features.viewOnlySharing && <span className="check-icon">✓</span>}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="faq-section">
        <div className="faq-container">
          <h2 className="faq-title">FAQ</h2>
          {faqs.map((faq, index) => (
            <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={index}>
              <div 
                className={`faq-question ${openFaq === index ? 'active' : ''}`} 
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              >
                {faq.question}
                <span className="faq-arrow">﹀</span>
              </div>
              <div className="faq-answer">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
