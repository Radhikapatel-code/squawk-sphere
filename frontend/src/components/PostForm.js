import React, { useState } from 'react';
import axios from 'axios';

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [music, setMusic] = useState(null);
  const [hashtags, setHashtags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    if (music) formData.append('music', music);
    formData.append('hashtags', hashtags);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/post', formData, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' },
      });
      setContent('');
      setMusic(null);
      setHashtags('');
      onPostCreated();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 mb-4"
          placeholder="What's on your mind?"
          rows="4"
        />
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setMusic(e.target.files[0])}
          className="mb-4 text-gray-300"
        />
        <input
          type="text"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 mb-4"
          placeholder="Hashtags (comma-separated)"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default PostForm;