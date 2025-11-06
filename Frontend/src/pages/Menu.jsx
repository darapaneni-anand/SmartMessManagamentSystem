import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import MealCard from '../components/MealCard';
import WeeklyMealPlan from '../components/WeeklyMealPlan';

const Menu = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('today'); // 'today' or 'weekly'

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
        
        setMeals(todayMeals);
        setError(null);
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
    <div className="min-h-screen bg-[#F9FAFB] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Toggle View Mode */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
            <button
              onClick={() => setViewMode('today')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                viewMode === 'today'
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Today's Menu
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                viewMode === 'weekly'
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Weekly Plan
            </button>
          </div>
        </div>

        {viewMode === 'today' ? (
          <>
            <header className="text-center mb-12">
              <h1 className="text-5xl font-bold text-[#111827] mb-4">
                Today's Menu
              </h1>
              <p className="text-[#6B7280] text-lg">Explore today's meals and leave feedback to help us improve.</p>
            </header>

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#3B82F6] border-t-transparent"></div>
                <p className="mt-4 text-[#6B7280]">Loading menu...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center max-w-md mx-auto">
                {error}
              </div>
            )}

            {!loading && !error && meals.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl p-12 max-w-md mx-auto border border-gray-200 shadow-sm">
                  <div className="text-6xl mb-4">🍽️</div>
                  <p className="text-[#6B7280] text-lg">No meals available for today.</p>
                </div>
              </div>
            )}

            {!loading && !error && meals.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {meals.map((meal, index) => (
                  <div 
                    key={meal._id} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <MealCard meal={meal} />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <WeeklyMealPlan />
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default Menu;