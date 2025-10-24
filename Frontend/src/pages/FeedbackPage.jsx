import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getFeedbackByMeal } from "../api/feedbackApi";
import api from "../api/axiosConfig";
import FeedbackForm from "../components/FeedbackForm";
import { useAuth } from "../contexts/AuthContext";
import "./FeedbackPage.css";

const FeedbackPage = () => {
  const { mealId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [feedbackList, setFeedbackList] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      if (!mealId) {
        setFeedbackList([]);
        setError(null);
        setLoading(false);
        return;
      }
      const res = await getFeedbackByMeal(mealId);
      setFeedbackList(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching feedback');
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeals = async () => {
    try {
      const res = await api.get('/meals');
      setMeals(res.data || []);
    } catch (err) {
      console.error('Error fetching meals:', err);
    }
  };

  useEffect(() => {
    fetchMeals();
    fetchFeedback();
  }, [mealId]);

  const handleFeedbackSubmitted = () => {
    fetchFeedback();
  };

  useEffect(() => {
    if (mealId && Array.isArray(feedbackList) && user) {
      const found = feedbackList.some((f) => {
        const uid = f.user && (typeof f.user === 'string' ? f.user : f.user._id);
        return uid === user._id || uid === user.id;
      });
      setHasSubmitted(found);
    } else {
      setHasSubmitted(false);
    }
  }, [feedbackList, mealId, user]);

  if (loading) {
    return (
      <div className="feedback-page loading">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  const selectedMeal = mealId ? meals.find(m => m._id === mealId) : null;

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <h1>Meal Feedback</h1>
        {error && <div className="error-message">{error}</div>}
      </div>

      {mealId ? (
        <>
          <div className="selected-meal">
            {selectedMeal && (
              <div className="meal-details">
                <h2>{selectedMeal.type}</h2>
                <p>{selectedMeal.items.join(', ')}</p>
              </div>
            )}
            <Link to="/feedback" className="back-button">← Back to all meals</Link>
          </div>
          
          <FeedbackForm 
            mealId={mealId} 
            onFeedbackSubmitted={handleFeedbackSubmitted}
            alreadySubmitted={hasSubmitted}
          />
          
          <div className="feedback-list">
            <h2>All Feedback for this Meal</h2>
            {feedbackList.length === 0 ? (
              <p className="no-feedback">No feedback yet. Be the first to share your thoughts!</p>
            ) : (
              <div className="feedback-grid">
                {feedbackList.map((feedback) => (
                  <div key={feedback._id} className="feedback-card">
                    <div className="feedback-rating">
                      <span className="stars">{'★'.repeat(feedback.rating)}{'☆'.repeat(5-feedback.rating)}</span>
                      <span className="rating-text">{feedback.rating}/5</span>
                    </div>
                    {feedback.comment && (
                      <div className="feedback-comment">
                        "{feedback.comment}"
                      </div>
                    )}
                    <div className="feedback-meta">
                      <span className="feedback-author">
                        {typeof feedback.user === 'object' ? feedback.user.name : 'Anonymous'}
                      </span>
                      <span className="feedback-date">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="feedback-intro">
          <div className="meals-grid">
            {meals.map((meal) => (
              <div key={meal._id} className="meal-card">
                <h3>{meal.type}</h3>
                <p className="meal-items">{Array.isArray(meal.items) ? meal.items.join(', ') : ''}</p>
                <div className="meal-stats">
                  <span className="meal-rating">
                    {meal.averageRating ? (
                      <>
                        <span className="stars">{'★'.repeat(Math.round(meal.averageRating))}{'☆'.repeat(5-Math.round(meal.averageRating))}</span>
                        <span className="rating-text">{meal.averageRating.toFixed(1)}/5</span>
                      </>
                    ) : 'No ratings yet'}
                  </span>
                  <Link to={`/feedback/${meal._id}`} className="view-feedback-btn">
                    {isAuthenticated ? 'Give Feedback' : 'View Feedback'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
