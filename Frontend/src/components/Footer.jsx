import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Smart Mess Management</h3>
          <p>Making your dining experience better, one meal at a time.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/complaints">Complaints</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
            <li><Link to="/admin">Admin Portal</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul>
            <li>Email: contact@smartmess.com</li>
            <li>Phone: (555) 123-4567</li>
            <li>Address: 123 Campus Drive</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Smart Mess Management. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;