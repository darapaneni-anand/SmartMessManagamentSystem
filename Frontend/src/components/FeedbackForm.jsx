import React, { useState } from "react";
import { addFeedback } from "../api/feedbackApi";
import { useAuth } from "../contexts/AuthContext";
import "./FeedbackForm.css";
import StarRating from './StarRating';

const FeedbackForm = ({ mealId, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError("Please login to submit feedback");
      return;
    }

    if (!mealId) {
      setError("No meal selected. Please choose a meal first.");
      return;
    }

    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      setError("Rating must be between 1 and 5");
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
      setError(err.response?.data?.message || "Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-form-container">
      <form
        onSubmit={handleSubmit}
        className="feedback-form card"
        aria-busy={loading}
        aria-live="polite"
      >
        <div className="form-header">
          <h3>Share Your Feedback</h3>
          <StarRating value={rating} onChange={(v) => setRating(v)} />
        </div>

        {error && (
          <div className="feedback-error" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="feedback-success" role="status">
            {success}
          </div>
        )}

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your feedback here..."
          maxLength={500}
          className="feedback-comment"
        />

        <button
          type="submit"
          disabled={loading}
          className={`submit-button ${loading ? "loading" : ""}`}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
