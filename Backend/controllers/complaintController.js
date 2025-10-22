import Complaint from "../models/Complaint.js";
//Add new complaint 
export const addComplaint = async(req,res)=>
{
 try{
    const { user,title,description } = req.body;
    const complaint =  new Complaint({user,title,description});
    await complaint.save();
    res.status(201).json({message:"Complaint submitted successfully"});

 }
 catch(error)
 {
    res.status(500).json({message:error.message});
 }
};

//get all complaints 
export const getAllComplaints = async (req,res)=>
{
    try{
        const complaints = await Complaint.find().sort({createdAt:-1});
        res.json(complaints);

    }
    catch(error)
    {
        res.status(500).json({message:error.message});
    }
};
export const updateComplaintStatus = async(req,res)=>
{
    try{
        const{status} = req.body;
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        res.json(complaint);
    }
    catch(error)
    {
        res.status(500).json({ message: error.message });
    }
}
