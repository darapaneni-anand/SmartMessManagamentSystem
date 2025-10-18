import mongoose from "mongoose"

const mealSchema = new mongoose.Schema({
 type:{type:String,required:true},
 items:[String],
 averageRating:{type:Number, default:0},

 });
export default mongoose.model("Meal",mealSchema);