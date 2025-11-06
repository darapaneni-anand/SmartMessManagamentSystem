import React, { useEffect, useState } from 'react';
import { getAllComplaints, updateComplaintStatus } from "../api/complaintApi";
import api from '../api/axiosConfig';

// Meal Modal Component
const MealModal = ({ meal, onClose, onSave }) => {
  const [mealData, setMealData] = useState({
    type: meal?.type || '',
    name: meal?.name || '',
    date: meal?.date ? new Date(meal.date).toISOString().slice(0, 10) : '',
    time: meal?.time || '',
    description: meal?.description || '',
    items: meal?.items?.join(', ') || '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(meal?.imageUrl || null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...meal,
      type: mealData.type,
      name: mealData.name,
      date: mealData.date,
      time: mealData.time,
      description: mealData.description,
      items: mealData.items.split(',').map(item => item.trim()),
      file,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="sticky top-0 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{meal ? 'Edit Meal' : 'Add New Meal'}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Type *</label>
              <input
                type="text"
                value={mealData.type}
                onChange={(e) => setMealData({...mealData, type: e.target.value})}
                required
                className="w-full px-4 py-2 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                placeholder="Breakfast, Lunch, Dinner"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={mealData.name}
                onChange={(e) => setMealData({ ...mealData, name: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={mealData.date}
                onChange={(e) => setMealData({ ...mealData, date: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
              <input
                type="text"
                placeholder="Breakfast / Lunch / Dinner or HH:MM"
                value={mealData.time}
                onChange={(e) => setMealData({ ...mealData, time: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Items (comma-separated) *</label>
            <textarea
              value={mealData.items}
              onChange={(e) => setMealData({...mealData, items: e.target.value})}
              required
              rows={3}
              className="w-full px-4 py-2 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={mealData.description}
              onChange={(e) => setMealData({ ...mealData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="w-full px-4 py-2 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
            />
            {preview && (
              <div className="mt-3">
                <img src={preview} alt="Preview" className="max-w-xs rounded-xl border-2 border-gray-200" />
              </div>
            )}
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white font-semibold rounded-xl hover:shadow-lg transition-all">
              Save
            </button>
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
  const [activeTab, setActiveTab] = useState('meals');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [stats, setStats] = useState({
    totalMeals: 0,
    activeComplaints: 0,
    resolvedComplaints: 0,
    averageRating: '0.0',
  });

  // Get today's date string (YYYY-MM-DD)
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Filter meals for today
  const getTodayMeals = (allMeals) => {
    const today = getTodayDate();
    return allMeals.filter(meal => {
      if (!meal.date) return false;
      const mealDate = new Date(meal.date).toISOString().split('T')[0];
      return mealDate === today;
    });
  };

  // Calculate average rating for today's meals only
  const calculateTodayAverageRating = (allMeals) => {
    const todayMeals = getTodayMeals(allMeals);
    if (todayMeals.length === 0) return 0;
    
    const totalRating = todayMeals.reduce((acc, meal) => {
      const rating = typeof meal.averageRating === 'number' ? meal.averageRating : 0;
      return acc + rating;
    }, 0);
    
    return totalRating / todayMeals.length;
  };

  const fetchDashboardData = async () => {
    try {
      const [mealsRes, complaintsRes] = await Promise.all([
        api.get('/meals'),
        getAllComplaints()
      ]);

      const allMeals = mealsRes.data || [];
      setMeals(allMeals);
      setComplaints(complaintsRes.data || []);

      // Calculate stats
      const activeComplaints = complaintsRes.data.filter(c => c.status.toLowerCase() !== 'resolved').length;
      const resolvedComplaints = complaintsRes.data.filter(c => c.status.toLowerCase() === 'resolved').length;
      const avgRating = calculateTodayAverageRating(allMeals);

      setStats({
        totalMeals: allMeals.length, // Still count all meals
        activeComplaints,
        resolvedComplaints,
        averageRating: avgRating.toFixed(1),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showMessage('Failed to load dashboard data', 'error');
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
        await api.delete(`/meals/${mealId}`);
        fetchDashboardData();
        showMessage('Meal deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting meal:', error);
        showMessage(`Failed to delete meal: ${error.response?.data?.message || error.message}`, 'error');
      }
    }
  };

  const handleMealSave = async (mealData) => {
    try {
      const form = new FormData();
      ['type','name','date','time','description'].forEach((k) => {
        if (mealData[k] !== undefined && mealData[k] !== null && mealData[k] !== '') form.append(k, mealData[k]);
      });
      if (Array.isArray(mealData.items)) form.append('items', mealData.items.join(','));
      if (mealData.file) form.append('image', mealData.file);

      if (mealData._id) {
        await api.put(`/meals/${mealData._id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
        showMessage('Meal updated successfully!', 'success');
      } else {
        await api.post('/meals', form, { headers: { 'Content-Type': 'multipart/form-data' } });
        showMessage('New meal added successfully!', 'success');
      }
      setShowModal(false);
      setSelectedMeal(null);
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving meal:', error);
      showMessage(error.response?.data?.message || 'Failed to save meal', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Get today's meals for display
  const todayMeals = getTodayMeals(meals);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Admin Panel
          </h2>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('meals')}
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'meals'
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            📦 Meals
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'complaints'
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            📋 Complaints
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-50 border-l-4 border-green-500 text-green-700' 
              : 'bg-red-50 border-l-4 border-red-500 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2">Manage meals and complaints</p>
          </div>
          {activeTab === 'meals' && (
            <button
              onClick={() => {
                setSelectedMeal(null);
                setShowModal(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              + Add New Meal
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border-t-4 border-blue-500 border border-gray-200">
            <div className="text-gray-600 text-sm font-semibold mb-2">Total Meals</div>
            <div className="text-4xl font-bold text-gray-900">{stats.totalMeals}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border-t-4 border-yellow-500 border border-gray-200">
            <div className="text-gray-600 text-sm font-semibold mb-2">Active Complaints</div>
            <div className="text-4xl font-bold text-gray-900">{stats.activeComplaints}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border-t-4 border-green-500 border border-gray-200">
            <div className="text-gray-600 text-sm font-semibold mb-2">Resolved</div>
            <div className="text-4xl font-bold text-gray-900">{stats.resolvedComplaints}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border-t-4 border-purple-500 border border-gray-200">
            <div className="text-gray-600 text-sm font-semibold mb-2">Avg Rating (Today)</div>
            <div className="text-4xl font-bold text-gray-900">⭐ {stats.averageRating}</div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'meals' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Meals Management</h2>
              <p className="text-gray-600 mt-1">Manage all meals in the system</p>
            </div>
            {meals.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No meals found. Add your first meal!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meals.map(meal => {
                  // Calculate rating for today's meals only in display
                  const isTodayMeal = meal.date && new Date(meal.date).toISOString().split('T')[0] === getTodayDate();
                  const displayRating = isTodayMeal && typeof meal.averageRating === 'number' 
                    ? Number(meal.averageRating).toFixed(1) 
                    : '0.0';
                  
                  return (
                    <div key={meal._id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{meal.type}</h3>
                          {meal.name && <p className="text-sm text-gray-600 mt-1">{meal.name}</p>}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1 text-yellow-500">
                            ⭐ <span className="text-gray-700 font-semibold text-sm">{displayRating}</span>
                          </div>
                          {isTodayMeal && (
                            <span className="text-xs text-blue-600 font-medium">Today</span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {Array.isArray(meal.items) ? meal.items.join(", ") : ''}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMealEdit(meal)}
                          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleMealDelete(meal._id)}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Complaints Management</h2>
              <p className="text-gray-600 mt-1">View and manage all complaints</p>
            </div>
            {complaints.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No complaints found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complaints.map(complaint => (
                  <div key={complaint._id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{complaint.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${
                        complaint.status.toLowerCase() === 'resolved' 
                          ? 'bg-green-50 text-green-800 border border-green-200' 
                          : complaint.status.toLowerCase() === 'processing'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{complaint.description}</p>
                    {complaint.status.toLowerCase() !== 'resolved' && (
                      <button
                        onClick={() => handleStatusUpdate(complaint._id, 'Resolved')}
                        className="w-full px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
      </main>
    </div>
  );
};

export default AdminDashboard;
