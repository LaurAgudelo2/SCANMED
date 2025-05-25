import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './Factura.css';

const Factura = ({ pagoId, pacienteId, onClose }) => {
  const [factura, setFactura] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacturaData = async () => {
      if (!pagoId || !pacienteId) {
        setError('Falta información de pago o paciente');
        setLoading(false);
        return;
      }

      try {
        console.log(`Solicitando factura para pagoId: ${pagoId}`);
        const facturaResponse = await axios.get(`http://localhost:4000/api/facturas/pago/${pagoId}`);
        console.log('Respuesta de factura:', facturaResponse.data);

        if (facturaResponse.data.success && facturaResponse.data.data) {
          setFactura(facturaResponse.data.data);
          const detallesResponse = await axios.get(`http://localhost:4000/api/facturas/${facturaResponse.data.data.ID_FACTURA}/detalles`);
          setDetalles(detallesResponse.data.data);
        } else {
          setError(facturaResponse.data.message || 'No se encontró factura para este pago');
        }
      } catch (err) {
        console.error('Error al obtener factura:', err);
        setError(err.response?.data?.message || 'Error al cargar la factura');
      } finally {
        setLoading(false);
      }
    };

    fetchFacturaData();
  }, [pagoId, pacienteId]);

  const generarPDF = () => {
    if (!factura) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Factura ScanMed S.A.S', 20, 20);
    doc.setFontSize(12);
    doc.text('NIT: 900.123.456-7', 20, 30);
    doc.text('Calle 123 #45-67, Bogotá', 20, 35);
    doc.text('Teléfono: (601) 1234567', 20, 40);

    doc.text(`No. Factura: ${factura.Numero_Factura}`, 20, 50);
    doc.text(`Fecha: ${new Date(factura.Fecha_Pago).toLocaleDateString()}`, 20, 55);

    doc.setFontSize(14);
    doc.text('Datos del Paciente', 20, 65);
    doc.setFontSize(12);
    doc.text(`Nombre: ${factura.Primer_Nombre} ${factura.Primer_Apellido}`, 20, 75);
    doc.text(`Documento: ${factura.Num_Documento}`, 20, 80);
    doc.text(`Correo: ${factura.Correo_Electronico}`, 20, 85);

    doc.setFontSize(14);
    doc.text('Detalles de la Factura', 20, 95);
    doc.setFontSize(12);
    let y = 105;
    doc.text('Descripción', 20, y);
    doc.text('Cantidad', 100, y);
    doc.text('Valor Unitario', 130, y);
    doc.text('Total', 170, y);
    y += 5;
    doc.line(20, y, 190, y);
    y += 5;

    detalles.forEach(detalle => {
      doc.text(detalle.Descripcion, 20, y);
      doc.text(detalle.Cantidad.toString(), 100, y);
      doc.text(`$${parseFloat(detalle.Precio_Unitario).toFixed(2)}`, 130, y);
      doc.text(`$${parseFloat(detalle.Subtotal).toFixed(2)}`, 170, y);
      y += 10;
    });

    doc.line(20, y, 190, y);
    y += 5;
    doc.text(`Subtotal: $${parseFloat(factura.Subtotal).toFixed(2)}`, 130, y);
    doc.text(`IVA (19%): $${parseFloat(factura.IVA).toFixed(2)}`, 130, y + 5);
    doc.text(`Total: $${parseFloat(factura.Total).toFixed(2)}`, 130, y + 10);

    doc.setFontSize(14);
    doc.text('Información de Pago', 20, y + 20);
    doc.setFontSize(12);
    doc.text(`Método: ${factura.Metodo_Pago}`, 20, y + 30);
    doc.text(`Transacción: ${factura.Transaccion_ID}`, 20, y + 35);
    doc.text(`Estado: ${factura.Estado}`, 20, y + 40);

    doc.setFontSize(10);
    doc.text('Gracias por confiar en ScanMed - Factura generada electrónicamente', 20, y + 50);

    doc.save(`Factura_${factura.Numero_Factura}.pdf`);
  };

  const imprimirFactura = () => {
    window.print();
  };

  if (loading) {
    return <div className="factura-loading">Cargando factura...</div>;
  }

  if (error) {
    return (
      <div className="factura-error">
        <p>Error: {error}</p>
        <button onClick={onClose} className="factura-close-btn">Cerrar</button>
      </div>
    );
  }

  return (
    <div className="factura-container">
      <div className="factura-content" id="factura-print">
        <div className="factura-header">
          <h2>Factura #{factura.Numero_Factura}</h2>
          <button onClick={onClose} className="factura-close-btn">×</button>
        </div>

        <div className="factura-empresa">
          <img src="/LogoSinF.png" alt="ScanMed Logo" className="factura-logo" />
          <h3>ScanMed </h3>
          <p>NIT: 900.123.456-7</p>
          <p>Dirección: Carrera 27 #24-19, Tulua</p>
          <p>Teléfono: (57) 123456789</p>
        </div>

        <div className="factura-info">
          <div>
            <strong>No. Factura:</strong> {factura.Numero_Factura}
          </div>
          <div>
            <strong>Fecha:</strong> {new Date(factura.Fecha_Pago).toLocaleDateString()}
          </div>
          <div>
            <strong>Estado:</strong> {factura.Estado}
          </div>
        </div>

        <div className="factura-cliente">
          <h4>Datos del Paciente</h4>
          <p><strong>Nombre:</strong> {factura.Primer_Nombre} {factura.Primer_Apellido}</p>
          <p><strong>Documento:</strong> {factura.Num_Documento}</p>
          <p><strong>Correo:</strong> {factura.Correo_Electronico}</p>
        </div>

        <table className="factura-detalles">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Valor Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((detalle, index) => (
              <tr key={index}>
                <td>{detalle.Descripcion}</td>
                <td>{detalle.Cantidad}</td>
                <td>${parseFloat(detalle.Precio_Unitario).toFixed(2)}</td>
                <td>${parseFloat(detalle.Subtotal).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-right"><strong>Subtotal:</strong></td>
              <td>${parseFloat(factura.Subtotal).toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="3" className="text-right"><strong>IVA (19%):</strong></td>
              <td>${parseFloat(factura.IVA).toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="3" className="text-right"><strong>Total:</strong></td>
              <td>${parseFloat(factura.Total).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="factura-pago">
          <h4>Información de Pago</h4>
          <p><strong>Método:</strong> {factura.Metodo_Pago}</p>
          <p><strong>Transacción:</strong> {factura.Transaccion_ID}</p>
          <p><strong>Estado:</strong> {factura.Estado}</p>
        </div>

        <div className="factura-footer">
          <p>Gracias por confiar en ScanMed</p>
          <p>Factura generada electrónicamente</p>
        </div>

        <div className="factura-actions">
          <button onClick={imprimirFactura} className="factura-print-btn">Imprimir Factura</button>
          <button onClick={generarPDF} className="factura-pdf-btn">Descargar PDF</button>
        </div>
      </div>
    </div>
  );
};

export default Factura;