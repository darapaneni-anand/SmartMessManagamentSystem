import React, { useEffect, useState } from 'react';
import { getAllComplaints, updateComplaintStatus } from "../api/complaintApi";
import axios from 'axios';
import './AdminDashboard.css';

// Create a Modal component for meal editing
const MealModal = ({ meal, onClose, onSave }) => {
  const [mealData, setMealData] = useState({
    type: meal?.type || '',
    items: meal?.items?.join(', ') || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...meal,
      type: mealData.type,
      items: mealData.items.split(',').map(item => item.trim())
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{meal ? 'Edit Meal' : 'Add New Meal'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Meal Type:</label>
            <input
              type="text"
              value={mealData.type}
              onChange={(e) => setMealData({...mealData, type: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Items (comma-separated):</label>
            <textarea
              value={mealData.items}
              onChange={(e) => setMealData({...mealData, items: e.target.value})}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );

};

const AdminDashboard = () => {
  const [meals, setMeals] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [stats, setStats] = useState({
    totalMeals: 0,
    activeComplaints: 0,
    averageRating: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const [mealsRes, complaintsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/meals'),
        getAllComplaints()
      ]);

      setMeals(mealsRes.data);
      setComplaints(complaintsRes.data);

      // Calculate stats
      const activeComplaints = complaintsRes.data.filter(c => c.status.toLowerCase() !== 'resolved').length;
      const avgRating = mealsRes.data.reduce((acc, meal) => acc + meal.averageRating, 0) / mealsRes.data.length;

      setStats({
        totalMeals: mealsRes.data.length,
        activeComplaints,
        averageRating: avgRating.toFixed(1)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateComplaintStatus(id, newStatus);
      fetchDashboardData();
      showMessage('Complaint status updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating complaint status:', error);
      showMessage('Failed to update complaint status', 'error');
    }
  };

  const handleMealEdit = (meal) => {
    setSelectedMeal(meal);
    setShowModal(true);
  };

  const handleMealDelete = async (mealId) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        console.log('Attempting to delete meal id:', mealId);
        const res = await axios.delete(`http://localhost:5000/api/meals/${mealId}`);
        console.log('Delete response:', res.data);
        fetchDashboardData();
        showMessage(res.data?.message || 'Meal deleted successfully!', 'success');
      } catch (error) {
        // Surface server response when available to aid debugging
        console.error('Error deleting meal:', error);
        const serverMsg = error?.response?.data?.message || error?.message || 'Unknown error';
        showMessage(`Failed to delete meal: ${serverMsg}`, 'error');
      }
    }
  };

  const handleMealSave = async (mealData) => {
    try {
      if (mealData._id) {
        // Update existing meal
        await axios.put(`http://localhost:5000/api/meals/${mealData._id}`, mealData);
        showMessage('Meal updated successfully!', 'success');
      } else {
        // Create new meal
        await axios.post('http://localhost:5000/api/meals', mealData);
        showMessage('New meal added successfully!', 'success');
      }
      setShowModal(false);
      setSelectedMeal(null);
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving meal:', error);
      showMessage('Failed to save meal', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="admin-dashboard">
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button 
          className="btn-add" 
          onClick={() => {
            setSelectedMeal(null);
            setShowModal(true);
          }}
        >
          Add New Meal
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card stats-card">
          <h2>Total Meals</h2>
          <div className="stat-value">{stats.totalMeals}</div>
          <div className="stat-label">Available Meals</div>
        </div>

        <div className="dashboard-card stats-card">
          <h2>Active Complaints</h2>
          <div className="stat-value">{stats.activeComplaints}</div>
          <div className="stat-label">Pending Resolution</div>
        </div>

        <div className="dashboard-card stats-card">
          <h2>Average Rating</h2>
          <div className="stat-value">⭐ {stats.averageRating}</div>
          <div className="stat-label">Overall Satisfaction</div>
        </div>
      </div>

      <div className="dashboard-card">
        <h2>Recent Complaints</h2>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(complaint => (
                <tr key={complaint._id}>
                  <td>{complaint.title}</td>
                  <td>{complaint.description}</td>
                  <td>{complaint.status}</td>
                  <td className="status-controls">
                    {complaint.status.toLowerCase() !== 'resolved' && (
                      <>
                        <button 
                          className="btn-edit"
                          onClick={() => handleStatusUpdate(complaint._id, 'Processing')}
                        >
                          Process
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleStatusUpdate(complaint._id, 'Resolved')}
                        >
                          Resolve
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-card">
        <h2>Meals Management</h2>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Items</th>
                <th>Average Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {meals.map(meal => (
                <tr key={meal._id}>
                  <td>{meal.type}</td>
                  <td>{Array.isArray(meal.items) ? meal.items.join(", ") : ''}</td>
                  <td>⭐ {typeof meal.averageRating === 'number' ? meal.averageRating.toFixed(1) : '0.0'}</td>
                  <td className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleMealEdit(meal)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleMealDelete(meal._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <MealModal
          meal={selectedMeal}
          onClose={() => {
            setShowModal(false);
            setSelectedMeal(null);
          }}
          onSave={handleMealSave}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
