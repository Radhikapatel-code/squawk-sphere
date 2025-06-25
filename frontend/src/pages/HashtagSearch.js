import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from '../components/Post';

const HashtagSearch = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/post/hashtag/${tag}`);
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, [tag]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Top Posts for #{tag}</h2>
      {posts.length > 0 ? (
        posts.map(post => <Post key={post._id} post={post} onUpdate={() => fetchPosts()} />)
      ) : (
        <p className="text-gray-400">No posts found for #{tag}</p>
      )}
    </div>
  );
};

export default HashtagSearch;