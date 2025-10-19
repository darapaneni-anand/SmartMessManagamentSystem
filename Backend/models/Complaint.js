import mongoose from "mongoose";
const complaintSchema = new mongoose.Schema({
 user:String,
 title:String,
 description:String,
 status:{type:String,default:"Pending"},
 createdAt:{type:Date,default:Date.now},
});
export default mongoose.model("Complaint",complaintSchema);