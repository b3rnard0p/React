import React from "react";
import { useAdmin } from "./AdminContext";
import LoginAdmin from "./LoginAdmin";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, login } = useAdmin();

  if (!isAuthenticated) {
    return <LoginAdmin onLogin={login} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
