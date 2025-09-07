import { useState } from "react";
import api from "../api/axios";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const onFile = (e) => {
    const f = e.target.files[0];
    setFile(f || null);
    setResult(null);
    setError("");
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview("");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Select an image first");
    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await api.post("/api/posts", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.post);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card auth-form">
      <h2>Create Post</h2>
      <form onSubmit={onSubmit}>
        <input className="upload" type="file" accept="image/*" onChange={onFile} />
        {preview && (
          <img
            src={preview}
            alt="preview"
            style={{ width: 300, marginTop: 12, marginBottom: 12 }}
          />
        )}
        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={submitting}>
            {submitting ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {result && (
        <div className="card" style={{ marginTop: 24, padding: 12 }}>
          <h3>Created Post</h3>
          <img src={result.image} alt="uploaded" style={{ width: 300 }} />
          <p>
            <strong>Caption:</strong> {result.caption}
          </p>
        </div>
      )}
    </div>
  );
}
