import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

const SesionesFacturacion = () => {
  const [facturas, setFacturas] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [filters, setFilters] = useState({
    paciente: "",
    estado: "",
    fechaInicio: "",
    fechaFin: "",
    metodoPago: "",
    medico: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFacturas();
  }, [filters]);

  const fetchFacturas = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/facturas", {
        params: filters,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setFacturas(response.data.data);
      setStatistics(response.data.statistics);
      setLoading(false);
    } catch (err) {
      setError("Error al cargar facturas");
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const exportToPDF = async () => {
    try {
      if (facturas.length === 0) {
        setError("No hay datos para exportar");
        return;
      }
      setError(null);
      const response = await axios.post(
        "http://localhost:4000/api/generate-pdf",
        { data: facturas, type: "facturas" },
        { 
          responseType: "blob",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, "Sesiones_Facturacion.pdf");
    } catch (err) {
      console.error("Error al generar PDF:", err);
      setError("No se pudo generar el PDF. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="facturacion-container">
      <h2>Sesiones de Facturación</h2>
      <div className="statistics">
        <h3>Estadísticas</h3>
        <p>Total Facturas: {statistics.Total_Facturas || 0}</p>
        <p>Ingresos Totales: ${statistics.Ingresos_Totales || 0}</p>
        <p>Ingresos Pagados: ${statistics.Ingresos_Pagados || 0}</p>
        <p>Ingresos Pendientes: ${statistics.Ingresos_Pendientes || 0}</p>
        <p>Ingresos Anulados: ${statistics.Ingresos_Anulados || 0}</p>
      </div>
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
          name="medico"
          placeholder="Buscar por médico"
          value={filters.medico}
          onChange={handleFilterChange}
        />
        <select name="estado" value={filters.estado} onChange={handleFilterChange}>
          <option value="">Todos los estados</option>
          <option value="EMITIDA">Emitida</option>
          <option value="PAGADA">Pagada</option>
          <option value="ANULADA">Anulada</option>
        </select>
        <select name="metodoPago" value={filters.metodoPago} onChange={handleFilterChange}>
          <option value="">Todos los métodos</option>
          <option value="TARJETA">Tarjeta</option>
          <option value="PAYPAL">PayPal</option>
          <option value="BANCOLOMBIA">Bancolombia</option>
          <option value="NEQUI">Nequi</option>
        </select>
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
        <button onClick={fetchFacturas}>Filtrar</button>
        <button onClick={exportToPDF}>Exportar a PDF</button>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : facturas.length === 0 ? (
        <p>No se encontraron facturas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Número Factura</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Método de Pago</th>
              <th>Transacción ID</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura) => (
              <tr key={factura.ID_FACTURA}>
                <td>{factura.ID_FACTURA}</td>
                <td>{new Date(factura.Fecha_Pago).toLocaleDateString()}</td>
                <td>{factura.Numero_Factura}</td>
                <td>{factura.Nombre_Paciente}</td>
                <td>{factura.Nombre_Medico}</td>
                <td>${factura.Total}</td>
                <td>{factura.Estado}</td>
                <td>{factura.Metodo_Pago}</td>
                <td>{factura.Transaccion_ID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SesionesFacturacion;