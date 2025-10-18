import Meal from "../models/Meal.js";
export const getMeals = async(req,res) =>
{
     try{
        const meals = await Meal.find();
        res.json(meals);
     } catch(err)
     {
        res.status(500).json({message:err.message});
     }
};
export const addMeal = async(req,res)=>
{
    try{
        const meal = new Meal(req.body);
        const savedMeal = await meal.save();
        res.status(201).json(savedMeal);

    }catch(err)
    {
        res.status(400).json({mesaage:err.message});
    }
};
