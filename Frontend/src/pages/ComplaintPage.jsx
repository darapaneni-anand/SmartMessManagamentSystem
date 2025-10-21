import React, { useEffect, useState } from "react";
import { getAllComplaints, addComplaint } from "../api/complaintApi";

const ComplaintPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchComplaints = async () => {
    const res = await getAllComplaints();
    setComplaints(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addComplaint({ user: "Anonymous", title, description });
    setTitle("");
    setDescription("");
    fetchComplaints();
    alert("Complaint submitted ");
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div>
      <h1>Complaints</h1>
      <form onSubmit={handleSubmit}>
        <input value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <textarea value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">Submit Complaint</button>
      </form>
      <h2>All Complaints:</h2>
      <ul>
        {complaints.map((c) => (
          <li key={c._id}>
            {c.title} - {c.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComplaintPage;
