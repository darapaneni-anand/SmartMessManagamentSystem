import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import MealCard from '../components/MealCard';
import './Menu.css';

const Menu = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await api.get('/meals');
        setMeals(res.data || []);
      } catch (err) {
        console.error('Error fetching meals:', err);
        setError('Failed to load menu.');
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  return (
    <div className="menu-page">
      <header className="menu-header">
        <h1>Mess Menu</h1>
        <p>Explore today's meals and leave feedback to help us improve.</p>
      </header>

      {loading && <div className="loading">Loading menu...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="menu-grid">
        {meals.map(m => (
          <MealCard key={m._id} meal={m} />
        ))}
      </div>
    </div>
  );
};

export default Menu;
