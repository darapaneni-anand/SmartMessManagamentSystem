import Feedback from "../models/Feedback.js";
import Meal from "../models/Meal.js";
import { asyncHandler, sendSuccess, sendError, sendCreated } from "../utils/response.js";

export const addFeedback = asyncHandler(async (req, res) => {
  const { mealId, rating, comment } = req.body;

  if (!mealId) {
    return sendError(res, "mealId is required", 400);
  }

  if (rating === undefined || rating === null) {
    return sendError(res, "rating is required", 400);
  }

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return sendError(res, "rating must be a number between 1 and 5", 400);
  }

  // Check if meal exists
  const meal = await Meal.findById(mealId);
  if (!meal) {
    return sendError(res, "Meal not found", 404);
  }

  // Check if user has already given feedback
  const existingFeedback = await Feedback.findOne({
    user: req.user._id,
    mealId: mealId
  });

  if (existingFeedback) {
    return sendError(res, "You have already provided feedback for this meal", 400);
  }

  const feedback = new Feedback({
    user: req.user._id,
    mealId,
    rating: Number(rating),
    comment: comment?.trim()
  });

  await feedback.save();

  // Update meal average rating
  const allFeedback = await Feedback.find({ mealId });
  const avg = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;
  await Meal.findByIdAndUpdate(mealId, { averageRating: avg });

  sendCreated(res, feedback, "Feedback added successfully");
});

export const getFeedbackByMeal = asyncHandler(async (req, res) => {
  const { mealId } = req.params;
  
  const feedback = await Feedback.find({ mealId })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
    
  sendSuccess(res, feedback);
});

export const getAllFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find()
    .populate('user', 'name email')
    .populate('mealId', 'type name items')
    .sort({ createdAt: -1 });
    
  sendSuccess(res, feedback);
});
