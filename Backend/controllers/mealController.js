import Meal from "../models/Meal.js";
import { uploadImage } from "../services/uploadService.js";
import { asyncHandler, sendSuccess, sendError, sendCreated, sendNotFound } from "../utils/response.js";

export const getMeals = asyncHandler(async (req, res) => {
  const meals = await Meal.find().sort({ date: -1, createdAt: -1 });
  sendSuccess(res, meals);
});

export const addMeal = asyncHandler(async (req, res) => {
  const { type, name, date, time, description, items } = req.body;

  if (!type || !items) {
    return sendError(res, 'Type and items are required', 400);
  }

  let imageUrl;
  if (req.file) {
    try {
      imageUrl = await uploadImage(req.file, 'smart-mess/meals');
    } catch (error) {
      return sendError(res, `Image upload failed: ${error.message}`, 400);
    }
  }

  const meal = new Meal({
    type: type.trim(),
    name: name?.trim(),
    date: date ? new Date(date) : undefined,
    time: time?.trim(),
    description: description?.trim(),
    items: Array.isArray(items)
      ? items
      : typeof items === "string" && items.length
      ? items.split(",").map((i) => i.trim()).filter(Boolean)
      : [],
    imageUrl,
  });

  const savedMeal = await meal.save();
  sendCreated(res, savedMeal, 'Meal added successfully');
});

export const updateMeal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, name, date, time, description, items } = req.body;

  const meal = await Meal.findById(id);
  if (!meal) {
    return sendNotFound(res, 'Meal not found');
  }

  const update = {};
  if (type !== undefined) update.type = type.trim();
  if (name !== undefined) update.name = name?.trim();
  if (date !== undefined) update.date = date ? new Date(date) : undefined;
  if (time !== undefined) update.time = time?.trim();
  if (description !== undefined) update.description = description?.trim();
  if (items !== undefined) {
    update.items = Array.isArray(items)
      ? items
      : typeof items === "string"
      ? items.split(",").map((i) => i.trim()).filter(Boolean)
      : [];
  }

  if (req.file) {
    try {
      update.imageUrl = await uploadImage(req.file, 'smart-mess/meals');
    } catch (error) {
      return sendError(res, `Image upload failed: ${error.message}`, 400);
    }
  }

  const updatedMeal = await Meal.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  sendSuccess(res, updatedMeal, 'Meal updated successfully');
});

export const deleteMeal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Meal.findByIdAndDelete(id);
  
  if (!deleted) {
    return sendNotFound(res, 'Meal not found');
  }

  sendSuccess(res, { id: deleted._id }, 'Meal deleted successfully');
});
