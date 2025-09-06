import { useState, useCallback } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Please select a valid image file (JPEG, PNG, or WebP)");
    }

    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }
  };

  const processFile = useCallback((selectedFile) => {
    setError("");
    setResult(null);

    if (!selectedFile) {
      setFile(null);
      setPreview("");
      return;
    }

    try {
      validateFile(selectedFile);
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError(err.message);
      setFile(null);
      setPreview("");
    }
  }, []);

  const onFile = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image first");
      return;
    }

    setSubmitting(true);
    setError("");
    setUploadProgress(0);

    try {
      const fd = new FormData();
      fd.append("image", file);

      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      const res = await api.post("/api/posts", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setResult(res.data.post);
      }, 500);

      // Auto-redirect to home after 4 seconds
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create post. Please try again."
      );
      setUploadProgress(0);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
    setUploadProgress(0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="create-container">
      <div className="create-card glass-card">
        <h1 className="gradient-text">✨ Create Your Moment</h1>
        <p className="create-subtitle">
          🎨 Upload an image and let AI create the perfect caption with style
          and personality!
        </p>

        {!result ? (
          <form onSubmit={onSubmit}>
            {/* Enhanced File Upload Area with Drag & Drop */}
            <div
              className={`file-upload-area ${dragActive ? "drag-active" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                ...(dragActive && {
                  borderColor: "var(--primary-color)",
                  background: "rgba(102, 126, 234, 0.1)",
                  transform: "scale(1.02)",
                }),
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={onFile}
                disabled={submitting}
              />
              <div
                className="upload-icon"
                style={{
                  ...(dragActive && { transform: "scale(1.2)" }),
                }}
              >
                {dragActive ? "🎯" : "📸"}
              </div>
              <div className="upload-text">
                <p>
                  <strong>
                    {dragActive
                      ? "Drop your image here!"
                      : "Click to upload or drag and drop"}
                  </strong>
                </p>
                <p>PNG, JPG, WebP up to 5MB</p>
              </div>
            </div>

            {/* File Preview with Enhanced Info */}
            {preview && (
              <div className="preview-container">
                <img src={preview} alt="Preview" />
                <button
                  type="button"
                  onClick={resetForm}
                  className="preview-remove"
                  disabled={submitting}
                  title="Remove image"
                >
                  ✕ Remove
                </button>

                {/* File Info */}
                {file && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      left: "16px",
                      background: "rgba(0, 0, 0, 0.8)",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12px",
                      fontWeight: "600",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    📄 {file.name} • {formatFileSize(file.size)}
                  </div>
                )}
              </div>
            )}

            {/* Progress Bar */}
            {submitting && uploadProgress > 0 && (
              <div
                style={{
                  marginBottom: "24px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <div
                  style={{
                    height: "8px",
                    background:
                      "linear-gradient(90deg, var(--primary-color), var(--secondary-color))",
                    width: `${uploadProgress}%`,
                    transition: "width 0.3s ease",
                    borderRadius: "var(--radius)",
                  }}
                ></div>
                <div
                  style={{
                    padding: "8px 16px",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {uploadProgress < 100
                    ? `Uploading... ${Math.round(uploadProgress)}%`
                    : "🎉 Generating your amazing caption!"}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                className="error-message"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  animation: "shake 0.5s ease-in-out",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !file}
              className="create-button"
              style={{
                ...(submitting && {
                  background:
                    "linear-gradient(135deg, var(--accent-color), var(--accent-hover))",
                }),
              }}
            >
              {submitting ? (
                <>
                  <div className="button-spinner"></div>
                  {uploadProgress < 100
                    ? "Uploading Magic..."
                    : "AI is Working..."}
                </>
              ) : (
                <>🚀 Create Amazing Post</>
              )}
            </button>

            {/* Tips */}
            {!file && (
              <div
                style={{
                  marginTop: "32px",
                  padding: "20px",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "var(--radius)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <h4
                  style={{
                    color: "var(--text-primary)",
                    marginBottom: "12px",
                    fontSize: "16px",
                    fontWeight: "700",
                  }}
                >
                  💡 Pro Tips for Best Results:
                </h4>
                <ul
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    paddingLeft: "20px",
                  }}
                >
                  <li>📸 Use high-quality, well-lit photos</li>
                  <li>🎯 Clear subjects work best for captions</li>
                  <li>🌈 Vibrant colors make captions more creative</li>
                  <li>✨ Action shots often get fun, dynamic captions</li>
                </ul>
              </div>
            )}
          </form>
        ) : (
          // Enhanced Result Display
          <div className="result-card">
            <div className="success-header">
              <div className="success-icon">🎉</div>
              <h3>Post Created Successfully!</h3>
              <p>
                🎨 Your moment has been captured with an AI-generated caption
                full of personality
              </p>
            </div>

            <div className="result-preview">
              <img src={result.image} alt="Created post" />
            </div>

            <div className="result-caption">
              <h4>🤖 AI Generated Caption:</h4>
              <p
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: "600",
                  fontSize: "20px",
                }}
              >
                {result.caption}
              </p>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="result-actions">
              <button
                onClick={() => navigate("/")}
                className="view-feed-button"
              >
                📱 View in Feed
              </button>
              <button onClick={resetForm} className="create-another-button">
                ➕ Create Another
              </button>
            </div>

            {/* Share Options */}
            <div
              style={{
                marginBottom: "24px",
                padding: "20px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "var(--radius)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Check out my AI-generated caption!",
                        text: result.caption,
                        url: window.location.origin,
                      });
                    } else {
                      navigator.clipboard.writeText(
                        `${result.caption} - Created with PicCaption AI`
                      );
                      // Show a temporary success message
                      const btn = event.target;
                      const originalText = btn.innerHTML;
                      btn.innerHTML = "✅ Copied!";
                      setTimeout(() => {
                        btn.innerHTML = originalText;
                      }, 2000);
                    }
                  }}
                  style={{
                    padding: "8px 16px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "var(--transition-normal)",
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.2)";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.1)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  📋 Copy Caption
                </button>

                <button
                  onClick={() => {
                    const shareText = `Check out this amazing AI-generated caption: "${result.caption}" - Created with PicCaption! ${window.location.origin}`;
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        shareText
                      )}`,
                      "_blank"
                    );
                  }}
                  style={{
                    padding: "8px 16px",
                    background: "rgba(29, 161, 242, 0.2)",
                    border: "1px solid rgba(29, 161, 242, 0.3)",
                    borderRadius: "var(--radius-sm)",
                    color: "#1DA1F2",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "var(--transition-normal)",
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(29, 161, 242, 0.3)";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(29, 161, 242, 0.2)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  🐦 Tweet
                </button>
              </div>
            </div>

            <div className="auto-redirect">
              <p>✨ Redirecting to feed in 4 seconds...</p>
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "2px",
                  overflow: "hidden",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background:
                      "linear-gradient(90deg, var(--primary-color), var(--secondary-color))",
                    width: "100%",
                    animation: "shrink 4s linear",
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .drag-active {
          border-color: var(--primary-color) !important;
          background: rgba(102, 126, 234, 0.1) !important;
          transform: scale(1.02) !important;
          box-shadow: var(--shadow-glow) !important;
        }

        .file-upload-area:hover {
          border-color: var(--primary-color);
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-4px) scale(1.02);
          box-shadow: var(--shadow-glow);
        }

        .preview-container {
          position: relative;
          margin-bottom: 32px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: zoomIn 0.5s ease-out;
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .preview-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        .preview-remove {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(245, 101, 101, 0.9);
          color: white;
          border: none;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-weight: 700;
          font-size: 14px;
          transition: var(--transition-bounce);
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-md);
          z-index: 2;
        }

        .preview-remove:hover {
          background: var(--error-color);
          transform: scale(1.1);
          box-shadow: var(--shadow-lg);
        }

        .preview-remove:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}
