import Complaint from "../models/Complaint.js";
import { asyncHandler, sendSuccess, sendError, sendCreated, sendNotFound } from "../utils/response.js";

export const addComplaint = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return sendError(res, "Title and description are required", 400);
  }

  const complaint = new Complaint({
    user: req.user._id,
    title: title.trim(),
    description: description.trim()
  });

  await complaint.save();
  sendCreated(res, complaint, "Complaint submitted successfully");
});

export const getAllComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  sendSuccess(res, complaints);
});

export const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ user: req.user._id })
    .sort({ createdAt: -1 });
  sendSuccess(res, complaints);
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status) {
    return sendError(res, "Status is required", 400);
  }

  const validStatuses = ['Pending', 'Processing', 'Resolved'];
  if (!validStatuses.includes(status)) {
    return sendError(res, `Status must be one of: ${validStatuses.join(', ')}`, 400);
  }

  const complaint = await Complaint.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!complaint) {
    return sendNotFound(res, 'Complaint not found');
  }

  sendSuccess(res, complaint, 'Complaint status updated successfully');
});
