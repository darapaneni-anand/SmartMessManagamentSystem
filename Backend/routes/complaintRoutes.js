import express from "express";
import {
    addComplaint,
    getAllComplaints,
    getMyComplaints,
    updateComplaintStatus
} from "../controllers/complaintController.js";
import { auth } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

// Students can submit complaints and view their own
router.post("/", auth, addComplaint);
router.get("/mine", auth, getMyComplaints);

// Staff and admin can view all complaints and update status
router.get("/", auth, authorize('staff', 'admin'), getAllComplaints);
router.put("/:id", auth, authorize('staff', 'admin'), updateComplaintStatus);

export default router;