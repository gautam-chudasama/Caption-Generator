import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/api/auth/login", form);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="card auth-form">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </form>
    </div>
  );
}
