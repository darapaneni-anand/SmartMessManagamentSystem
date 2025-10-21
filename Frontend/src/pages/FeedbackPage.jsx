import React, { useEffect, useState } from "react";
import { getFeedbackByMeal } from "../api/feedbackApi";
import FeedbackForm from "../components/FeedbackForm";

const FeedbackPage = ({ mealId }) => {
  const [feedbackList, setFeedbackList] = useState([]);

  const fetchFeedback = async () => {
    const res = await getFeedbackByMeal(mealId);
    setFeedbackList(res.data);
  };

  useEffect(() => {
    fetchFeedback();
  }, [mealId]);

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
