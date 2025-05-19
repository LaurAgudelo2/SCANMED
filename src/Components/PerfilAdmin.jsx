
import React, { useState, useEffect } from "react";
import NavBarAdmin from "./NavBarAdmin";
import GestionUsuarios from "./GestionUsuarios";
import ManejoCitas from "./ManejoCitas";
import "./PerfilAdmin.css";

const PerfilAdmin = () => {
  const [section, setSection] = useState("Inicio");
  const [loading, setLoading] = useState(true);

  // Opcional: podrías comprobar aquí si el token y el role en localStorage siguen siendo válidos
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <p>Cargando panel de admin...</p>;

  return (
    <div className="admin-panel">
      <NavBarAdmin current={section} onSelect={setSection} />
      <div className="admin-content">
        {section === "Inicio" && (
          <div className="admin-welcome">
            <h1>Bienvenido al Panel de Administración</h1>
            <p>Selecciona una sección del menú para empezar.</p>
          </div>
        )}
        {section === "Usuarios" && <GestionUsuarios />}
        {section === "Citas" && <ManejoCitas />}
      </div>
    </div>
  );
};

export default PerfilAdmin;
