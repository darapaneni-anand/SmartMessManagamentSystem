import React, { useEffect, useState } from "react";
import { getAllComplaints, updateComplaintStatus } from "../api/complaintApi";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    const res = await getAllComplaints();
    setComplaints(res.data);
  };

  const handleResolve = async (id) => {
    await updateComplaintStatus(id, "Resolved");
    fetchComplaints();
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        {complaints.map((c) => (
          <li key={c._id}>
            {c.title} - {c.status} 
            {c.status === "Pending" && <button onClick={() => handleResolve(c._id)}>Resolve</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
