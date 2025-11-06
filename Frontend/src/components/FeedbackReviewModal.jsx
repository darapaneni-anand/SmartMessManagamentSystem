import React, { useEffect, useState } from "react";
import { formatDate, renderStars, formatRating } from "../utils/format";
import api from "../api/axiosConfig";

const FeedbackReviewModal = ({ feedback, onClose }) => {
  const [mealData, setMealData] = useState(null);

  useEffect(() => {
    // Fetch meal data if not included in feedback
    if (feedback && !feedback.meal) {
      // Try to fetch meal if mealId exists
      if (feedback.mealId) {
        api.get(`/meals/${feedback.mealId}`)
          .then(res => setMealData(res.data))
          .catch(() => setMealData(null));
      }
    } else if (feedback?.meal) {
      setMealData(typeof feedback.meal === 'object' ? feedback.meal : null);
    }
  }, [feedback]);

  if (!feedback) return null;

  const userName =
    typeof feedback.user === "object"
      ? feedback.user?.name || feedback.user?.email || "User"
      : "Anonymous";

  const userEmail =
    typeof feedback.user === "object" ? feedback.user?.email : "";

  const avatar = (userName || "U").charAt(0).toUpperCase();

  const mealName = mealData
    ? mealData.name || mealData.type || "Meal"
    : "Meal";

  const mealItems = mealData?.items
    ? Array.isArray(mealData.items)
      ? mealData.items.join(", ")
      : mealData.items
    : null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Feedback Review</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl">
              {avatar}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg text-gray-900">{userName}</div>
              {userEmail && (
                <div className="text-sm text-gray-600">{userEmail}</div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(feedback.createdAt)}
              </div>
            </div>
          </div>

            {/* Meal Info */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Meal</div>
              <div className="font-semibold text-gray-900">{mealName}</div>
              {mealItems && (
                <div className="text-sm text-gray-600 mt-1">{mealItems}</div>
              )}
            </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">Rating:</div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-2xl">
                {renderStars(feedback.rating)}
              </span>
              <span className="font-bold text-xl text-gray-900">
                {formatRating(feedback.rating)}/5
              </span>
            </div>
          </div>

          {/* Comment */}
          {feedback.comment && (
            <div>
              <div className="text-sm text-gray-600 mb-2">Comment:</div>
              <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                  "{feedback.comment}"
                </p>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <div className="text-xs text-gray-500 mb-1">Feedback ID</div>
              <div className="text-sm font-mono text-gray-700">
                {feedback._id?.slice(-8) || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Submitted</div>
              <div className="text-sm text-gray-700">
                {formatDate(feedback.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackReviewModal;

