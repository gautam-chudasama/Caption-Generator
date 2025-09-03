import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await api.get("/api/posts");
        setPosts(response.data.posts);
      } catch (err) {
        if (err.response?.status === 401) {
          // User is not authenticated, posts might require auth
          setPosts([]);
        } else {
          setError(err.response?.data?.message || "Failed to fetch posts");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && user) {
    return (
      <div className="empty-state">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>Discover Amazing Moments</h1>
        <p>AI-powered captions that bring your photos to life</p>
      </div>

      {posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map((post) => (
            <div
              key={post._id}
              className="post-card card"
              onClick={() => setSelectedPost(post)}
            >
              <img src={post.image} alt="post" loading="lazy" />
              <div className="post-overlay">
                <p className="post-caption">{post.caption}</p>
                <p className="post-author">
                  @{post.user?.username || "anonymous"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>
            {user
              ? "Be the first to share your moment with an AI-generated caption!"
              : "Login to see and create posts"}
          </p>
          {user ? (
            <button className="nav-button" onClick={() => navigate("/create")}>
              Create Your First Post
            </button>
          ) : (
            <button className="nav-button" onClick={() => navigate("/login")}>
              Login to Get Started
            </button>
          )}
        </div>
      )}

      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedPost(null)}
            >
              ×
            </button>
            <img src={selectedPost.image} alt="post" className="modal-image" />
            <div className="modal-details">
              <p className="modal-caption">{selectedPost.caption}</p>
              <p className="modal-author">
                Posted by @{selectedPost.user?.username || "anonymous"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
