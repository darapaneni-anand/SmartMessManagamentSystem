import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { renderStars, formatRating } from "../utils/format";

const WeeklyMealPlan = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    fetchMeals();
  }, [weekOffset]);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const res = await api.get("/meals");
      const allMeals = res.data || [];
      setMeals(allMeals);
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get week range
  const getWeekRange = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return { start: startOfWeek, end: endOfWeek };
  };

  // Group meals by date and type
  const groupMealsByWeek = () => {
    const { start, end } = getWeekRange();
    const grouped = {};

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      grouped[dateStr] = {
        Breakfast: null,
        Lunch: null,
        Dinner: null,
      };
    }

    meals.forEach((meal) => {
      if (!meal.date) return;
      const mealDate = new Date(meal.date).toISOString().split("T")[0];
      if (grouped[mealDate] && meal.type) {
        const type = meal.type.charAt(0).toUpperCase() + meal.type.slice(1);
        if (["Breakfast", "Lunch", "Dinner"].includes(type)) {
          grouped[mealDate][type] = meal;
        }
      }
    });

    return grouped;
  };

  const weekMeals = groupMealsByWeek();
  const { start, end } = getWeekRange();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getDateFromKey = (key) => {
    return new Date(key + "T00:00:00");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading meal plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weekly Meal Plan</h2>
          <p className="text-gray-600 mt-1">
            {formatDate(start)} - {formatDate(end)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            This Week
          </button>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Meal Plan Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-500">
              <tr>
                <th className="px-4 py-3 text-left text-white font-semibold">Day</th>
                {mealTypes.map((type) => (
                  <th key={type} className="px-4 py-3 text-center text-white font-semibold">
                    {type}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(weekMeals).map((dateKey) => {
                const date = getDateFromKey(dateKey);
                const dayMeals = weekMeals[dateKey];
                const isToday =
                  date.toDateString() === new Date().toDateString();

                return (
                  <tr
                    key={dateKey}
                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                      isToday ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">
                        {days[date.getDay()]}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(date)}
                      </div>
                    </td>
                    {mealTypes.map((type) => {
                      const meal = dayMeals[type];
                      return (
                        <td key={type} className="px-4 py-4">
                          {meal ? (
                            <div className="text-center">
                              <div className="font-medium text-gray-900 mb-1">
                                {meal.name || meal.type}
                              </div>
                              <div className="text-xs text-gray-600 mb-2">
                                {Array.isArray(meal.items)
                                  ? meal.items.slice(0, 2).join(", ")
                                  : ""}
                              </div>
                              {meal.averageRating > 0 && (
                                <div className="flex items-center justify-center gap-1 text-yellow-500 text-xs mb-2">
                                  {renderStars(meal.averageRating)}
                                  <span className="text-gray-700 font-semibold">
                                    {formatRating(meal.averageRating)}
                                  </span>
                                </div>
                              )}
                              <Link
                                to={`/feedback/${meal._id}`}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                View Feedback
                              </Link>
                            </div>
                          ) : (
                            <div className="text-center text-gray-400 text-sm">
                              No meal
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeeklyMealPlan;

