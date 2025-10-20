import React,{useState} from "react";
import {addFeedback} from "../api/feedbackApi"

const FeedbackForm = ({mealId}) =>
{
   const[rating,setRating] = useState(5);
   const[comment,setComment] = useState("")

const handleSubmit = async (e)=>
{
    e.preventDefault();
    await addFeedback({mealId,rating,comment});
    alert("Feedback Submitted");
    setComment("");
}
return(
    <form onSubmit ={handleSubmit}>
<label>Rating:</label>
<input type= "number" value={rating} onchange = {(e)=>setRating(e.target.value)} min="1" max="5"/>
<label>Comment:</label>
<textarea value={comment} onChange ={(e)=> setComment(e.target.value)}/>
<button type ="submit"> Submit Feedback</button>
    </form>
);
};

export default FeedbackForm;
