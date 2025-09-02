import { useEffect, useState } from "react";
import api from "../api/axios";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // If backend had /api/auth/me we’d call it; use /api/posts as ping
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Try a harmless GET to infer cookie validity; fallback to unauth
        await api.get("/api/posts?_ping=1"); // if you add a GET later
        // If it succeeds without 401, consider user present (or keep null until real /me exists)
        setUser({ username: "session" });
      } catch {
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return { user, setUser, loading };
}
