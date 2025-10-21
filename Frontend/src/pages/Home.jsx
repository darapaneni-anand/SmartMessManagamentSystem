// src/pages/Home.js
import React, { useEffect, useState } from "react";
import MealCard from "../components/MealCard";
import axios from "axios";

const Home = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      const res = await axios.get("http://localhost:5000/api/meals");
      setMeals(res.data);
    };
    fetchMeals();
  }, []);

  return (
    <div>
      <h1>Mess Meals</h1>
      <div className="meal-list">
        {meals.map((meal) => (
          <MealCard key={meal._id} meal={meal} />
        ))}
      </div>
    </div>
  );
};

export default Home;
