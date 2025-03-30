import React from "react";
import "./perfilUsuario.css";

const PerfilUsuario = ({ usuario }) => {
  return (
    <div className="perfil-container">
      {/* Barra lateral */}
      <aside className="sidebar">
        <div className="user-info">
          <h3>{usuario?.nombre || "Aqui nombre del usuario"}</h3> 
        </div>
        <button className="sidebar-btn">NUESTROS SERVICIOS</button>
        <button className="sidebar-btn">CONTACTANOS</button>
      </aside>

      {/* Contenido principal */}
      <main className="profile-content">
        <h2 className="welcome">BIENVENID@ "{usuario?.nombre || "Nombre del usuario"}"</h2>
        <div className="profile-details">
          <h3>MI PERFIL</h3>
          <div className="info-item">
            <span className="label">NOMBRE</span>
            <span className="value beneficiary"></span>
          </div>
          <div className="info-item">
            <span className="label">APELLIDOS</span>
            <span className="value">{usuario?.apellidos || "-"}</span>
          </div>
          <div className="info-item">
            <span className="label">EDAD</span>
            <span className="value">{usuario?.edad || "-"}</span>
          </div>
          <div className="info-item">
            <span className="label">TIPO DE DOCUMENTO</span>
            <span className="value">{usuario?.tipoDocumento || "-"}</span>
          </div>
          <div className="info-item">
            <span className="label">NÚMERO DE DOCUMENTO</span>
            <span className="value">{usuario?.numeroDocumento || "-"}</span>
          </div>
          <div className="info-item">
            <span className="label">DIRECCIÓN</span>
            <span className="value">{usuario?.direccion || "-"}</span>
          </div>
          <div className="info-item">
            <span className="label">CELULAR</span>
            <span className="value">{usuario?.celular || "-"}</span>
          </div>
          <div className="info-item">
            <span className="label">EMAIL</span>
            <span className="value">{usuario?.email || "-"}</span>
          </div>
        </div>
      </main>

      {/* Botones de acción */}
      <aside className="header-section">
        <img src="Logo.png" alt="Logo" className="LogoPerfil" />
        <div className="header-links">
          <button className="header-btn">INICIO</button>
          <button className="header-btn">CERRAR SESIÓN</button>
        </div>
      </aside>

      {/* Botones de acción */}
      <aside className="actions">
        <button className="action-btn">SOLICITAR CITA</button>
        <button className="action-btn">RESULTADOS</button>
        <button className="action-btn">HISTORIAL</button>
      </aside>
    </div>
  );
};

export default PerfilUsuario;

