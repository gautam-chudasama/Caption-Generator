import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
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

  const onFile = (e) => {
    const f = e.target.files[0];
    setError("");
    setResult(null);

    if (!f) {
      setFile(null);
      setPreview("");
      return;
    }

    try {
      validateFile(f);
      setFile(f);

      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    } catch (err) {
      setError(err.message);
      setFile(null);
      setPreview("");
      e.target.value = "";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image first");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("image", file);

      const res = await api.post("/api/posts", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data.post);

      // Auto-redirect to home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create post. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
  };

  return (
    <div className="create-container">
      <div className="create-card">
        <h1>✨ Create Your Moment</h1>
        <p className="create-subtitle">
          Upload an image and let AI create the perfect caption!
        </p>

        {!result ? (
          <form onSubmit={onSubmit}>
            <div className="file-upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={onFile}
                disabled={submitting}
              />
              <div className="upload-icon">📸</div>
              <div className="upload-text">
                <p>
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p>PNG, JPG, WebP up to 5MB</p>
              </div>
            </div>

            {preview && (
              <div className="preview-container">
                <img src={preview} alt="Preview" />
                <button
                  type="button"
                  onClick={resetForm}
                  className="preview-remove"
                  disabled={submitting}
                >
                  ✕ Remove
                </button>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              disabled={submitting || !file}
              className="create-button"
            >
              {submitting ? (
                <>
                  <div className="button-spinner"></div>
                  Generating Magic...
                </>
              ) : (
                <>🚀 Create Post</>
              )}
            </button>
          </form>
        ) : (
          <div className="result-card">
            <div className="success-header">
              <div className="success-icon">🎉</div>
              <h3>Post Created Successfully!</h3>
              <p>Your moment has been captured with an AI-generated caption</p>
            </div>

            <div className="result-preview">
              <img src={result.image} alt="Created post" />
            </div>

            <div className="result-caption">
              <h4>Generated Caption:</h4>
              <p>{result.caption}</p>
            </div>

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

            <div className="auto-redirect">
              <p>Redirecting to feed in 3 seconds...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
