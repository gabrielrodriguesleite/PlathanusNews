import { Outlet, useLocation } from "react-router";
import { useAuth } from "../contexts/useAuth";
import { Navigate } from "react-router";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="dialog">
        <h2>Autenticando.</h2>
        <h3>Aguarde...</h3>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
