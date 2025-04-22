import React, { useState } from "react";
import SolicitarCita from "./SolicitarCita";
import HistorialCitas from "./HistorialCitas";
import axios from "axios";
import "./perfilUsuario.css";

const PerfilUsuario = ({ usuario }) => {

  
  const [mostrarCita, setMostrarCita] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const volverAlPerfil = () => {
    setMostrarCita(false);
    setMostrarHistorial(false);
  };


  return (
    
    <div className="perfil-container">
      {mostrarCita ? (
        <>
          <button className="volver-btn" onClick={volverAlPerfil}>←</button>
          <SolicitarCita />
        </>
      ) : mostrarHistorial ? (
        <>
          <button className="volver-btn" onClick={volverAlPerfil}>←</button>
          <HistorialCitas idUsuario={usuario.ID_USUARIO} />        
          </>
      ) : (
        <>
     

     <main className="profile-content">
  <h2 className="welcome">
    Bienvenido/a,{" "}
    {usuario?.Primer_Nombre || ""}{" "}
    {usuario?.Segundo_Nombre || ""}{" "}
    {usuario?.Primer_Apellido || "Nombre del usuario"}
  </h2>
  <div className="profile-details">

              <h3>MI PERFIL</h3>
              <div className="info-item">
                <span className="label">NOMBRE</span>
                <span className="value">{usuario?.Primer_Nombre || "-"}</span>
              </div>
              <div className="info-item">
                <span className="label">APELLIDOS</span>
                <span className="value">
                  {usuario?.Primer_Apellido} {usuario?.Segundo_Apellido || ""}
                </span>
              </div>
              <div className="info-item">
                <span className="label">EDAD</span>
                <span className="value">{usuario?.Edad || "-"}</span>
              </div>
              
              <div className="info-item">
                <span className="label">NÚMERO DE DOCUMENTO</span>
                <span className="value">{usuario?.Num_Documento || "-"}</span>
              </div>
              <div className="info-item">
                <span className="label">DIRECCIÓN</span>
                <span className="value">{usuario?.Direccion || "-"}</span>
              </div>
              <div className="info-item">
                <span className="label">CELULAR</span>
                <span className="value">{usuario?.Telefono || "-"}</span>
              </div>
              <div className="info-item">
                <span className="label">EMAIL</span>
                <span className="value">{usuario?.Correo_Electronico || "-"}</span>
              </div>
            </div>
          </main>

          {/* Botones de acción arriba */}
          <aside className="header-section">
            <img src="Logo.png" alt="Logo" className="LogoPerfil" />
            <div className="header-links">
              <button className="header-btn2">←</button>
            </div>
          </aside>

          {/* Botones de acción abajo */}
          <aside className="actions">
            <button className="action-btn" onClick={() => setMostrarCita(true)}>
              SOLICITAR CITA
            </button>
            <button className="action-btn">RESULTADOS</button>
            <button className="action-btn" onClick={() => setMostrarHistorial(true)}>
              HISTORIAL
            </button>
            {mostrarHistorial && <HistorialCitas idUsuario={usuario?.ID_USUARIO} />}

          </aside>
        </>
      )}
    </div>
  );
};

export default PerfilUsuario;