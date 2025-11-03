import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MealCard from "../components/MealCard";
import api from "../api/axiosConfig";
import "./Home.css";

const Home = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await api.get('/meals');
        setMeals(res.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch meals. Please try again later.");
        console.error("Error fetching meals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content split">
          <div className="hero-copy">
            <h1>Welcome to Smart Mess Management</h1>
            <p className="hero-description">Automate meal tracking, collect feedback, and improve dining experiences — all in one clean platform.</p>
            <div className="hero-buttons">
              <Link to="/menu" className="hero-button primary">View Menu</Link>
              <Link to="/feedback" className="hero-button secondary">Give Feedback</Link>
            </div>
          </div>
          <div className="hero-illustration" aria-hidden>
            {/* Simple SVG illustration */}
            <svg width="360" height="240" viewBox="0 0 360 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="50" width="150" height="120" rx="12" fill="#E6F0FF"/>
              <rect x="200" y="30" width="150" height="160" rx="12" fill="#FFF3E0"/>
              <circle cx="80" cy="110" r="12" fill="#2563EB"/>
              <circle cx="240" cy="110" r="12" fill="#F59E0B"/>
              <rect x="30" y="80" width="100" height="12" rx="6" fill="#60A5FA"/>
              <rect x="30" y="104" width="70" height="10" rx="5" fill="#93C5FD"/>
              <rect x="220" y="80" width="100" height="12" rx="6" fill="#FDBA74"/>
              <rect x="220" y="104" width="60" height="10" rx="5" fill="#FED7AA"/>
            </svg>
          </div>
        </div>
      </div>

      <h2 className="section-title">Today's Special Meals</h2>
      
      {loading && <div className="loading">Loading meals...</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="meals-container">
        {meals.map((meal) => (
          <MealCard key={meal._id} meal={meal} />
        ))}
      </div>
    </div>
  );
};

export default Home;
