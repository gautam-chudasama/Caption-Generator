import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth.js";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      setUser(null);
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <nav>
        <div className="nav-container">
          <div className="nav-left">
            <Link to="/" className="nav-logo">
              <span role="img" aria-label="camera">
                📸
              </span>
              PicCaption
            </Link>
            <div className="nav-links">
              <Link to="/" className={isActive("/") ? "active" : ""}>
                Home
              </Link>
              {user && (
                <Link
                  to="/create"
                  className={isActive("/create") ? "active" : ""}
                >
                  Create
                </Link>
              )}
            </div>
          </div>
          <div className="nav-right">
            {user ? (
              <>
                <div className="nav-user">
                  <span>Welcome, {user.username}!</span>
                </div>
                <button onClick={handleLogout} className="nav-button secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-button secondary">
                  Login
                </Link>
                <Link to="/register" className="nav-button">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="fade-in">{children}</main>
    </div>
  );
}
