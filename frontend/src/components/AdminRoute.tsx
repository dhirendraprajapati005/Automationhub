import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const AdminRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex min-h-[50vh] items-center justify-center text-ink-400">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
