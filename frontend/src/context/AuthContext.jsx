import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    if (data.token) localStorage.setItem("ce_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, country) => {
    const { data } = await api.post("/auth/register", { name, email, password, country });
    if (data.token) localStorage.setItem("ce_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    localStorage.removeItem("ce_token");
    setUser(null);
  };

  const setCountry = async (country) => {
    await api.patch("/auth/country", { country });
    setUser((u) => (u ? { ...u, country } : u));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, setCountry }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
