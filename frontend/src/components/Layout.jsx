import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth.js";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if the request fails, clear the local user state
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <div>
      <nav>
        <Link to="/">Feed</Link>
        <Link to="/create">Create</Link>
        {user ? (
          <div style={{ marginLeft: "auto" }}>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div style={{ marginLeft: "auto" }}>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </nav>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}
