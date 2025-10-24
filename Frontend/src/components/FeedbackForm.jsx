import React, { useState } from "react";
import { addFeedback } from "../api/feedbackApi";
import { useAuth } from "../contexts/AuthContext";
import "./FeedbackForm.css";

const FeedbackForm = ({ mealId, onFeedbackSubmitted, alreadySubmitted = false }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Show error for 5 seconds
  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showError("Please login to submit feedback");
      return;
    }

    if (alreadySubmitted) {
      showError("You have already submitted feedback for this meal.");
      return;
    }

    if (!mealId) {
      showError("No meal selected. Please choose a meal first.");
      return;
    }

    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      showError("Rating must be between 1 and 5");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await addFeedback({
        mealId,
        rating: numericRating,
        comment: comment.trim(),
      });

      setSuccess(res?.data?.message || "Feedback submitted successfully!");
      setComment("");
      setRating(5);

      if (onFeedbackSubmitted) onFeedbackSubmitted();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      const serverMsg =
        err.response?.data?.message ||
        err.message ||
        "Error submitting feedback";

      if (err.response?.status === 401) {
        setError("Please login to submit feedback");
      } else if (
        err.response?.status === 400 &&
        /already provided/i.test(serverMsg)
      ) {
        setError(serverMsg);
      } else {
        setError(serverMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-form-container">
      <form onSubmit={handleSubmit} className="feedback-form">
        {error && <div className="feedback-error">{error}</div>}
        {success && <div className="feedback-success">{success}</div>}

        <div className="form-group">
          <label htmlFor="rating">Rating:</label>
          <input
            id="rating"
            type="number"
            value={rating}
            onChange={(e) =>
              setRating(Math.min(5, Math.max(1, Number(e.target.value))))
            }
            min="1"
            max="5"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
            placeholder="Share your thoughts about this meal..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !isAuthenticated || alreadySubmitted}
          className={`submit-button ${loading ? "loading" : ""}`}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>

        {!isAuthenticated && (
          <p className="login-reminder">Please login to submit feedback</p>
        )}

        {alreadySubmitted && (
          <p className="already-submitted">
            You have already provided feedback for this meal.
          </p>
        )}
      </form>
    </div>
  );
};

export default FeedbackForm;
