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

    const feedback = new Feedback({ mealId, rating, comment });
    await feedback.save();

    const allFeedback = await Feedback.find({ mealId });
    const avg =
      allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;

    await Meal.findByIdAndUpdate(mealId, { averageRating: avg });

    res.status(201).json({ message: "Feedback added successfully " });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getFeedbackByMeal = async(req,res)=>
{
    try{
        const feedback = await Feedback.find({mealId:req.params.mealId});
        res.json(feedback);

    }
    catch(error)
    {
        res.status(500).json({message:error.message});
    }
};