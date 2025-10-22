import React, { useEffect, useState } from "react";
import { getAllComplaints, addComplaint } from "../api/complaintApi";
import "./ComplaintPage.css";

const ComplaintPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    try {
      const res = await getAllComplaints();
      setComplaints(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch complaints. Please try again later.");
      console.error("Error fetching complaints:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await addComplaint({ user: "Anonymous", title, description });
      setTitle("");
      setDescription("");
      fetchComplaints();
      alert("Complaint submitted successfully!");
    } catch (err) {
      setError("Failed to submit complaint. Please try again.");
      console.error("Error submitting complaint:", err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'status-resolved';
      case 'processing': return 'status-processing';
      default: return 'status-pending';
    }
  };

  return (
    <div className="complaint-page">
      <div className="complaint-header">
        <h1>Submit a Complaint</h1>
      </div>

      <div className="complaint-form">
        <form onSubmit={handleSubmit}>
          <input
            value={title}
            placeholder="Complaint Title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            value={description}
            placeholder="Describe your complaint in detail..."
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>

      <div className="complaints-list">
        <h2>Recent Complaints</h2>
        {complaints.map((complaint) => (
          <div key={complaint._id} className="complaint-item">
            <h3>{complaint.title}</h3>
            <p>{complaint.description}</p>
            <div className="complaint-details">
              <span>Submitted by: {complaint.user}</span>
              <span className={`status-badge ${getStatusClass(complaint.status)}`}>
                {complaint.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintPage;
