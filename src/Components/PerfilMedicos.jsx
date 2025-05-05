import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./PerfilMedicos.css";

const PerfilMedicos = ({ medicoInfo }) => {
  const { medicoId, nombre: doctorName, especialidad, avatar } = medicoInfo;
  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("PerfilMedicos: cargando citas para médico", medicoId);
    axios
      .get(`http://localhost:4000/api/citas/medico/${medicoId}`)
      .then((res) => {
        console.log("Respuesta backend:", res.data);
        if (res.data.success) {
          setCitas(res.data.data);
        } else {
          setError(res.data.message || "No se pudieron cargar las citas.");
        }
      })
      .catch((err) => {
        console.error("Error cargando citas:", err);
        setError("Error de conexión al servidor.");
      })
      .finally(() => setLoading(false));
  }, [medicoId]);

  const citasOrdenadas = useMemo(() => {
    const arr = [...citas].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
    return filtro === "Todos" ? arr : arr.filter((c) => c.estado === filtro);
  }, [citas, filtro]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Cargando citas…</p>;
  }
  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  return (
    <>
      <aside className="header-container">
        <img src="Logo.png" alt="Logo" className="LogoPerfil" />
        <div className="container-links">
          <div className="container-links-btn">
            <button className="container-btn">INICIO</button>
          </div>
          <div className="container-links-btn">
            <button className="container-btn">CERRAR SESIÓN</button>
          </div>
        </div>
      </aside>

      <div className="profile-container">
        <main className="profile-content">
          <h2 className="welcome">BIENVENID@ DOCTOR/A "{doctorName}"</h2>
          <div className="profile-details">
            <h3>DATOS DEL MÉDICO</h3>
            <div className="info-item">
              <span className="label">ID MÉDICO</span>
              <span className="value">{medicoId}</span>
            </div>
            <div className="info-item">
              <span className="label">NOMBRE</span>
              <span className="value">{doctorName}</span>
            </div>
            <div className="info-item">
              <span className="label">ESPECIALIDAD</span>
              <span className="value">{especialidad}</span>
            </div>
          </div>
        </main>

        <div className="citas-container">
          <h2>Mis Citas Programadas</h2>
          <div className="citas-filter">
            {[
              "Todos",
              "Programada",
              "Confirmada",
              "Atendida",
              "Cancelada",
              "No asistió",
            ].map((estado) => (
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
              {citasOrdenadas.length > 0 ? (
                citasOrdenadas.map((c) => (
                  <tr key={c.id}>
                    <td>
                      {new Date(c.fecha).toLocaleString("es-CO", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
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
    </>
  );
};

export default PerfilMedicos;
