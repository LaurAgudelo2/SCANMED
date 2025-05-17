import React from "react";
import "./NavBarAdmin.css";

const NavBarAdmin = ({ current, onSelect, onLogout }) => {
  return (
    <nav className="admin-nav">
      {["Inicio", "Usuarios", "Citas"].map((sec) => (
        <button
          key={sec}
          className={sec === current ? "active" : ""}
          onClick={() => onSelect(sec)}
        >
          {sec}
        </button>
      ))}
      <button className="logout" onClick={onLogout}>
        Cerrar Sesión
      </button>
    </nav>
  );
};

export default NavBarAdmin;
