import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import mealRoutes from "./routes/mealRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/meals",mealRoutes);
app.use("/api/complaints",complaintRoutes);
app.get("/",(req,res)=> res.send("Mess Mnagement API is Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Server running on port ${PORT}`));