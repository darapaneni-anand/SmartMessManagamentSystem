import Feedback from "../models/Feedback.js";
import Meal from "../models/Meal.js";

export const addFeedback = async (req, res) => {
  try {
    const { mealId, rating, comment } = req.body;
    if (!mealId) {
      return res.status(400).json({ message: "mealId is required" });
    }
    if (rating === undefined || rating === null) {
      return res.status(400).json({ message: "rating is required" });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "rating must be a number between 1 and 5" });
    }

    // First check if the meal exists
    const meal = await Meal.findById(mealId);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    // Check if user has already given feedback for this meal
    const existingFeedback = await Feedback.findOne({
      user: req.user._id,
      mealId: mealId
    });

    if (existingFeedback) {
      return res.status(400).json({ 
        message: "You have already provided feedback for this meal" 
      });
    }

    const feedback = new Feedback({
      user: req.user._id,
      mealId,
      rating,
      comment
    });
    await feedback.save();

    const allFeedback = await Feedback.find({ mealId });
    const avg =
      allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;

    await Meal.findByIdAndUpdate(mealId, { averageRating: avg });

    res.status(201).json({ message: "Feedback added successfully " });
  } catch (error) {
    console.error(error);
    // Handle duplicate key error from unique index
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already provided feedback for this meal' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getFeedbackByMeal = async (req, res) => {
  try {
    // Populate user name/email for display on frontend and sort by newest
    const feedback = await Feedback.find({ mealId: req.params.mealId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};