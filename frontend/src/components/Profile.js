import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Post from './Post';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in');
          navigate('/login');
          return;
        }
        const [userRes, postsRes, currentUserRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/user/profile/${id === 'me' ? 'me' : id}`, {
            headers: { 'x-auth-token': token },
          }),
          axios.get(`http://localhost:5000/api/post`, {
            headers: { 'x-auth-token': token },
          }),
          axios.get(`http://localhost:5000/api/user/profile/me`, {
            headers: { 'x-auth-token': token },
          }),
        ]);
        console.log('Profile data:', userRes.data); // Debug
        setUser(userRes.data);
        setPosts(postsRes.data.filter(post => post.user._id === (id === 'me' ? currentUserRes.data._id : id)));
        setCurrentUser(currentUserRes.data);
      } catch (err) {
        console.error('Profile fetch error:', err.response?.data); // Debug
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    };
    fetchProfile();
  }, [id, navigate]);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/user/follow/${id}`, {}, {
        headers: { 'x-auth-token': token },
      });
      alert('Follow request sent');
      // Refresh profile
      const res = await axios.get(`http://localhost:5000/api/user/profile/${id}`, {
        headers: { 'x-auth-token': token },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Follow error:', err.response?.data); // Debug
      setError(err.response?.data?.message || 'Failed to send follow request');
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/user/unfollow/${id}`, {}, {
        headers: { 'x-auth-token': token },
      });
      alert('Unfollowed user');
      // Refresh profile
      const res = await axios.get(`http://localhost:5000/api/user/profile/${id}`, {
        headers: { 'x-auth-token': token },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Unfollow error:', err.response?.data); // Debug
      setError(err.response?.data?.message || 'Failed to unfollow');
    }
  };

  const handleAcceptFollow = async (requesterId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/user/accept-follow/${requesterId}`, {}, {
        headers: { 'x-auth-token': token },
      });
      alert('Follow request accepted');
      // Refresh profile
      const res = await axios.get(`http://localhost:5000/api/user/profile/${id}`, {
        headers: { 'x-auth-token': token },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Accept follow error:', err.response?.data); // Debug
      setError(err.response?.data?.message || 'Failed to accept follow request');
    }
  };

  const handleRejectFollow = async (requesterId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/user/reject-follow/${requesterId}`, {}, {
        headers: { 'x-auth-token': token },
      });
      alert('Follow request rejected');
      // Refresh profile
      const res = await axios.get(`http://localhost:5000/api/user/profile/${id}`, {
        headers: { 'x-auth-token': token },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Reject follow error:', err.response?.data); // Debug
      setError(err.response?.data?.message || 'Failed to reject follow request');
    }
  };

  if (error) return <div className="bg-gray-900 min-h-screen text-red-500 text-center pt-20">{error}</div>;
  if (!user || !currentUser) return <div className="bg-gray-900 min-h-screen text-white text-center pt-20">Loading...</div>;

  const isOwnProfile = currentUser._id === (id === 'me' ? currentUser._id : id);
  const isFollowing = currentUser.following.some(f => f._id === (id === 'me' ? currentUser._id : id));
  const hasPendingRequest = user.pendingFollowRequests.some(r => r._id === currentUser._id);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-white">{user.username}</h2>
        <p className="text-gray-300 mt-2">{user.bio || 'No bio provided'}</p>
        <p className="text-gray-300">Gender: {user.gender || 'Not specified'}</p>
        <div className="mt-4">
          <p className="text-gray-300">
            Followers: {user.followers.length} | Following: {user.following.length}
          </p>
          {isOwnProfile && user.pendingFollowRequests.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-bold text-white">Pending Follow Requests</h3>
              {user.pendingFollowRequests.map(requester => (
                <div key={requester._id} className="flex items-center space-x-4 mt-2">
                  <span className="text-gray-300">{requester.username}</span>
                  <button
                    onClick={() => handleAcceptFollow(requester._id)}
                    className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectFollow(requester._id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                  >
                    Reject
                  </button>
                </div>
              ))}
            </div>
          )}
          {!isOwnProfile && (
            <div className="mt-4">
              {isFollowing ? (
                <button
                  onClick={handleUnfollow}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                >
                  Unfollow
                </button>
              ) : hasPendingRequest ? (
                <span className="text-gray-300">Follow request pending</span>
              ) : (
                <button
                  onClick={handleFollow}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  Follow
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-4">Posts</h3>
      {posts.length > 0 ? (
        posts.map(post => <Post key={post._id} post={post} onUpdate={() => fetchProfile()} />)
      ) : (
        <p className="text-gray-400">No posts yet</p>
      )}
    </div>
  );
};

export default Profile;