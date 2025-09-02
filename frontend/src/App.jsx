import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Feed from "./pages/Feed.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Layout from "./components/Layout.jsx";
import { useAuth } from "./hooks/useAuth.js";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Layout>
  );
}
