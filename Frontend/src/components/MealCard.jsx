import React from "react";
import { Link } from "react-router-dom";
import "./MealCard.css";
import { formatRating, renderStars } from '../utils/format';

const MealCard = ({ meal }) => {
  const items = Array.isArray(meal.items) ? meal.items.join(', ') : '';
  const avg = typeof meal.averageRating === 'number' ? formatRating(meal.averageRating) : '0.0';
  const fallbackQuery = encodeURIComponent(meal?.type || 'meal');
  const imageUrl = meal?.image || `https://source.unsplash.com/600x400/?${fallbackQuery}`;
  return (
    <div className="meal-card">
      <div className="meal-accent" aria-hidden />
      <div className="meal-image">
        <img src={imageUrl} alt={`${meal.type} image`} loading="lazy" />
        <div className="image-overlay" />
        <span className="meal-badge on-image">{meal.type}</span>
      </div>
      <div className="meal-content">
        <div className="meal-header">
          <div className="meal-rating">
            <span className="stars" aria-label={`Average rating ${avg}`}>
              {renderStars(meal.averageRating)}
            </span>
            <span className="avg">{avg}</span>
          </div>
        </div>
        <div className="meal-body">
          <p className="meal-items" title={items}>{items || 'No items listed'}</p>
        </div>
        <div className="meal-footer">
          <Link to={`/feedback/${meal._id}`} className="meal-action">
            <button type="button">Give Feedback</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
