import mongoose from "mogoose";
const complaintSchema = new mongoose.Schema({
 user:String,
 title:String,
 description:String,
 status:{type:String,default:Pending},
 createdAt:{type:Data,default:Date.now},
});
export default mongoose.model("Complaint",complaintSchema);