import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFeedbackByMeal } from "../api/feedbackApi";
import api from "../api/axiosConfig";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackReviewModal from "../components/FeedbackReviewModal";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { formatDate, renderStars, formatRating } from "../utils/format";
import "./FeedbackPage.css";

const FeedbackPage = () => {
  const { mealId } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [feedbackList, setFeedbackList] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("newest");
  const [error, setError] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const fetchMeals = async () => {
    try {
      const res = await api.get("/meals");
      setMeals(res.data || []);
    } catch {
      toast.error("Failed to load meals");
    }
  };

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      if (!mealId) {
        setFeedbackList([]);
        setError(null);
        return;
      }
      const res = await getFeedbackByMeal(mealId);
      setFeedbackList(res.data || []);
      setError(null);
    } catch (err) {
      const msg = err?.response?.data?.message || "Error fetching feedback";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [mealId]);

  useEffect(() => {
    if (mealId && user) {
      const found = feedbackList?.some((f) => {
        const uid = typeof f.user === "string" ? f.user : f.user?._id;
        return uid === user._id || uid === user.id;
      });
      setHasSubmitted(Boolean(found));
    } else {
      setHasSubmitted(false);
    }
  }, [feedbackList, mealId, user]);

  const selectedMeal = mealId ? meals.find((m) => m._id === mealId) : null;

  const avgFromList =
    feedbackList?.length > 0
      ? feedbackList.reduce((s, f) => s + (f.rating || 0), 0) / feedbackList.length
      : 0;

  const averageRating =
    typeof selectedMeal?.averageRating === "number" && selectedMeal.averageRating > 0
      ? selectedMeal.averageRating
      : avgFromList;

  const sortedFeedback = [...feedbackList].sort((a, b) => {
    if (sortOption === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "highest") return b.rating - a.rating;
    if (sortOption === "lowest") return a.rating - b.rating;
    return 0;
  });

  const onFeedbackSubmitted = () => {
    fetchFeedback();
  };

  if (loading) {
    return (
      <div className="fp-wrap">
        <div className="fp-header">
          <h1>Meal Feedback</h1>
        </div>
        <div className="fp-card skeleton h-40" />
        <div className="fp-card skeleton h-28" />
      </div>
    );
  }

  return (
    <div className="fp-wrap">
      <div className="fp-header">
        <h1>Meal Feedback</h1>
        {error && <div className="fp-alert">{error}</div>}
      </div>

      {/* If a meal is selected, show its header + form + list */}
      {mealId ? (
        <>
          {selectedMeal && (
            <section className="fp-card fp-meal-card">
              <div className="fp-meal-media">
                <img
                  src={
                    selectedMeal.imageUrl ||
                    `https://source.unsplash.com/640x420/?${encodeURIComponent(selectedMeal.type || "food")}`
                  }
                  alt={selectedMeal.type}
                />
              </div>
              <div className="fp-meal-body">
                <div className="fp-badge">{selectedMeal.type}</div>
                <h2 className="fp-title">{selectedMeal.name || selectedMeal.type}</h2>
                <p className="fp-subtext">
                  {Array.isArray(selectedMeal.items) ? selectedMeal.items.join(", ") : selectedMeal.items || ""}
                </p>

                {averageRating > 0 && (
                  <div className="fp-rating-line">
                    <span className="stars">{renderStars(averageRating)}</span>
                    <span className="fp-rating">{formatRating(averageRating)}/5</span>
                    <span className="fp-muted">({feedbackList.length} {feedbackList.length === 1 ? "review" : "reviews"})</span>
                  </div>
                )}

                <Link to="/feedback" className="fp-link">
                  ← Back to all meals
                </Link>
              </div>
            </section>
          )}

          <FeedbackForm
            mealId={mealId}
            onFeedbackSubmitted={onFeedbackSubmitted}
            alreadySubmitted={hasSubmitted}
            accent="blue"
          />

          <section className="fp-card">
            <div className="fp-controls">
              <label htmlFor="sort">Sort by</label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="fp-select"
              >
                <option value="newest">Newest first</option>
                <option value="highest">Highest rating</option>
                <option value="lowest">Lowest rating</option>
              </select>
            </div>

            <h2 className="fp-section-title">All feedback</h2>

            {sortedFeedback.length === 0 ? (
              <p className="fp-muted center">No feedback yet. Be the first to share your thoughts.</p>
            ) : (
              <div className="fp-grid">
                {sortedFeedback.map((fb) => {
                  const name =
                    typeof fb.user === "object"
                      ? fb.user?.name || fb.user?.email || "User"
                      : "Anonymous";
                  const avatar = (name || "U").charAt(0).toUpperCase();
                  
                  // Include meal data in feedback for modal
                  const feedbackWithMeal = {
                    ...fb,
                    meal: selectedMeal || fb.meal,
                    mealId: mealId || fb.mealId
                  };

                  return (
                     <article key={fb._id} className="fp-item">
                       <div className="fp-item-head">
                         <div className="fp-avatar">{avatar}</div>
                         <div className="fp-user">
                           <span className="fp-user-name">{name}</span>
                           <span className="fp-date">{formatDate(fb.createdAt)}</span>
                         </div>
                       </div>

                       <div className="fp-stars">
                         <span className="stars">{renderStars(fb.rating)}</span>
                         <span className="fp-rating">{formatRating(fb.rating)}/5</span>
                       </div>

                       {fb.comment && <p className="fp-comment">"{fb.comment}"</p>}
                       
                       <button
                         onClick={() => setSelectedFeedback(feedbackWithMeal)}
                         className="mt-3 text-sm text-blue-600 hover:underline"
                       >
                         View Full Review →
                       </button>
                     </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      ) : (
        // No meal selected → list all meals
        <section>
          <div className="fp-grid fp-meal-grid">
            {meals.map((m) => (
              <article key={m._id} className="fp-card fp-meal-tile">
                <div className="fp-meal-tile-media">
                  <img
                    src={
                      m.imageUrl ||
                      `https://source.unsplash.com/600x360/?${encodeURIComponent(m.type || "meal")}`
                    }
                    alt={m.type}
                  />
                </div>
                <div className="fp-meal-tile-body">
                  <h3 className="fp-title-sm">{m.type}</h3>
                  <p className="fp-subtext">{Array.isArray(m.items) ? m.items.join(", ") : ""}</p>

                  <div className="fp-tile-footer">
                    <div className="fp-stars">
                      {typeof m.averageRating === "number" && m.averageRating > 0 ? (
                        <>
                          <span className="stars">{renderStars(m.averageRating)}</span>
                          <span className="fp-rating">{formatRating(m.averageRating)}/5</span>
                        </>
                      ) : (
                        <span className="fp-muted">No ratings yet</span>
                      )}
                    </div>
                    <Link to={`/feedback/${m._id}`} className="fp-btn">
                      {isAuthenticated ? "Give feedback" : "View feedback"}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      
      {selectedFeedback && (
        <FeedbackReviewModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}
    </div>
  );
};

export default FeedbackPage;
