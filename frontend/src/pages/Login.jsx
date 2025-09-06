import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!form.username.trim()) {
      errors.username = "Username is required";
    }

    if (!form.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((errors) => ({ ...errors, [name]: "" }));
    }
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setError("");
    setLoading(true);
    setValidationErrors({});

    try {
      const res = await api.post("/api/auth/login", {
        username: form.username.trim(),
        password: form.password,
      });
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    return validationErrors[fieldName] ? "input-error" : "";
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h2>Welcome Back! 👋</h2>
          <p>Sign in to your account and continue sharing amazing moments</p>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">
              Username <span className="required">*</span>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={onChange}
              className={getInputClassName("username")}
              required
              autoFocus
              autoComplete="username"
            />
            {validationErrors.username && (
              <div className="field-error">{validationErrors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={onChange}
              className={getInputClassName("password")}
              required
              autoComplete="current-password"
            />
            {validationErrors.password && (
              <div className="field-error">{validationErrors.password}</div>
            )}
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? (
              <>
                <div className="button-spinner"></div>
                Signing you in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>

        <div className="auth-link">
          New to PicCaption? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
