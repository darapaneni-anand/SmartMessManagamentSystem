import mongoose from "mongoose"

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mealId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to prevent multiple feedback from same user for same meal
feedbackSchema.index({ user: 1, mealId: 1 }, { unique: true });
export default mongoose.model("Feedback",feedbackSchema);