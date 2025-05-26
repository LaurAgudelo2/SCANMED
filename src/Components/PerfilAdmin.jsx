import React, { useState, useEffect } from "react";
import NavBarAdmin from "./NavBarAdmin";
import GestionUsuarios from "./GestionUsuarios";
import GestionMedicos from "./GestionMedicos";
import ManejoCitas from "./ManejoCitas";
import HistorialExamenes from "./HistorialExamenes";
import SesionesFacturacion from "./SesionesFacturacion";
import "./PerfilAdmin.css";

const PerfilAdmin = () => {
  const [section, setSection] = useState("Inicio");
  const [loading, setLoading] = useState(true);

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
        {section === "Medicos" && <GestionMedicos />}
        {section === "Citas" && <ManejoCitas />}
        {section === "Examenes" && <HistorialExamenes />}
        {section === "Facturacion" && <SesionesFacturacion />}
      </div>
    </div>
  );
};

export default PerfilAdmin;