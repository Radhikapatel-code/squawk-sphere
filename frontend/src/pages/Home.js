import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostForm from '../components/PostForm';
import Post from '../components/Post';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchTag, setSearchTag] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in');
        navigate('/login');
        return;
      }
      const res = await axios.get('http://localhost:5000/api/post', {
        headers: { 'x-auth-token': token },
      });
      console.log('Posts fetched:', res.data); // Debug
      setPosts(res.data);
      setError('');
    } catch (err) {
      console.error('Fetch posts error:', err.response?.data); // Debug
      setError(err.response?.data?.message || 'Failed to load posts');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTag) {
      navigate(`/hashtag/${searchTag}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
          placeholder="Search for hashtags..."
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </form>
      <PostForm onPostCreated={fetchPosts} />
      {posts.length > 0 ? (
        posts.map(post => (
          <Post key={post._id} post={post} onUpdate={fetchPosts} />
        ))
      ) : (
        <p className="text-gray-400">No posts available. Create one above!</p>
      )}
    </div>
  );
};

export default Home;