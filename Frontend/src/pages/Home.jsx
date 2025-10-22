import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MealCard from "../components/MealCard";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/meals");
        setMeals(res.data);
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
        <div className="hero-content">
          <h1>Welcome to Smart Mess Management</h1>
          <p className="hero-description">Experience seamless dining with our state-of-the-art mess management system. View meals, provide feedback, and help us serve you better.</p>
          <div className="hero-buttons">
            <Link to="/complaints" className="hero-button primary">Report Issue</Link>
            <Link to="/feedback" className="hero-button secondary">Give Feedback</Link>
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
