import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./PerfilMedicos.css";
import SubirResultado from './SubirResultado';


const PerfilMedicos = ({ medicoInfo }) => {
  const [mostrarSubirResultado, setMostrarSubirResultado] = useState(false);

  
  const { 
    medicoId, 
    nombre: doctorName, 
    ID_SERVICIO, 
    Numero_Licencia 
  } = medicoInfo;

  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  
  

  const volverAlPerfil = () => {

    setMostrarSubirResultado(false);


  };

  const estadoLabels = {
    1: "Programada",
    2: "Confirmada",
    3: "Atendida",
    4: "Cancelada",
    5: "No asistió"
  };

  const citasConLabel = citas.map(c => ({
    ...c,
    estado: estadoLabels[c.estadoId] || "Desconocido"
  }));
  
  const citasOrdenadas = useMemo(() => {
    const arr = [...citasConLabel].sort(
      (a, b) => new Date(a.fecha) - new Date(b.fecha)
    );
    return filtro === "Todos"
      ? arr
      : arr.filter(c => c.estado === filtro);
  }, [citasConLabel, filtro])

  useEffect(() => {
    console.log("medicoInfo:", medicoInfo);
  }, [medicoInfo]);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`http://localhost:4000/api/citas/medico/${medicoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      console.log("CITAS RAW:", res.data.data);
      if (res.data.success) setCitas(res.data.data);
    })
    .catch(err => {
      console.error("Error cargando citas:", err);
      setError("Error al obtener citas");
    })
    .finally(() => setLoading(false));
  }, [medicoId]);
  
  

  useEffect(() => {
    axios.get(`http://localhost:4000/api/servicios/${ID_SERVICIO}`)
    .then(res => setEspecialidad(res.data.Nombre))
    .catch(() => setEspecialidad("Desconocida"))
    .finally(() => setLoading(false));
}, [ID_SERVICIO]);



  if (loading) {
    return <p style={{ textAlign: "center" }}>Cargando citas…</p>;
  }
  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  return (
    mostrarSubirResultado ? (
      <>
        <button className="volver-btn" onClick={volverAlPerfil}>
          ← Volver al perfil
        </button>
        <SubirResultado />
      </>
    ) : (
      <>
        <aside className="header-container">
          <img src="Logo.png" alt="Logo" className="LogoPerfil" />
          <div className="container-links">
            <div className="container-links-btn">
              <button className="container-btn"></button>
            </div>
            <div className="container-links-btn">
              <button className="container-btn"></button>
            </div>
          </div>
        </aside>
  
        <div className="profile-container2">
          <main className="profile-content5">
            <h2 className="welcome">BIENVENID@ DOCTOR/A {doctorName}</h2>
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
  
            {/* Botón para subir resultados */}
            <div className="resultados-upload">
              <button className="upload-btn" onClick={() => setMostrarSubirResultado(true)}>
                SUBIR RESULTADOS
              </button>
            </div>
          </main>
  
          <div className="citas-container">
            <h2>Mis Citas Programadas</h2>
            <div className="citas-filter">
              {["Todos", "Programada", "Confirmada", "Atendida", "Cancelada", "No asistió"].map((estado) => (
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
                      <td>{especialidad}</td>
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
    )
  );
}


export default PerfilMedicos;



