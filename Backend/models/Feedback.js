import mongoose from "mongoose"
const feedbackSchema = new mongoose.Schema({
    mealId:{type:mongoose.Schema.Types.ObjectId,ref:"Meal"},
    rating: Number,
    comment: String,
    createdAt:{ type: Date ,default: Date.now},
});
export default mongoose.model("Feedback",feedbackSchema);