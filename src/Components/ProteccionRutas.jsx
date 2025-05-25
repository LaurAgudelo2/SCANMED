import React, { useContext } from "react";
import { AuthContext } from "./Autentificacion";

const ProteccionRutas = ({ allowedRoles, children }) => {
  const { user } = useContext(AuthContext);
  if (!user || !allowedRoles.includes(user.role)) {
    return <p style={{ padding: "2rem" }}>Acceso denegado.</p>;
  }
  return children;
};

export default ProteccionRutas;
