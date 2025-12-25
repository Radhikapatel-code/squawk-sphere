import { useState } from "react";
import { createPost } from "../services/api";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [priority, setPriority] = useState("NORMAL");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitPost = async () => {
    try {
      setError("");

      if (!title || !content || !category) {
        setError("Please fill all required fields");
        return;
      }

      await createPost({
        title,
        content,
        category,
        priority,
      });

      navigate("/feed");
    } catch (err) {
      console.error("Create post failed:", err.message);
      setError(err.message || "Failed to create post");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create Post</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="input"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <select
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="GENERAL">General</option>
          <option value="ACADEMIC">Academic</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="EVENT">Event</option>
          <option value="EMERGENCY">Emergency</option>
          <option value="LOST_FOUND">Lost & Found</option>
        </select>

        <select
          className="input"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="NORMAL">Normal</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <button className="button primary" onClick={submitPost}>
          Publish
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
