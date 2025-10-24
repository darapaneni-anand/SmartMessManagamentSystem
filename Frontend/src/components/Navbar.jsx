import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isAuthenticated, isStudent, isStaff } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Smart Mess
        </Link>

        <div className={`navbar-links ${isOpen ? "open" : ""}`}>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>

          {isAuthenticated && (isStudent() || isStaff()) && (
            <>
              <Link to="/feedback" className={location.pathname === "/feedback" ? "active" : ""}>
                Feedback
              </Link>
              <Link to="/complaints" className={location.pathname === "/complaints" ? "active" : ""}>
                Complaints
              </Link>
            </>
          )}

          {isAdmin() && (
            <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
              Admin
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>
                Login
              </Link>
              <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>
                Register
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          )}
        </div>

        {/* Hamburger for mobile */}
        <div
          className={`hamburger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
