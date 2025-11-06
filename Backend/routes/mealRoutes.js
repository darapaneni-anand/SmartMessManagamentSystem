import express from "express";
import multer from "multer";
import { getMeals, addMeal, updateMeal, deleteMeal } from "../controllers/mealController.js";
import { auth } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public route - anyone can view meals
router.get("/", getMeals);

// Protected routes - only staff and admin can modify meals
router.post("/", auth, authorize('staff', 'admin'), upload.single('image'), addMeal);
router.put("/:id", auth, authorize('staff', 'admin'), upload.single('image'), updateMeal);
router.delete("/:id", auth, authorize('admin'), deleteMeal); // Only admin can delete

export default router;