import { Navigate, useLocation } from "react-router-dom";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner label="Loading secure workspace..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

