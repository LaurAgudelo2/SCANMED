import React, { useEffect, useState } from "react";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';



import scanmedLogo from './logoBase64'; // Asegúrate de que la ruta sea correcta

import "./historialCitas.css";

const HistorialCitas = ({ idUsuario }) => {
  const [historial, setHistorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("ID del paciente en HistorialCitas:", idUsuario);  // Verifica el valor del ID

    if (!idUsuario) {
      setError("No se recibió el ID del paciente.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    fetch(`http://localhost:4000/historial/${idUsuario}`, {
      headers: {
        Authorization: "Bearer " + token, // Si no usas token, puedes eliminar esta línea
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

  const events = Array.isArray(historial)
    ? historial.map(cita => ({
        title: `${cita.Nombre_Medico} — ${cita.Diagnostico}`,
        start: new Date(cita.Fecha_Hora),
        end:   new Date(new Date(cita.Fecha_Hora).getTime() + 60*60*1000)
      }))
    : [];

  


  const exportarPDF = () => {
    
    const doc = new jsPDF();
  
    const head = [["ID Cita", "Nombre Médico", "Nombre Paciente", "Fecha y Hora", "Diagnóstico"]];
    const body = historial.map(cita => [
      cita.ID_CITA,
      cita.Nombre_Medico,
      cita.Nombre_Paciente,
      new Date(cita.Fecha_Hora).toLocaleString(),
      cita.Diagnostico
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
              <th>Nombre Paciente</th>
              <th>Fecha y Hora</th>
              <th>Diagnóstico</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistorialCitas;
