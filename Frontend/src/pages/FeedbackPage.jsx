import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFeedbackByMeal } from "../api/feedbackApi";
import FeedbackForm from "../components/FeedbackForm";

const FeedbackPage = () => {
  const { mealId } = useParams();
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState([]);
  const [error, setError] = useState(null);

  const fetchFeedback = async () => {
    try {
      if (!mealId) {
        navigate('/');
        return;
      }
      const res = await getFeedbackByMeal(mealId);
      setFeedbackList(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching feedback');
      console.error('Error fetching feedback:', err);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [mealId, navigate]);

  return (
    <div>
      <h1>Feedback</h1>
      <FeedbackForm mealId={mealId} />
      <h2>All Feedback:</h2>
      <ul>
        {feedbackList.map((f) => (
          <li key={f._id}>
            Rating: {f.rating}, Comment: {f.comment}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackPage;
