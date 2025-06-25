import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileSetup = ({ setProfileComplete }) => {
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const res = await axios.get('http://localhost:5000/api/user/profile/me', {
          headers: { 'x-auth-token': token },
        });
        console.log('Profile check response:', res.data); // Debug
        if (res.data.profileComplete) {
          setProfileComplete(true);
          navigate('/');
        }
      } catch (err) {
        console.error('Profile check error:', err.response?.data); // Debug
        setError('Error checking profile');
        navigate('/login');
      }
    };
    checkProfile();
  }, [navigate, setProfileComplete]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in again');
        navigate('/login');
        return;
      }
      const res = await axios.post(
        'http://localhost:5000/api/user/profile',
        { bio, gender },
        { headers: { 'x-auth-token': token } }
      );
      console.log('Profile update response:', res.data); // Debug
      setProfileComplete(true);
      navigate('/');
    } catch (err) {
      console.error('Profile update error:', err.response?.data); // Debug
      setError(err.response?.data?.message || 'Profile update failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Complete Your Profile</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              rows="4"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-200"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;