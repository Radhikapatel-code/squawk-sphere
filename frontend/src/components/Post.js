import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Post = ({ post, onUpdate }) => {
  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const res = await axios.post(`http://localhost:5000/api/post/${post._id}/like`, {}, {
        headers: { 'x-auth-token': token },
      });
      console.log('Like response:', res.data); // Debug
      onUpdate();
    } catch (err) {
      console.error('Like error:', err.response?.data); // Debug
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const text = e.target.comment.value;
    if (!text) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const res = await axios.post(`http://localhost:5000/api/post/${post._id}/comment`, { text }, {
        headers: { 'x-auth-token': token },
      });
      console.log('Comment response:', res.data); // Debug
      e.target.comment.value = '';
      onUpdate();
    } catch (err) {
      console.error('Comment error:', err.response?.data); // Debug
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <Link to={`/profile/${post.user._id}`} className="text-blue-400 hover:underline">
        <h3 className="text-lg font-bold">{post.user.username}</h3>
      </Link>
      <p className="mt-2 text-gray-300">{post.content}</p>
      {post.music && (
        <audio controls className="mt-4 w-full">
          <source src={`http://localhost:5000${post.music}`} type="audio/mpeg" />
        </audio>
      )}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="mt-2">
          {post.hashtags.map((tag, index) => (
            <Link key={index} to={`/hashtag/${tag}`} className="text-blue-400 hover:underline mr-2">
              #{tag}
            </Link>
          ))}
        </div>
      )}
      <div className="mt-4">
        <button
          onClick={handleLike}
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded mr-2"
        >
          Like ({post.likes.length})
        </button>
      </div>
      <form onSubmit={handleComment} className="mt-4">
        <input
          type="text"
          name="comment"
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
          placeholder="Add a comment"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
        >
          Comment
        </button>
      </form>
      {post.comments && post.comments.map(comment => (
        <div key={comment._id} className="mt-2 text-gray-400">
          <strong>{comment.user.username}:</strong> {comment.text}
        </div>
      ))}
    </div>
  );
};

export default Post;