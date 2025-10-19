import Feedback from "../models/Feedback.js";
import Meal from "../models/Meal.js";

export const addFeedback = async (req,res)=>
{
    try
    {
        const {mealId,rating,comment} = req.body;
        const feedback = new Feedback({mealId,rating,comment});
        await feedback.save()
        const allFeedback = await Feedback.find({mealId});
        const avg = allFeedback.reduce((sum,f) => sum + f.rating ,0) / allFeedback.length;
        await Meal.findByIdAndUpdate(mealId,{averageRating:avg});
        res.status(201).json({messsage:"Feedback added successfuly"});

    }
    catch(error){
        res.status(500).json({message : error.message});
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
        res.status(500).json({message:error.messafe});
    }
};