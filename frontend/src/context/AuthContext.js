import React, { createContext, useState } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("token") ? jwtDecode(localStorage.getItem("token")) : null);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", { email, password });
      localStorage.setItem("token", response.data.token);
      setUser(jwtDecode(response.data.token));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};