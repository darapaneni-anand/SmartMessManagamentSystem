/**
 * Reusable Card Component
 */
import React from 'react';

export const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-xl border border-gray-200 shadow-sm transition-all';
  
  const variants = {
    default: 'p-6',
    compact: 'p-4',
    none: '',
  };
  
  const hoverClasses = onClick ? 'hover:shadow-md cursor-pointer' : '';
  
  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

