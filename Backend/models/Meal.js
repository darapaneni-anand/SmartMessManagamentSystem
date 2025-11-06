import mongoose from "mongoose"

const mealSchema = new mongoose.Schema({
 type:{type:String,required:true},
 name:{type:String},
 date:{type:Date},
 time:{type:String},
 description:{type:String},
 imageUrl:{type:String},
 items:[String],
 averageRating:{type:Number, default:0},
}, { timestamps: true });

export default mongoose.model("Meal",mealSchema);