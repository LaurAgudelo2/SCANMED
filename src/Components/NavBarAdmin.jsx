import React from "react";
import "./NavBarAdmin.css";

const NavBarAdmin = ({ current, onSelect, onLogout }) => {
  const sections = [
    "Inicio",
    "Usuarios",
    "Medicos",
    "Citas",
    "Examenes",
    "Facturacion"
  ];

  return (
    <nav className="admin-nav">
      {sections.map((sec) => (
        <button
          key={sec}
          className={sec === current ? "active" : ""}
          onClick={() => onSelect(sec)}
        >
          {sec === "Examenes" ? "Historial de Exámenes" : sec === "Facturacion" ? "Sesiones de Facturación" : sec}
        </button>
      ))}
      <button className="logout" onClick={onLogout}>
        Cerrar Sesión
      </button>
    </nav>
  );
};

export default NavBarAdmin;