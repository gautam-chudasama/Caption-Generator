import { useEffect, useState } from "react";
import api from "../api/axios";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Use the dedicated endpoint to get the current user
        const res = await api.get("/api/auth/me");
        if (mounted) {
          setUser(res.data.user);
        }
      } catch (err) {
        // If the request fails (e.g., 401), the user is not authenticated
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { user, setUser, loading };
}
