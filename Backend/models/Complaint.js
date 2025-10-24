import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
export default mongoose.model("Complaint",complaintSchema);