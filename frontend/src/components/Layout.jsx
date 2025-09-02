import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // With HttpOnly cookies, typical logout is clearing cookie server-side
    // Add a /api/auth/logout that clears token cookie; for now, client redirect
    try {
      await api.post("/api/auth/logout"); // implement server-side to clear cookie
    } catch {}
    navigate("/login");
  };

  return (
    <div>
      <nav
        style={{
          display: "flex",
          gap: 12,
          padding: 12,
          borderBottom: "1px solid #eee",
        }}
      >
        <Link to="/">Feed</Link>
        <Link to="/create">Create</Link>
        <div style={{ marginLeft: "auto" }}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}
