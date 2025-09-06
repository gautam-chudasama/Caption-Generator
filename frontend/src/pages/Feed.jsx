import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = async (showRetryLoader = false) => {
    if (showRetryLoader) setRetrying(true);

    try {
      const response = await api.get("/api/posts");
      setPosts(response.data.posts || []);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        // User is not authenticated, posts might require auth
        setPosts([]);
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to fetch posts. Please try again."
        );
      }
    } finally {
      setLoading(false);
      if (showRetryLoader) setRetrying(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRetry = () => {
    setError("");
    fetchPosts(true);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    // Add scroll lock when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedPost(null);
    // Remove scroll lock when modal is closed
    document.body.style.overflow = "unset";
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading amazing moments...</p>
      </div>
    );
  }

  if (error && user) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>😞</div>
        <h3>Oops! Something went wrong</h3>
        <p style={{ color: "var(--error-color)", marginBottom: "32px" }}>
          {error}
        </p>
        <button
          onClick={handleRetry}
          className="nav-button"
          disabled={retrying}
        >
          {retrying ? (
            <>
              <div className="button-spinner"></div>
              Retrying...
            </>
          ) : (
            "🔄 Try Again"
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="feed-container fade-in">
      <div className="feed-header">
        <h1>Discover Amazing Moments</h1>
        <p>
          AI-powered captions that bring your photos to life with creativity and
          fun
        </p>
      </div>

      {posts.length > 0 ? (
        <>
          <div className="posts-stats">
            <p>
              {posts.length} amazing {posts.length === 1 ? "moment" : "moments"}{" "}
              shared by our community
            </p>
          </div>
          <div className="posts-grid">
            {posts.map((post, index) => (
              <div
                key={post._id}
                className="post-card card"
                onClick={() => handlePostClick(post)}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: "slideInUp 0.5s ease-out forwards",
                }}
              >
                <img
                  src={post.image}
                  alt="User post"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0xMDAgNzBDOTAuNTkgNzAgODMgNzcuNTkgODMgODdDODMgOTYuNDEgOTAuNTkgMTA0IDEwMCAxMDRDMTA5LjQxIDEwNCAxMTcgOTYuNDEgMTE3IDg3QzExNyA3Ny41OSAxMDkuNDEgNzAgMTAwIDcwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBkPSJNMTQwIDEzMEg2MEw3NSAxMDBMOTAgMTE1TDExMCAxMDBMMTQwIDEzMFoiIGZpbGw9IiNEOUQ5RDkiLz4KPC9zdmc+";
                  }}
                />
                <div className="post-overlay">
                  <p className="post-caption">{post.caption}</p>
                  <p className="post-author">
                    📸 @{post.user?.username || "anonymous"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div style={{ fontSize: "80px", marginBottom: "24px" }}>📸</div>
          <h3>No posts yet</h3>
          <p>
            {user
              ? "Be the first to share your moment with an AI-generated caption!"
              : "Join our community to discover and share amazing moments with AI-powered captions"}
          </p>
          {user ? (
            <button className="nav-button" onClick={() => navigate("/create")}>
              ✨ Create Your First Post
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button className="nav-button" onClick={() => navigate("/login")}>
                🚀 Login to Get Started
              </button>
              <button
                className="nav-button secondary"
                onClick={() => navigate("/register")}
              >
                📝 Create Account
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedPost && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ×
            </button>
            <img
              src={selectedPost.image}
              alt="Full size post"
              className="modal-image"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE2cHgiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+";
              }}
            />
            <div className="modal-details">
              <p className="modal-caption">{selectedPost.caption}</p>
              <div className="modal-meta">
                <p className="modal-author">
                  📸 Posted by @{selectedPost.user?.username || "anonymous"}
                </p>
                {selectedPost.createdAt && (
                  <p className="modal-date">
                    🕒{" "}
                    {new Date(selectedPost.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
