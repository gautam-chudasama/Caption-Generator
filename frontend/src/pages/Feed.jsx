import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await api.get("/api/posts");
        setPosts(response.data.posts);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Feed</h2>
      <div className="post-container">
        {posts.map((post) => (
          <div key={post._id} className="card post-item">
            <img src={post.image} alt="post" />
            <p>{post.caption}</p>
          </div>
        ))}
      </div>
      {posts.length === 0 && <p>No posts yet. Be the first to create one!</p>}
    </div>
  );
}
