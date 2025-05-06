import React, { useEffect, useState } from "react";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import scanmedLogo from './logoBase64';
import "./historialCitas.css";

const HistorialCitas = ({ idUsuario }) => {
  const [historial, setHistorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState({}); 
  const [observaciones, setObservaciones] = useState({});

  useEffect(() => {
    console.log("ID del paciente en HistorialCitas:", idUsuario);

    if (!idUsuario) {
      setError("No se recibió el ID del paciente.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    fetch(`http://localhost:4000/historial/${idUsuario}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudo obtener el historial");
        }
        return res.json();
      })
      .then((data) => {
        setHistorial(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar historial:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [idUsuario]);

  const handleCheckbox = (id) => {
    setEditing((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!editing[id]) {
      const existing = historial.find((c) => c.ID_CITA === id).Observacion || "";
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
        { observacion: obs }
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

  const cancelarCita = async (idCita) => {
    const token = localStorage.getItem("token");
    
    if (!window.confirm("¿Está seguro que desea cancelar esta cita?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/citas/${idCita}/cancelar`, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("No se pudo cancelar la cita");
      }

      // Actualizar el estado local para reflejar el cambio
      setHistorial(prev => 
        prev.map(cita => 
          cita.ID_CITA === idCita 
            ? { ...cita, Diagnostico: "Cita cancelada" } 
            : cita
        )
      );
      
      alert("Cita cancelada exitosamente");
    } catch (error) {
      console.error("Error al cancelar cita:", error);
      alert("Error al cancelar la cita: " + error.message);
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
  
    const head = [["ID Cita", "Nombre Médico", "ID Paciente", "Nombre Paciente", "Fecha y Hora", "Diagnóstico"]];
    const body = historial.map(cita => [
      cita.ID_PACIENTE,
      cita.ID_CITA,
      cita.Nombre_Medico,
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
  
  if (loading) return <p>Cargando historial...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="historial-container">
      <h2>Historial de Consultas</h2>
      <button onClick={exportarPDF}>Descargar PDF</button>

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
                      <button 
                        className="cancel-btn"
                        onClick={() => cancelarCita(cita.ID_CITA)}
                      >
                        Cancelar Cita
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistorialCitas;