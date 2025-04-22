import React, { useState, useMemo } from "react";
import "./PerfilMedicos.css";

const PerfilMedicos = ({ medicoId = 1 }) => {
  const [filtro, setFiltro] = useState("Todos");

  const dataMed = useMemo(
    () => [
      { id: 1, medicoId: 1, pacienteNombre: "Carlos Gómez",   examen: "Mamografía Digital",            fecha: "2025-04-20T10:00", estado: "Pendiente" },
      { id: 2, medicoId: 3, pacienteNombre: "Ana Ruiz",       examen: "Radiografía Digital",           fecha: "2025-04-20T11:00", estado: "Realizada" },
      { id: 3, medicoId: 2, pacienteNombre: "Laura Pérez",    examen: "Ecografía Doppler",             fecha: "2025-04-21T09:30", estado: "Pendiente" },
      { id: 4, medicoId: 1, pacienteNombre: "Carlos Gómez",   examen: "Mamografía Digital",            fecha: "2025-04-28T10:00", estado: "Pendiente" },
      { id: 5, medicoId: 1, pacienteNombre: "Carlos Gómez",   examen: "Mamografía Digital",            fecha: "2025-04-10T12:00", estado: "Realizada" }
    ],
    []
  );

  // Mapeo de nombres de médicos
  const doctorNames = {
    1: "Dr. Carlos Gómez",
    2: "Dra. Ana Ruiz",
    3: "Dra. Laura Pérez"
  };
  const doctorName = doctorNames[medicoId] || "Médico";

  // Filtro y ordenamiento
  const citasMedico = useMemo(() => {
    return dataMed
      .filter((c) => c.medicoId === medicoId)
      .sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );
  }, [medicoId, dataMed]);

  const citasFiltradas = useMemo(() => {
    if (filtro === "Todos") return citasMedico;
    return citasMedico.filter((c) => c.estado === filtro);
  }, [citasMedico, filtro]);

  return (
    <div className="perfil-container">

      <div className="perfil-header">
        <img
          src="/avatar-medico.png"
          alt={doctorName}
          className="perfil-avatar"
        />
        <div className="perfil-info">
          <h1 className="perfil-nombre">{doctorName}</h1>
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
              citasFiltradas.map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.fecha).toLocaleString()}</td>
                  <td>{c.pacienteNombre}</td>
                  <td>{c.examen}</td>
                  <td className={`estado-${c.estado}`}>{c.estado}</td>
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
