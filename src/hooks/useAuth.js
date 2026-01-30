import { useState, useEffect } from "react";

export default function useAuth() {
  // Start with token from localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Listen for localStorage changes (if user logs in/out in another tab)
  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Helper to login (store token)
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // Helper to logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return { token, login, logout };
}
