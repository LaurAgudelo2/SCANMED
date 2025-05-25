import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const Autentificacion = ({ children }) => {
  const [user, setUser] = useState(null); // { id, role, token }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("userId");
    if (token && role && id) {
      setUser({ id, role, token });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const login = ({ token, role, userId }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser({ id: userId, role, token });
  };

  const logout = () => {
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
