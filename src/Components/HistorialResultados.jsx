import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HistorialResultados.css";

const HistorialResultados = ({ idUsuario }) => {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [descargando, setDescargando] = useState(null); // Estado faltante

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pacienteResponse = await axios.get(`http://localhost:4000/api/pacientes/usuario/${idUsuario}`);
        
        if (!pacienteResponse.data?.ID_PACIENTE) {
          throw new Error('Paciente no encontrado');
        }
        
        const idPaciente = pacienteResponse.data.ID_PACIENTE;
        const resultadosResponse = await axios.get(`http://localhost:4000/api/resultados/${idPaciente}`);
        
        // Verificar estructura de respuesta
        const resultados = Array.isArray(resultadosResponse.data?.data) 
          ? resultadosResponse.data.data 
          : [];
        
        setResultados(resultados);

      } catch (err) {
        setError(err.message || "Error al cargar los resultados");
        setResultados([]);
      } finally { // Usar finally para asegurar que loading siempre se desactive
        setLoading(false);
      }
    };

    fetchData();
  }, [idUsuario]);

  const handleDownload = async (documentoUrl, idResultado) => {
    try {
      setDescargando(idResultado);
      
      const response = await fetch(documentoUrl);
      if (!response.ok) throw new Error('Archivo no encontrado');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = documentoUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setDescargando(null);
      }, 100);
      
    } catch (err) {
      console.error("Error:", err);
      alert(err.message);
      setDescargando(null);
    }
  };

  if (loading) return <div className="loading">Cargando resultados...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="historial-resultados-container">
      <h2>Resultados de Exámenes</h2>
      
      {resultados.length === 0 ? (
        <p>No hay resultados disponibles</p>
      ) : (
        <table className="resultados-table">
          <thead>
            <tr>
              <th>Fecha Resultado</th>
              <th>Fecha Cita</th>
              <th>Descripción</th>
              <th>Documento</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((resultado) => (
              <tr key={resultado.ID_RESULTADO}>
                <td>{new Date(resultado.Fecha_Registro).toLocaleDateString('es-ES')}</td>
                <td>
                  {resultado.Fecha_Cita 
                    ? new Date(resultado.Fecha_Cita).toLocaleDateString('es-ES')
                    : 'Sin cita asociada'}
                </td>
                <td>{resultado.Descripcion}</td>
                <td>
                  {resultado.Documento_Examen && (
                    <button 
                      onClick={() => handleDownload(resultado.Documento_Examen, resultado.ID_RESULTADO)}
                      className={`download-btn ${descargando === resultado.ID_RESULTADO ? 'loading' : ''}`}
                      disabled={descargando}
                    >
                      {descargando === resultado.ID_RESULTADO ? '⏳ Descargando...' : '⬇️ Descargar'}
                    </button>
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

export default HistorialResultados;