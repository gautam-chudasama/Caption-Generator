import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!form.username.trim()) {
      errors.username = "Username is required";
    } else if (form.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      errors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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
      const res = await api.post("/api/auth/register", {
        username: form.username.trim(),
        password: form.password,
      });
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
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
      <div className="auth-card">
        <div className="auth-header">
          <h2>Join PicCaption</h2>
          <p>
            Create your account and start sharing moments with AI-powered
            captions
          </p>
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
              placeholder="Choose a unique username"
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
              placeholder="Enter a secure password"
              value={form.password}
              onChange={onChange}
              className={getInputClassName("password")}
              required
              autoComplete="new-password"
            />
            {validationErrors.password && (
              <div className="field-error">{validationErrors.password}</div>
            )}
            <div className="password-hint">
              Must be at least 6 characters long
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password <span className="required">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={onChange}
              className={getInputClassName("confirmPassword")}
              required
              autoComplete="new-password"
            />
            {validationErrors.confirmPassword && (
              <div className="field-error">
                {validationErrors.confirmPassword}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? (
              <>
                <div className="button-spinner"></div>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
