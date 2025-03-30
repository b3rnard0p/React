import { useEffect, useState } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const authenticateUser = (username, password) => {
    const users = {
      admin: "admin123",
      funcionario: "func123",
    };

    if (users[username] === password) {
      setIsAuthenticated(true);
      setUserRole(username);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", username);
      return true;
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      return false;
    }
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedRole = localStorage.getItem("userRole");

    if (storedAuth) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
    }
  }, []);

  return { isAuthenticated, userRole, authenticateUser };
};

export default useAuth;
