import React from 'react';
import './StarRating.css';

const StarRating = ({ value = 5, onChange, readOnly = false }) => {
  const stars = [1,2,3,4,5];

  const handleClick = (v) => {
    if (readOnly) return;
    if (onChange) onChange(v);
  };

  return (
    <div className={`star-rating ${readOnly ? 'readonly' : ''}`} role="radiogroup" aria-label="Rating">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          className={`star ${s <= value ? 'filled' : ''}`}
          onClick={() => handleClick(s)}
          aria-checked={s === value}
          role="radio"
          aria-label={`${s} star${s>1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;
