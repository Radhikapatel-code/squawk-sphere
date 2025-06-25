import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">ConnectSphere</Link>
        <div className="flex items-center space-x-4">
          {token ? (
            <>
              <Link to="/profile/me" className="text-blue-400 hover:text-blue-300">Profile</Link>
              <button onClick={handleLogout} className="text-blue-400 hover:text-blue-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-blue-400 hover:text-blue-300">Login</Link>
              <Link to="/register" className="text-blue-400 hover:text-blue-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;