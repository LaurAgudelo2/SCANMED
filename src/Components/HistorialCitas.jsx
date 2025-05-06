import React, { useEffect, useState } from "react";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import scanmedLogo from './logoBase64';
import CancelarCita from './CancelarCita';
import ReprogramarCita from './ReprogramarCita';
import "./historialCitas.css";

const HistorialCitas = ({ idUsuario }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState({});
  const [observaciones, setObservaciones] = useState({});
  const [showCancelarCita, setShowCancelarCita] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [showReprogramarCita, setShowReprogramarCita] = useState(false);
  const [citaAReprogramar, setCitaAReprogramar] = useState(null);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        if (!idUsuario) {
          throw new Error("No se recibió el ID del paciente.");
        }

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se encontró token de autenticación.");
        }

        const response = await fetch(`http://localhost:4000/historial/${idUsuario}`, {
          headers: { Authorization: "Bearer " + token },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "No se pudo obtener el historial");
        }

        const data = await response.json();
        setHistorial(data);
      } catch (err) {
        console.error("Error al cargar historial:", err);
        
        setError(err.message);
        
        if (err.message.includes("token") || err.message.includes("autenticación")) {
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [idUsuario]);

  const handleCheckbox = (id) => {
    setEditing((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!editing[id]) {
      const existing = historial.find((c) => c.ID_CITA === id)?.Observacion || "";
      setObservaciones((prev) => ({ ...prev, [id]: existing }));
    }
  };

  const handleChange = (id, text) => {
    if (text.length <= 275) {
      setObservaciones((prev) => ({ ...prev, [id]: text }));
    }
  };

  const saveObservacion = (id) => {
    const obs = observaciones[id] || "";
    axios
      .post(
        `http://localhost:4000/api/resultados/${id}/observacion`,
        { observacion: obs },
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      )
      .then(() => {
        setHistorial((prev) =>
          prev.map((c) =>
            c.ID_CITA === id ? { ...c, Observacion: obs } : c
          )
        );
        setEditing((prev) => ({ ...prev, [id]: false }));
      })
      .catch((err) => alert("Error al guardar: " + err.message));
  };

  const handleCancelarClick = (idCita) => {
    setCitaSeleccionada(idCita);
    setShowCancelarCita(true);
  };

  const handleCancelSuccess = () => {
    setHistorial(prev => 
      prev.map(cita => 
        cita.ID_CITA === citaSeleccionada 
          ? { ...cita, Diagnostico: "Cita cancelada" } 
          : cita
      )
    );
    setShowCancelarCita(false);
    setCitaSeleccionada(null);
  };

  const handleReprogramarClick = (cita) => {
    setCitaAReprogramar(cita);
    setShowReprogramarCita(true);
  };

  const handleReprogramarSuccess = (citaId, nuevaFechaHora) => {
    setHistorial(prev => 
      prev.map(cita => 
        cita.ID_CITA === citaId 
          ? { 
              ...cita, 
              Fecha_Hora: nuevaFechaHora,
              Diagnostico: "Cita reprogramada - Pendiente de atención"
            } 
          : cita
      )
    );
    setShowReprogramarCita(false);
    setCitaAReprogramar(null);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
  
    const head = [["ID Cita", "Nombre Médico", "ID Paciente", "Nombre Paciente", "Fecha y Hora", "Diagnóstico"]];
    const body = historial.map(cita => [
      cita.ID_CITA,
      cita.Nombre_Medico,
      cita.ID_PACIENTE,
      cita.Nombre_Paciente,
      new Date(cita.Fecha_Hora).toLocaleString(),
      cita.Diagnostico,
      cita.Observacion || ""
    ]);
  
    autoTable(doc, {
      head,
      body,
      startY: 50,
      didDrawPage: data => {
        doc.addImage(scanmedLogo, "PNG", 15, 10, 50, 30);
        doc.setFontSize(18);
        doc.text("Historial de Consultas", doc.internal.pageSize.getWidth() / 2, 25, { align: "center" });
      }
    });
  
    doc.save("historial_citas.pdf");
  };

  if (loading) return <div className="loading">Cargando historial...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="historial-container">
      <h2>Historial de Consultas</h2>
      <button onClick={exportarPDF} className="pdf-button">Descargar PDF</button>

      {historial.length === 0 ? (
        <p>No hay consultas registradas.</p>
      ) : (
        <table className="historial-table">
          <thead>
            <tr>
              <th>ID Cita</th>
              <th>Nombre Médico</th>
              <th>ID Paciente</th>
              <th>Nombre Paciente</th>
              <th>Fecha y Hora</th>
              <th>Diagnóstico</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((cita) => (
              <tr key={cita.ID_CITA}>
                <td>{cita.ID_CITA}</td>
                <td>{cita.Nombre_Medico}</td>
                <td>{cita.ID_PACIENTE}</td>
                <td>{cita.Nombre_Paciente}</td>
                <td>{new Date(cita.Fecha_Hora).toLocaleString()}</td>
                <td>{cita.Diagnostico}</td>
                <td>
                  {editing[cita.ID_CITA] ? (
                    <>
                      <textarea
                        value={observaciones[cita.ID_CITA]}
                        onChange={(e) => handleChange(cita.ID_CITA, e.target.value)}
                        maxLength={275}
                        rows={3}
                      />
                      <div className="char-count">
                        {observaciones[cita.ID_CITA]?.length || 0}/275
                      </div>
                      <button
                        className="save-btn"
                        onClick={() => saveObservacion(cita.ID_CITA)}
                      >
                        Guardar
                      </button>
                    </>
                  ) : (
                    cita.Observacion || "-"
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <input
                      type="checkbox"
                      checked={!!editing[cita.ID_CITA]}
                      onChange={() => handleCheckbox(cita.ID_CITA)}
                    />
                    {cita.Diagnostico === "Cita programada - Pendiente de atención" && (
                      <>
                        <button 
                          className="cancel-btn"
                          onClick={() => handleCancelarClick(cita.ID_CITA)}
                        >
                          Cancelar
                        </button>
                        <button 
                          className="reprogram-btn"
                          onClick={() => handleReprogramarClick(cita)}
                        >
                          Reprogramar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showCancelarCita && (
        <CancelarCita
          citaId={citaSeleccionada}
          onCancelSuccess={handleCancelSuccess}
          onClose={() => setShowCancelarCita(false)}
        />
      )}

{showReprogramarCita && citaAReprogramar && (
  <ReprogramarCita
    citaId={citaAReprogramar.ID_CITA}
    medicoId={citaAReprogramar.ID_MEDICO} // Asegúrate que este campo existe
    fechaOriginal={citaAReprogramar.Fecha_Hora}
    onReprogramar={handleReprogramarSuccess}
    onClose={() => {
      setShowReprogramarCita(false);
      setCitaAReprogramar(null);
    }}
  />
)}
    </div>
  );
};

export default HistorialCitas;