import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth.js";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Handle scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      setUser(null);
      navigate("/login");
    } finally {
      setLogoutLoading(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div>
      <nav
        className={`${isScrolled ? "scrolled" : ""}`}
        style={{
          background: isScrolled
            ? "rgba(255, 255, 255, 0.98)"
            : "rgba(255, 255, 255, 0.95)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="nav-container">
          <div className="nav-left">
            <Link to="/" className="nav-logo" title="PicCaption - Home">
              <span
                role="img"
                aria-label="camera"
                style={{
                  animation: "bounce 2s ease-in-out infinite",
                  display: "inline-block",
                }}
              >
                📸
              </span>
              PicCaption
            </Link>

            {/* Desktop Navigation */}
            <div className="nav-links desktop-only">
              <Link
                to="/"
                className={isActive("/") ? "active" : ""}
                title="Home"
              >
                🏠 Home
              </Link>
              {user && (
                <Link
                  to="/create"
                  className={isActive("/create") ? "active" : ""}
                  title="Create Post"
                >
                  ✨ Create
                </Link>
              )}
            </div>
          </div>

          <div className="nav-right">
            {user ? (
              <>
                <div className="nav-user desktop-only">
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>👋</span>
                    Welcome, <strong>{user.username}</strong>!
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="nav-button secondary"
                  disabled={logoutLoading}
                  title="Logout"
                >
                  {logoutLoading ? (
                    <>
                      <div className="button-spinner"></div>
                      Logging out...
                    </>
                  ) : (
                    <>🚪 Logout</>
                  )}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="nav-button secondary"
                  title="Login"
                >
                  🔑 Login
                </Link>
                <Link to="/register" className="nav-button" title="Sign Up">
                  🚀 Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-button mobile-only"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              title="Menu"
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "var(--radius-sm)",
                transition: "var(--transition-normal)",
                color: "var(--text-primary)",
              }}
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="mobile-menu-overlay mobile-only"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "var(--bg-glass)",
              backdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderTop: "none",
              borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
              padding: "24px",
              boxShadow: "var(--shadow-xl)",
              animation: "slideInDown 0.3s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <Link
                to="/"
                className={`mobile-nav-link ${isActive("/") ? "active" : ""}`}
                style={{
                  padding: "16px 20px",
                  borderRadius: "var(--radius)",
                  textDecoration: "none",
                  color: "var(--text-primary)",
                  fontWeight: "600",
                  transition: "var(--transition-normal)",
                  background: isActive("/")
                    ? "linear-gradient(135deg, var(--primary-color), var(--secondary-color))"
                    : "transparent",
                  ...(isActive("/") && { color: "white" }),
                }}
              >
                🏠 Home
              </Link>

              {user && (
                <Link
                  to="/create"
                  className={`mobile-nav-link ${
                    isActive("/create") ? "active" : ""
                  }`}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "var(--radius)",
                    textDecoration: "none",
                    color: "var(--text-primary)",
                    fontWeight: "600",
                    transition: "var(--transition-normal)",
                    background: isActive("/create")
                      ? "linear-gradient(135deg, var(--primary-color), var(--secondary-color))"
                      : "transparent",
                    ...(isActive("/create") && { color: "white" }),
                  }}
                >
                  ✨ Create
                </Link>
              )}

              {user && (
                <div
                  style={{
                    padding: "16px 20px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "var(--radius)",
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  👋 Hello, <strong>{user.username}</strong>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="fade-in">{children}</main>

      {/* Enhanced Footer */}
      <footer
        style={{
          background: "var(--bg-glass)",
          backdropFilter: "blur(20px) saturate(180%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          padding: "40px 32px 20px",
          marginTop: "80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <span style={{ fontSize: "32px" }}>📸</span>
            <h3
              style={{
                background:
                  "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: "900",
                fontSize: "24px",
                margin: 0,
              }}
            >
              PicCaption
            </h3>
          </div>

          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "20px",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            ✨ Bringing your photos to life with AI-powered creativity
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "32px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/"
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "600",
                transition: "var(--transition-normal)",
                padding: "8px 0",
              }}
              onMouseEnter={(e) =>
                (e.target.style.color = "var(--primary-color)")
              }
              onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
            >
              🏠 Home
            </Link>
            {user && (
              <Link
                to="/create"
                style={{
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  transition: "var(--transition-normal)",
                  padding: "8px 0",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.color = "var(--primary-color)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = "var(--text-muted)")
                }
              >
                ✨ Create
              </Link>
            )}
          </div>

          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
              margin: "20px 0",
            }}
          ></div>

          <p
            style={{
              color: "var(--text-light)",
              fontSize: "12px",
              margin: 0,
              fontWeight: "500",
            }}
          >
            © 2024 PicCaption. Made with 💖 and AI magic.
          </p>
        </div>
      </footer>

      {/* Custom Styles for Mobile Menu */}
      <style jsx>{`
        @media (min-width: 769px) {
          .mobile-only {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
        }

        .mobile-nav-link:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: var(--primary-color) !important;
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
