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
        const allMeals = res.data || [];
        
        // Filter meals for today only
        const today = new Date().toISOString().split('T')[0];
        const todayMeals = allMeals.filter(meal => {
          if (!meal.date) return false;
          const mealDate = new Date(meal.date).toISOString().split('T')[0];
          return mealDate === today;
        });
        
        // Group by meal type (Breakfast, Lunch, Dinner)
        const grouped = {
          Breakfast: [],
          Lunch: [],
          Dinner: []
        };
        
        todayMeals.forEach(meal => {
          const type = meal.type || 'Lunch';
          if (grouped[type]) {
            grouped[type].push(meal);
          } else {
            grouped['Lunch'].push(meal);
          }
        });
        
        // Flatten and sort by type order
        const sortedMeals = [
          ...grouped.Breakfast,
          ...grouped.Lunch,
          ...grouped.Dinner
        ];
        
        setMeals(sortedMeals);
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
            {/* Modern SVG illustration */}
            <svg width="360" height="240" viewBox="0 0 360 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="50" width="150" height="120" rx="16" fill="#EFF6FF"/>
              <rect x="200" y="30" width="150" height="160" rx="16" fill="#F0FDF4"/>
              <circle cx="80" cy="110" r="12" fill="#3B82F6"/>
              <circle cx="240" cy="110" r="12" fill="#10B981"/>
              <rect x="30" y="80" width="100" height="12" rx="6" fill="#3B82F6" opacity="0.6"/>
              <rect x="30" y="104" width="70" height="10" rx="5" fill="#3B82F6" opacity="0.4"/>
              <rect x="220" y="80" width="100" height="12" rx="6" fill="#10B981" opacity="0.6"/>
              <rect x="220" y="104" width="60" height="10" rx="5" fill="#10B981" opacity="0.4"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="container">
        <h2 className="section-title">Today's Meals</h2>
      
      {loading && <div className="loading">Loading meals...</div>}
      {error && <div className="error-message">{error}</div>}
      
      {!loading && !error && meals.length === 0 && (
        <div className="no-meals-message">
          <div className="no-meals-icon">🍽️</div>
          <h3>No meals scheduled for today</h3>
          <p>Check back later for today's meals.</p>
        </div>
      )}
      
      {!loading && !error && meals.length > 0 && (
        <div className="meals-container">
          {meals.map((meal) => (
            <MealCard key={meal._id} meal={meal} />
          ))}
        </div>
      )}

      </div>

      {/* Team Section */}
      <section className="team-section">
        <h2 className="section-title">Our Team</h2>
        <div className="team-grid">
          <div className="team-card card">
            <div className="avatar" aria-hidden />
            <h4>Anand Teja</h4>
            <p className="role">Project Lead</p>
            <p className="text-muted">Architecture, backend APIs, reviews</p>
          </div>
          <div className="team-card card">
            <div className="avatar" aria-hidden />
            <h4>Anand Teja</h4>
            <p className="role">Product Design</p>
            <p className="text-muted">UX flows, visual system, polish</p>
          </div>
          <div className="team-card card">
            <div className="avatar" aria-hidden />
            <h4>Anand Teja</h4>
            <p className="role">Frontend Engineer</p>
            <p className="text-muted">Components, states, responsiveness</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;