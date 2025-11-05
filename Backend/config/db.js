import mongoose from "mongoose"
const connectDB = async() =>
{
    try{
        if(!process.env.MONGO_URI){
            console.error("FATAL ERROR: MONGO_URI is not defined");
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb connected successfully")
    }
    catch(error)
    {
   console.error("Mongodb Connection failed:", error.message);
   process.exit(1);
    }
};
export default connectDB;