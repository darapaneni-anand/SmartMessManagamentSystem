import React from "react";
import { Link } from "react-router-dom";
import { formatRating, renderStars } from '../utils/format';

const MealCard = ({ meal }) => {
  const items = Array.isArray(meal.items) ? meal.items.join(', ') : '';
  const avg = typeof meal.averageRating === 'number' ? formatRating(meal.averageRating) : '0.0';
  const fallbackQuery = encodeURIComponent(meal?.type || 'meal');
  const imageUrl = meal?.imageUrl || meal?.image || `https://source.unsplash.com/600x400/?${fallbackQuery}`;
  
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 hover:-translate-y-1 hover:border-blue-300">
      {/* Image container */}
      <div className="relative w-full h-48 overflow-hidden rounded-t-2xl bg-gray-100">
        <img 
          src={imageUrl} 
          alt={`${meal.type} image`} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        <span className="absolute top-4 left-4 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-md">
          {meal.type}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3 relative z-10 bg-white">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-yellow-500">
            {renderStars(meal.averageRating)}
          </div>
          <span className="text-sm font-bold text-gray-700">{avg}</span>
        </div>

        {/* Meal details */}
        {(meal.name || meal.date || meal.time) && (
          <div className="space-y-1 text-sm text-gray-600">
            {meal.name && <p className="font-semibold text-gray-900">{meal.name}</p>}
            <div className="flex items-center gap-3 text-xs">
              {meal.date && <span>📅 {new Date(meal.date).toLocaleDateString()}</span>}
              {meal.time && <span>🕐 {meal.time}</span>}
            </div>
          </div>
        )}

        {/* Items */}
        <p className="text-gray-600 text-sm line-clamp-2" title={items}>
          {items || 'No items listed'}
        </p>

        {/* Description if available */}
        {meal.description && (
          <p className="text-gray-500 text-xs line-clamp-2 italic">{meal.description}</p>
        )}

        {/* Action button */}
        <Link to={`/feedback/${meal._id}`} className="block mt-4">
          <button 
            type="button" 
            className="w-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white font-bold py-2.5 px-4 rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
          >
            Give Feedback
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MealCard;
