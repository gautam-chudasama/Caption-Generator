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
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = async (showRetryLoader = false) => {
    if (showRetryLoader) setRetrying(true);

    try {
      const response = await api.get("/api/posts");
      setPosts(response.data.posts || []);
      setError("");
      setImageLoadErrors(new Set()); // Reset image errors on successful fetch
    } catch (err) {
      if (err.response?.status === 401) {
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
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedPost(null);
    document.body.style.overflow = "unset";
  };

  const handleImageError = (postId) => {
    setImageLoadErrors((prev) => new Set(prev).add(postId));
  };

  const handleKeyPress = (event, callback) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Enhanced loading component
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>✨ Loading amazing moments...</p>
      </div>
    );
  }

  // Enhanced error state
  if (error && user) {
    return (
      <div className="empty-state">
        <div
          style={{
            fontSize: "80px",
            marginBottom: "24px",
            animation: "bounce 2s infinite",
          }}
        >
          😞
        </div>
        <h3>Oops! Something went wrong</h3>
        <p style={{ color: "var(--error-color)", marginBottom: "40px" }}>
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
      {/* Enhanced header with animated gradient text */}
      <div className="feed-header">
        <h1 className="gradient-text">Discover Amazing Moments</h1>
        <p>
          🎨 AI-powered captions that bring your photos to life with creativity
          and fun ✨
        </p>
      </div>

      {posts.length > 0 ? (
        <>
          {/* Posts statistics */}
          <div className="posts-stats">
            <p>
              🌟 {posts.length} amazing{" "}
              {posts.length === 1 ? "moment" : "moments"} shared by our creative
              community
            </p>
          </div>

          {/* Enhanced posts grid with staggered animations */}
          <div className="posts-grid">
            {posts.map((post, index) => (
              <div
                key={post._id}
                className="post-card glass-card slide-in-up"
                onClick={() => handlePostClick(post)}
                onKeyPress={(e) =>
                  handleKeyPress(e, () => handlePostClick(post))
                }
                tabIndex={0}
                role="button"
                aria-label={`View post by ${
                  post.user?.username || "anonymous"
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {!imageLoadErrors.has(post._id) ? (
                  <img
                    src={post.image}
                    alt={`Post by ${post.user?.username || "anonymous"}`}
                    loading="lazy"
                    onError={() => handleImageError(post._id)}
                  />
                ) : (
                  <div
                    className="image-placeholder"
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-muted)",
                      fontSize: "48px",
                    }}
                  >
                    📸
                  </div>
                )}

                <div className="post-overlay">
                  <p className="post-caption">{post.caption}</p>
                  <div className="post-meta">
                    <p className="post-author">
                      👤 @{post.user?.username || "anonymous"}
                    </p>
                    {post.createdAt && (
                      <p
                        className="post-date"
                        style={{
                          fontSize: "12px",
                          color: "rgba(255, 255, 255, 0.8)",
                          marginTop: "8px",
                        }}
                      >
                        🕒{" "}
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to action for authenticated users */}
          {user && (
            <div
              style={{
                textAlign: "center",
                marginTop: "60px",
                animation: "fadeInUp 1s ease-out",
              }}
            >
              <div
                style={{
                  background: "var(--bg-glass)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  padding: "40px",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "var(--shadow-xl)",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "20px" }}>🎨</div>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "800",
                    marginBottom: "16px",
                    color: "var(--text-primary)",
                  }}
                >
                  Ready to share your moment?
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    marginBottom: "24px",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  Upload your photo and let AI create the perfect caption
                </p>
                <button
                  onClick={() => navigate("/create")}
                  className="nav-button"
                  style={{ fontSize: "16px", padding: "16px 32px" }}
                >
                  ✨ Create Your Post
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        // Enhanced empty state
        <div className="empty-state">
          <div
            style={{
              fontSize: "100px",
              marginBottom: "32px",
              animation: "bounce 2s ease-in-out infinite",
            }}
          >
            📸
          </div>
          <h3>No posts yet</h3>
          <p>
            {user
              ? "🌟 Be the first to share your moment with an AI-generated caption!"
              : "🎨 Join our creative community to discover and share amazing moments with AI-powered captions"}
          </p>
          {user ? (
            <button className="nav-button" onClick={() => navigate("/create")}>
              ✨ Create Your First Post
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: "20px",
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

      {/* Enhanced Modal with improved accessibility */}
      {selectedPost && (
        <div
          className="modal-overlay"
          onClick={closeModal}
          onKeyPress={(e) => {
            if (e.key === "Escape") closeModal();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close modal"
              title="Close modal"
            >
              ×
            </button>

            {!imageLoadErrors.has(selectedPost._id) ? (
              <img
                src={selectedPost.image}
                alt={`Full size post by ${
                  selectedPost.user?.username || "anonymous"
                }`}
                className="modal-image"
                onError={() => handleImageError(selectedPost._id)}
              />
            ) : (
              <div
                className="modal-image"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-muted)",
                  fontSize: "120px",
                  minHeight: "400px",
                }}
              >
                📸
              </div>
            )}

            <div className="modal-details">
              <h2 id="modal-title" className="modal-caption">
                {selectedPost.caption}
              </h2>
              <div className="modal-meta">
                <p className="modal-author">
                  👤 Posted by @{selectedPost.user?.username || "anonymous"}
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
                        hour: "2-digit",
                        minute: "2-digit",
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
