import express from "express";
import { addFeedback, getFeedbackByMeal } from "../controllers/feedbackController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Must be authenticated to give feedback
router.post("/", auth, addFeedback);
// Anyone can view feedback
router.get("/:mealId", getFeedbackByMeal);

export default router;