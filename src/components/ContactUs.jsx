import React, { useState } from 'react';
import axios from 'axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      await axios.post('http://localhost:5001/api/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <style>{`
        .contact-page {
          padding-top: 100px;
          background: #f4f7f9;
          min-height: 100vh;
        }

        .contact-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 20px;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 50px;
        }

        .contact-info {
          background: #2c3e50;
          color: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .contact-info h2 {
          font-size: 32px;
          margin-bottom: 20px;
        }

        .contact-info p {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 30px;
          opacity: 0.9;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }

        .info-icon {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .contact-form-container {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .contact-form h2 {
          font-size: 28px;
          color: #333;
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #555;
          margin-bottom: 8px;
        }

        .form-group input, 
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 15px;
          transition: 0.3s;
          box-sizing: border-box;
        }

        .form-group input:focus, 
        .form-group textarea:focus {
          border-color: #3498db;
          outline: none;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        .submit-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 14px 30px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
          width: 100%;
        }

        .submit-btn:hover {
          background: #2980b9;
        }
        
        .submit-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .alert {
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        .alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .alert-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }

        @media (max-width: 850px) {
          .contact-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Have questions about our services or need a custom design? Our team is here to help you transform your space.</p>
          
          <div className="info-item">
            <div className="info-icon">📍</div>
            <div>
              <strong>Our Office</strong>
              <p style={{margin:0, fontSize: '14px'}}>123 Design Street, Creative Valley, NY 10001</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">📞</div>
            <div>
              <strong>Call Us</strong>
              <p style={{margin:0, fontSize: '14px'}}>+91 (555) 123-4567</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">✉️</div>
            <div>
              <strong>Email Us</strong>
              <p style={{margin:0, fontSize: '14px'}}>support@iconicinteriors.com</p>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send us a Message</h2>
            
            {success && <div className="alert alert-success">Your message has been sent successfully!</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label>Full Name</label>
              <input 
                name="name"
                type="text" 
                placeholder="Komal Mishra" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                name="email"
                type="email" 
                placeholder="komal@example.com" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input 
                name="subject"
                type="text" 
                placeholder="Inquiry about AI Design" 
                value={formData.subject}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea 
                name="message"
                rows="5" 
                placeholder="Tell us about your project..." 
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
