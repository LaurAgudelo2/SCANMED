import React, { useState } from 'react';
import './CancelarCita.css'; // Archivo de estilos que crearemos después

const CancelarCita = ({ citaId, onCancelSuccess, onClose }) => {
  const [motivo, setMotivo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleCancelar = async () => {
    if (!motivo.trim()) {
      setError('Por favor ingrese un motivo para la cancelación');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/citas/${citaId}/cancelar`, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ motivo })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "No se pudo cancelar la cita");
      }

      onCancelSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cancelar-cita-overlay">
      <div className="cancelar-cita-container">
        <h3>Cancelar Cita</h3>
        
        <div className="cancelar-cita-content">
          <p>¿Está seguro que desea cancelar esta cita?</p>
          
          <div className="form-group">
            <label htmlFor="motivo">Motivo de cancelación:</label>
            <textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ingrese el motivo de la cancelación"
              rows={3}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="cancelar-cita-actions">
          <button 
            onClick={handleCancelar}
            disabled={isSubmitting}
            className="btn-cancelar"
          >
            {isSubmitting ? 'Cancelando...' : 'Confirmar Cancelación'}
          </button>
          <button 
            onClick={onClose}
            className="btn-cerrar"
            disabled={isSubmitting}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelarCita;