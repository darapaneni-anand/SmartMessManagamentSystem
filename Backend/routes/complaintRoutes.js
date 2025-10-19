import express from "express"
import {
    addComplaint,getAllComplaints,updateComplaintStatus
} from "../controllers/complaintController.js";
const router =  express.Router();
router.post("/",addComplaint);
router.get("/",getAllComplaints);
router.put("/:id",updateComplaintStatus);

export default router