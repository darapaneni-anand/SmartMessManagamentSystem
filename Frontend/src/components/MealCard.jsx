import React from "react";
import { Link } from "react-router-dom";
import "./MealCard.css";

const MealCard = ({ meal }) => {
  return (
    <div className="meal-card">
      <h3>{meal.type}</h3>
      <div className="items">
        <p>Items: {meal.items.join(", ")}</p>
      </div>
      <div className="rating">
        <span className="rating-value">⭐ {meal.averageRating.toFixed(1)}</span>
        <span>Average Rating</span>
      </div>
      <Link to={`/feedback/${meal._id}`}>
        <button>Give Feedback</button>
      </Link>
    </div>
  );
};

export default MealCard;
