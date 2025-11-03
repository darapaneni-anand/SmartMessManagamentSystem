import React from "react";
import { Link } from "react-router-dom";
import "./MealCard.css";
import { formatRating, renderStars } from '../utils/format';

const MealCard = ({ meal }) => {
  const items = Array.isArray(meal.items) ? meal.items.join(', ') : '';
  const avg = typeof meal.averageRating === 'number' ? formatRating(meal.averageRating) : '0.0';
  return (
    <div className="meal-card">
      <h3>{meal.type}</h3>
      <div className="items">
        <p>Items: {items}</p>
      </div>
      <div className="rating">
        <span className="rating-value">{renderStars(meal.averageRating)} {avg}</span>
        <span>Average Rating</span>
      </div>
      <Link to={`/feedback/${meal._id}`}>
        <button>Give Feedback</button>
      </Link>
    </div>
  );
};

export default MealCard;
