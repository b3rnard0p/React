import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { UsuarioService } from "../../server/api";
import type { Usuario } from "../../Type";

interface UserContextData {
  user: Usuario | null;
  hasUser: boolean;
  setUser: (user: Usuario | null) => void;
  checkUser: () => Promise<void>;
}

const UserContext = createContext<UserContextData | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

// Utilitários para cookies
export function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}

function getCookie(name: string): string | null {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, null as string | null);
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [hasUser, setHasUser] = useState<boolean>(false);

  const checkUser = async () => {
    try {
      const token = getCookie("user_token");
      if (!token) {
        setUser(null);
        setHasUser(false);
        return;
      }
      // Buscar usuário pelo token
      const userData = await UsuarioService.buscarPorToken();
      setUser(userData);
      setHasUser(true);
    } catch (error) {
      setUser(null);
      setHasUser(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const value: UserContextData = {
    user,
    hasUser,
    setUser,
    checkUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
