import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import scanmedLogo from "./logoBase64";
import "./HistorialCitas.css";

const HistorialCitas = ({ idUsuario }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState({}); 
  const [observaciones, setObservaciones] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:4000/historial/${idUsuario}`, {
        headers: { Authorization: "Bearer " + token }
      })
      .then((res) => {
        setHistorial(res.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [idUsuario]);

  const handleCheckbox = (id) => {
    setEditing((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!editing[id]) {
      // initialize with existing observation if any
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

  const exportarPDF = () => {
    const doc = new jsPDF();
    const head = [["ID Cita", "Médico", "Paciente", "Fecha y Hora", "Diagnóstico", "Observaciones"]];
    const body = historial.map((cita) => [
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
      didDrawPage: (data) => {
        doc.addImage(scanmedLogo, "PNG", 15, 10, 50, 30);
        doc.setFontSize(18);
        doc.text("Historial de Consultas", doc.internal.pageSize.getWidth()/2, 25, { align: "center" });
      }
    });
    doc.save("historial_citas.pdf");
  };

  if (loading) return <p>Cargando historial...</p>;
  if (error) return <p className="error-msg">Error: {error}</p>;

  return (
    <div className="historial-container">
      <h2>Historial de Consultas</h2>
      <button onClick={exportarPDF} className="export-btn">Descargar PDF</button>

      {historial.length === 0 ? (
        <p>No hay consultas registradas.</p>
      ) : (
        <table className="historial-table">
          <thead>
            <tr>
              <th>ID Cita</th>
              <th>Médico</th>
              <th>Paciente</th>
              <th>Fecha y Hora</th>
              <th>Diagnóstico</th>
              <th>Observaciones</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((cita) => (
              <tr key={cita.ID_CITA}>
                <td>{cita.ID_CITA}</td>
                <td>{cita.Nombre_Medico}</td>
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
                  <input
                    type="checkbox"
                    checked={!!editing[cita.ID_CITA]}
                    onChange={() => handleCheckbox(cita.ID_CITA)}
                  />
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
