import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './components/Profile';
import ProfileSetup from './pages/ProfileSetup';
import HashtagSearch from './pages/HashtagSearch';
import axios from 'axios';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/user/profile/me', {
            headers: { 'x-auth-token': token },
          });
          console.log('Auth check response:', res.data); // Debug
          setIsAuthenticated(true);
          setProfileComplete(res.data.profileComplete);
        } catch (err) {
          console.error('Auth check error:', err.response?.data); // Debug
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setProfileComplete(false);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <div className="bg-gray-900 min-h-screen text-white text-center pt-20">Loading...</div>;

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      console.log('Redirecting to login: not authenticated'); // Debug
      return <Navigate to="/login" />;
    }
    if (!profileComplete) {
      console.log('Redirecting to profile-setup: profile incomplete'); // Debug
      return <Navigate to="/profile-setup" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="bg-gray-900 min-h-screen text-white">
        <Navbar setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} setProfileComplete={setProfileComplete} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile-setup"
            element={<ProfileSetup setProfileComplete={setProfileComplete} />}
          />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/hashtag/:tag" element={<ProtectedRoute><HashtagSearch /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;