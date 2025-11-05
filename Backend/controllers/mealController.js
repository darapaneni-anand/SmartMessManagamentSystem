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
        res.status(400).json({message:err.message});
    }
};

export const updateMeal = async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const updatedMeal = await Meal.findByIdAndUpdate(id, update, { new: true });
        if (!updatedMeal) return res.status(404).json({ message: 'Meal not found' });
        res.json(updatedMeal);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteMeal = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Meal.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Meal not found' });
        res.json({ message: 'Meal deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
