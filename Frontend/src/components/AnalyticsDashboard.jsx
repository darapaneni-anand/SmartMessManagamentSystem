import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { getAllFeedback } from "../api/feedbackApi";
import { renderStars, formatRating } from "../utils/format";

const AnalyticsDashboard = () => {
  const [meals, setMeals] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week"); // week, month, all

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [mealsRes, feedbacksRes] = await Promise.all([
        api.get("/meals"),
        getAllFeedback()
      ]);

      setMeals(mealsRes.data || []);
      setFeedbacks(feedbacksRes.data || []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter data by time range
  const getFilteredData = () => {
    const now = new Date();
    let startDate = new Date();

    if (timeRange === "week") {
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === "month") {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate = new Date(0); // All time
    }

    const filteredFeedbacks = feedbacks.filter((fb) => {
      const fbDate = new Date(fb.createdAt);
      return fbDate >= startDate;
    });

    return filteredFeedbacks;
  };

  // Calculate trends
  const calculateTrends = () => {
    const filteredFeedbacks = getFilteredData();

    // Group by meal type
    const byMealType = {};
    meals.forEach((meal) => {
      const mealFeedbacks = filteredFeedbacks.filter(
        (fb) => fb.meal && (fb.meal._id === meal._id || fb.meal === meal._id)
      );

      if (mealFeedbacks.length > 0) {
        const avgRating =
          mealFeedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0) /
          mealFeedbacks.length;

        byMealType[meal.type] = byMealType[meal.type] || {
          total: 0,
          sum: 0,
          meals: [],
        };

        byMealType[meal.type].total += mealFeedbacks.length;
        byMealType[meal.type].sum += avgRating * mealFeedbacks.length;
        byMealType[meal.type].meals.push({
          name: meal.name || meal.type,
          rating: avgRating,
          count: mealFeedbacks.length,
        });
      }
    });

    // Calculate averages
    const trends = Object.keys(byMealType).map((type) => {
      const data = byMealType[type];
      return {
        type,
        averageRating: data.sum / data.total,
        totalFeedback: data.total,
        meals: data.meals,
      };
    });

    return trends.sort((a, b) => b.averageRating - a.averageRating);
  };

  // Overall statistics
  const getStats = () => {
    const filteredFeedbacks = getFilteredData();
    const totalFeedback = filteredFeedbacks.length;
    const avgRating =
      totalFeedback > 0
        ? filteredFeedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0) /
          totalFeedback
        : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: filteredFeedbacks.filter((fb) => fb.rating === rating).length,
      percentage:
        totalFeedback > 0
          ? (filteredFeedbacks.filter((fb) => fb.rating === rating).length /
              totalFeedback) *
            100
          : 0,
    }));

    return { totalFeedback, avgRating, ratingDistribution };
  };

  const trends = calculateTrends();
  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with time range selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Total Feedback</div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalFeedback}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Average Rating</div>
          <div className="text-3xl font-bold text-gray-900">
            {formatRating(stats.avgRating)}
          </div>
          <div className="mt-1 text-yellow-500">{renderStars(stats.avgRating)}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Meal Types</div>
          <div className="text-3xl font-bold text-gray-900">{trends.length}</div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {stats.ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-4">
              <div className="w-12 text-left">
                <span className="text-yellow-500">{renderStars(rating)}</span>
              </div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-20 text-right text-sm text-gray-600">
                {count} ({percentage.toFixed(1)}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trends by Meal Type */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Trends by Meal Type
        </h3>
        {trends.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No feedback data available</p>
        ) : (
          <div className="space-y-4">
            {trends.map((trend) => (
              <div key={trend.type} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg text-gray-900">{trend.type}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">{renderStars(trend.averageRating)}</span>
                    <span className="font-bold text-gray-900">
                      {formatRating(trend.averageRating)}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {trend.totalFeedback} feedbacks
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                  {trend.meals.slice(0, 3).map((meal, idx) => (
                    <div
                      key={idx}
                      className="text-xs bg-gray-50 p-2 rounded border border-gray-200"
                    >
                      <div className="font-medium text-gray-700">{meal.name}</div>
                      <div className="text-gray-600">
                        {formatRating(meal.rating)} ({meal.count} reviews)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

