import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

const HistorialExamenes = () => {
  const [examenes, setExamenes] = useState([]);
  const [filters, setFilters] = useState({
    paciente: "",
    tipoExamen: "",
    fechaInicio: "",
    fechaFin: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExamenes();
  }, [filters]);

  const fetchExamenes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/examenes", {
        params: filters,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setExamenes(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Error al cargar exámenes");
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const exportToPDF = async () => {
    try {
      if (examenes.length === 0) {
        setError("No hay datos para exportar");
        return;
      }
      setError(null);
      const response = await axios.post(
        "http://localhost:4000/api/generate-pdf",
        { data: examenes, type: "examenes" },
        { 
          responseType: "blob",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, "Historial_Examenes.pdf");
    } catch (err) {
      console.error("Error al generar PDF:", err);
      setError("No se pudo generar el PDF. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="examenes-container">
      <h2>Historial de Exámenes</h2>
      <div className="filters">
        <input
          type="text"
          name="paciente"
          placeholder="Buscar por paciente"
          value={filters.paciente}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="tipoExamen"
          placeholder="Buscar por tipo de examen"
          value={filters.tipoExamen}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="fechaInicio"
          value={filters.fechaInicio}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="fechaFin"
          value={filters.fechaFin}
          onChange={handleFilterChange}
        />
        <button onClick={fetchExamenes}>Filtrar</button>
        <button onClick={exportToPDF}>Exportar a PDF</button>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : examenes.length === 0 ? (
        <p>No se encontraron exámenes.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Tipo de Examen</th>
              <th>Descripción</th>
              <th>Documento</th>
            </tr>
          </thead>
          <tbody>
            {examenes.map((examen) => (
              <tr key={examen.ID_RESULTADO}>
                <td>{examen.ID_RESULTADO}</td>
                <td>{new Date(examen.Fecha_Registro).toLocaleDateString()}</td>
                <td>{examen.Nombre_Paciente}</td>
                <td>{examen.Nombre_Medico}</td>
                <td>{examen.Tipo_Examen}</td>
                <td>{examen.Descripcion}</td>
                <td>
                  {examen.Documento_Examen && (
                    <a href={examen.Documento_Examen} target="_blank" rel="noopener noreferrer">
                      Ver Documento
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistorialExamenes;