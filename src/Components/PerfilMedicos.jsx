import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PerfilMedicos.css";

const PerfilMedicos = ({ medicoId = 1 }) => {
  const [filtro, setFiltro] = useState("Todos");
  const [citas, setCitas] = useState([]);
  const [doctorNombre, setDoctorNombre] = useState("Médico");

  useEffect(() => {
    const cargarCitas = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/citas/medico", {
          params: { medicoId }
        });

        setDoctorNombre(response.data.medicoNombre || "Médico");
        setCitas(response.data.citas || []);
      } catch (error) {
        console.error("Error al cargar citas:", error);
      }
    };

    cargarCitas();
  }, [medicoId]);

  // Aplicamos el filtro directamente al renderizar
  const citasFiltradas = citas
    .filter((cita) => filtro === "Todos" || cita.estado === filtro)
    .sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <img src="/avatar-medico.png" alt={doctorNombre} className="perfil-avatar" />
        <div className="perfil-info">
          <h1 className="perfil-nombre">{doctorNombre}</h1>
          <p className="perfil-role">Especialista</p>
        </div>
      </div>

      <div className="citas-container">
        <h2>Mis Citas Programadas</h2>

        <div className="citas-filter">
          {["Todos", "Pendiente", "Realizada"].map((estado) => (
            <button
              key={estado}
              className={`filter-btn ${filtro === estado ? "active" : ""}`}
              onClick={() => setFiltro(estado)}
            >
              {estado}
            </button>
          ))}
        </div>

        <table className="citas-table">
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Paciente</th>
              <th>Estudio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {citasFiltradas.length > 0 ? (
              citasFiltradas.map((cita) => (
                <tr key={cita.id}>
                  <td>{new Date(`${cita.fecha}T${cita.hora}`).toLocaleString()}</td>
                  <td>{cita.pacienteNombre}</td>
                  <td>{cita.examen}</td>
                  <td className={`estado-${cita.estado}`}>{cita.estado}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="sin-citas">
                  No hay citas para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerfilMedicos;
