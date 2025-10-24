import React, { useEffect, useState } from "react";
import { getAllComplaints, getMyComplaints, addComplaint } from "../api/complaintApi";
import { useAuth } from "../contexts/AuthContext";
import "./ComplaintPage.css";

const ComplaintPage = () => {
  const { user, isAuthenticated, isAdmin, isStaff } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    if (!isAuthenticated) {
      setError("Please login to view complaints");
      setLoading(false);
      return;
    }

    try {
      const res = await (isAdmin() || isStaff() ? getAllComplaints() : getMyComplaints());
      setComplaints(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch complaints. Please try again later.");
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
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
      await addComplaint({ title: title.trim(), description: description.trim() });
      setTitle("");
      setDescription("");
      fetchComplaints();
      setError(null);
      alert("Complaint submitted successfully!");
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setError(err.response?.data?.message || "Failed to submit complaint. Please try again.");
      if (err.response?.status === 401) {
        setError("Please login to submit a complaint");
      }
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

  if (loading) {
    return (
      <div className="complaint-page">
        <div className="loading">Loading complaints...</div>
      </div>
    );
  }

  return (
    <div className="complaint-page">
      <div className="complaint-header">
        <h1>
          {isAdmin() || isStaff() ? "All Complaints" : "My Complaints"}
        </h1>
      </div>

      <div className="complaint-form">
        <form onSubmit={handleSubmit}>
          <input
            value={title}
            placeholder="Complaint Title"
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isAuthenticated || submitting}
            required
          />
          <textarea
            value={description}
            placeholder="Describe your complaint in detail..."
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isAuthenticated || submitting}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <button 
            type="submit" 
            disabled={submitting || !isAuthenticated}
            className={!isAuthenticated ? 'disabled' : ''}
          >
            {submitting ? "Submitting..." : "Submit Complaint"}
          </button>
          {!isAuthenticated && (
            <p className="auth-message">Please login to submit a complaint</p>
          )}
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
