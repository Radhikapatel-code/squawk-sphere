import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { fetchFeed, likePost, reportPost } from "../services/api";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for Firebase auth to be ready
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      try {
        const data = await fetchFeed();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Feed load failed:", err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      // Optimistic UI update
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likesCount: p.likesCount + 1 }
            : p
        )
      );
    } catch (err) {
      console.error("Like failed:", err.message);
    }
  };

  const handleReport = async (postId) => {
    try {
      await reportPost(postId);
      alert("Post reported");
    } catch (err) {
      console.error("Report failed:", err.message);
    }
  };

  if (loading) {
    return <p className="container">Loading feed...</p>;
  }

  return (
    <div className="container">
      <h2>Community Feed</h2>

      {posts.length > 0 ? (
        posts.map((post) => (
          <div className="card" key={post._id}>
            <h3>
              {post.title}
              {post.badge && post.badge !== "NONE" && (
                <span style={{ color: "gold", marginLeft: "8px" }}>
                  ⭐ {post.badge}
                </span>
              )}
            </h3>

            <p>{post.content}</p>

            <small>
              {post.category} | {post.priority} | by{" "}
              <b>{post.author?.name}</b>
            </small>

            <div style={{ marginTop: "10px" }}>
              <button
                className="button primary"
                onClick={() => handleLike(post._id)}
              >
                👍 {post.likesCount}
              </button>

              <button
                className="button danger"
                onClick={() => handleReport(post._id)}
              >
                🚩 Report
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
}

export default Feed;
