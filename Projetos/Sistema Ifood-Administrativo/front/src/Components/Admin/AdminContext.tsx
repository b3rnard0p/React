import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AdminContextType {
  isAuthenticated: boolean;
  adminToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AdminContext.Provider
      value={{ isAuthenticated, adminToken, login, logout }}
    >
      {children}
    </AdminContext.Provider>
  );
};
