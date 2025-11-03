import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FeedbackPage from "./pages/FeedbackPage";
import ComplaintPage from "./pages/ComplaintPage";
import AdminDashboard from "./pages/AdminDashboard";
import Menu from "./pages/Menu";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/feedback" 
                element={
                  <ProtectedRoute roles={['student', 'staff']}>
                    <FeedbackPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/feedback/:mealId" 
                element={
                  <ProtectedRoute roles={['student', 'staff']}>
                    <FeedbackPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/complaints" 
                element={
                  <ProtectedRoute roles={['student', 'staff']}>
                    <ComplaintPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
