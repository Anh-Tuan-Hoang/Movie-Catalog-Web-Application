import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [apiKey, setApiKey] = useState(null);
  const navigate = useNavigate();

  const login = (key) => {
    setApiKey(key); // Save the API key globally
  };

  const logout = () => {
    setApiKey(null); // Clear the API key
    navigate("/Login"); // Redirect to login
  };

  return (
    <AuthContext.Provider value={{ apiKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
