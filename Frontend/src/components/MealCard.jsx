import React from "react"

const MealCard =({meal})=>
{
 return(
    <div>
        <h3>{meal.type} Meal</h3>
        <p>Items:</p>
        <ul>{meal.items.map((item,index)=>
            {
                <li key={index}>{item}</li>
            })}</ul>
            <p>AverageRating:{meal.averageRating.toFixed(1)}</p>
    </div>
 );
};
export default MealCard;
     