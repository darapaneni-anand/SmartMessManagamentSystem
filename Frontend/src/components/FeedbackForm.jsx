import React, { useState } from "react";
import { addFeedback } from "../api/feedbackApi";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import StarRating from "./StarRating";

const FeedbackForm = ({ mealId, onFeedbackSubmitted, alreadySubmitted, accent = "blue" }) => {
  const { isAuthenticated } = useAuth();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const primaryColor = accent === "blue" ? "#2563EB" : "#4F46E5";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return setErr("Please login to submit feedback.");
    if (!mealId) return setErr("No meal selected.");
    if (!rating || rating < 1 || rating > 5) return setErr("Rating must be 1–5.");
    if (comment.trim().length < 3) return setErr("Please add a brief comment (min 3 chars).");

    setErr("");
    setSubmitting(true);
    try {
      await addFeedback({ mealId, rating: Number(rating), comment: comment.trim() });
      setComment("");
      setRating(5);
      toast.success("Feedback submitted. Thank you!");
      onFeedbackSubmitted?.();
    } catch (e2) {
      const msg = e2?.response?.data?.message || "Error submitting feedback";
      setErr(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="fp-card">
      <div className="fp-form-head">
        <h3>Share your feedback</h3>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {alreadySubmitted && (
        <div className="fp-note">You’ve already submitted feedback for this meal.</div>
      )}

      {err && <div className="fp-alert">{err}</div>}

      <form onSubmit={handleSubmit} className="fp-form">
        <label htmlFor="comment" className="fp-label">
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your feedback..."
          maxLength={500}
          className="fp-textarea"
          disabled={submitting}
        />

        <div className="fp-row">
          <span className="fp-muted">{comment.length}/500</span>
          <button
            type="submit"
            disabled={submitting || alreadySubmitted || !isAuthenticated}
            className="fp-btn"
            style={{ backgroundColor: primaryColor }}
          >
            {submitting ? "Submitting..." : "Submit feedback"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default FeedbackForm;
