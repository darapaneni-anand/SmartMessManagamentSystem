import React, { useEffect, useState } from "react";
import { getAllComplaints, getMyComplaints, addComplaint, updateComplaintStatus } from "../api/complaintApi";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const ComplaintPage = () => {
  const { user, isAuthenticated, isAdmin, isStaff } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const res = await (isAdmin() || isStaff() ? getAllComplaints() : getMyComplaints());
      setComplaints(res.data || []);
    } catch (err) {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await addComplaint({ title, description });
      toast.success("Complaint submitted!");
      setTitle("");
      setDescription("");
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    const newStatus = status.toLowerCase() === "resolved" ? "Pending" : "Resolved";
    try {
      await updateComplaintStatus(id, newStatus);
      fetchComplaints();
    } catch {
      toast.error("Could not update status");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-5 py-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-semibold text-[#111827]">
            {isAdmin() || isStaff() ? "All Complaints" : "My Complaints"}
          </h1>
        </header>

        {/* Form Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-[#1F2937] mb-4">Submit a Complaint</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              value={title}
              disabled={!isAuthenticated || submitting}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Complaint Title"
              className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <textarea
              rows={4}
              value={description}
              disabled={!isAuthenticated || submitting}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue..."
              className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <button
              type="submit"
              disabled={submitting || !isAuthenticated}
              className="w-full py-3 font-semibold text-white rounded-lg transition bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>

            {!isAuthenticated && (
              <p className="text-center text-sm text-red-600">
                Please log in to submit a complaint.
              </p>
            )}
          </form>
        </div>

        {/* Complaints List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-5 border-b bg-indigo-50">
            <h2 className="text-xl font-semibold text-indigo-700">Recent Complaints</h2>
          </div>

          {loading ? (
            <p className="p-10 text-center text-gray-500">Loading...</p>
          ) : complaints.length === 0 ? (
            <p className="p-10 text-center text-gray-500">No complaints available</p>
          ) : (
            <div className="p-6 grid gap-4 md:grid-cols-2">
              {complaints.map((complaint) => (
                <div key={complaint._id} className="p-5 border rounded-lg bg-white shadow-sm hover:shadow-md">
                  <h3 className="font-semibold text-lg text-gray-900">{complaint.title}</h3>
                  <p className="mt-2 text-gray-600 text-sm">{complaint.description}</p>
                  
                  <div className="mt-4 flex justify-between items-center border-t pt-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      complaint.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {complaint.status}
                    </span>

                    {(isAdmin() || isStaff()) && (
                      <button
                        onClick={() => handleStatusChange(complaint._id, complaint.status)}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        Toggle Status
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ComplaintPage;
