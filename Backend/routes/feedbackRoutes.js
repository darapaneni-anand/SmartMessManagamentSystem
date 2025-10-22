import express from "express";
import { addFeedback, getFeedbackByMeal } from "../controllers/feedbackController.js";
const router = express.Router();

router.post("/", addFeedback);
router.get("/:mealId", getFeedbackByMeal);

export default router;