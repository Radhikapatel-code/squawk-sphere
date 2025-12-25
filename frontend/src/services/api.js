import { auth } from "../firebase/firebase";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

/**
 * Get auth headers from Firebase
 */
const getAuthHeader = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken(true);

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

/**
 * Sync user with backend
 */
export const syncUser = async () => {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE}/users/sync`, {
    method: "POST",
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to sync user");
  }

  return res.json();
};

/**
 * Fetch feed
 */
export const fetchFeed = async () => {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE}/posts/feed`, {
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch feed");
  }

  return res.json();
};

/**
 * Create post
 */
export const createPost = async (postData) => {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers,
    body: JSON.stringify(postData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create post");
  }

  return res.json();
};

/**
 * Like post
 */
export const likePost = async (postId) => {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
    method: "POST",
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to like post");
  }
};

/**
 * Report post
 */
export const reportPost = async (postId) => {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE}/posts/${postId}/report`, {
    method: "POST",
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to report post");
  }
};
