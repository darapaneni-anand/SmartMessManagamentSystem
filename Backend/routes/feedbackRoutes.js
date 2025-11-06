import express from "express";
import { addFeedback, getFeedbackByMeal, getAllFeedback } from "../controllers/feedbackController.js";
import { auth } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

// Must be authenticated to give feedback
router.post("/", auth, addFeedback);

// Get feedback for a specific meal (public)
router.get("/:mealId", getFeedbackByMeal);

// Get all feedback (admin only)
router.get("/", auth, authorize('admin'), getAllFeedback);

export default router;
