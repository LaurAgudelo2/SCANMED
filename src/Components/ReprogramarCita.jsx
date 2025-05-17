import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReprogramarCita.css';

const ReprogramarCita = ({ citaId, medicoId, fechaOriginal, onReprogramar, onClose }) => {
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [showConfirmacion, setShowConfirmacion] = useState(false);

  // Modifica el useEffect en ReprogramarCita.js así:
// En ReprogramarCita.js
useEffect(() => {
    const cargarDisponibilidad = async () => {
      try {
        if (!medicoId) {
          throw new Error("No se proporcionó un ID de médico válido");
        }
  
        console.log(`Cargando disponibilidad para médico ID: ${medicoId}`);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:4000/api/disponibilidad/${medicoId}`,
          { headers: { Authorization: "Bearer " + token } }
        );
        
        if (response.data.success) {
          setDisponibilidad(response.data.data);
        } else {
          setError(response.data.message || "Error al obtener disponibilidad");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
  
    cargarDisponibilidad();
  }, [medicoId]);
  
  // En el render, añade esta validación inicial
  if (!medicoId) {
    return (
      <div className="reprogramar-modal">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>×</button>
          <h2>Error</h2>
          <p>No se pudo obtener la información del médico para esta cita.</p>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    );
  }
  

  const handleFechaChange = (e) => {
    setFechaSeleccionada(e.target.value);
    setHoraSeleccionada(''); // Resetear hora al cambiar fecha
  };

  const handleHoraChange = (e) => {
    setHoraSeleccionada(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fechaSeleccionada || !horaSeleccionada) {
      setError("Por favor selecciona una fecha y hora");
      return;
    }

    setShowConfirmacion(true);
  };

  const confirmarReprogramacion = async () => {
    try {
      const token = localStorage.getItem("token");
      const fechaHora = `${fechaSeleccionada} ${horaSeleccionada}`;
      
      const response = await axios.put(
        `http://localhost:4000/api/citas/${citaId}/reprogramar`,
        { nuevaFechaHora: fechaHora },
        { headers: { Authorization: "Bearer " + token } }
      );

      if (response.data.success) {
        onReprogramar(citaId, fechaHora);
        onClose();
      } else {
        setError(response.data.message || "Error al reprogramar la cita");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setShowConfirmacion(false);
    }
  };

  // En ReprogramarCita.js, modifica el return:
if (loading) return (
    <div className="reprogramar-modal">
      <div className="modal-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando disponibilidad del médico...</p>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="reprogramar-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Error al cargar disponibilidad</h2>
        <div className="error-message">{error}</div>
        <button className="retry-btn" onClick={() => {
          setError(null);
          setLoading(true);
          // Volver a cargar
          if (medicoId) {
            cargarDisponibilidad();
          }
        }}>
          Reintentar
        </button>
      </div>
    </div>
  );

  // Agrupar disponibilidad por fecha
  const disponibilidadPorFecha = disponibilidad.reduce((acc, slot) => {
    if (!acc[slot.fecha]) {
      acc[slot.fecha] = [];
    }
    acc[slot.fecha].push(slot.hora);
    return acc;
  }, {});

  return (
    <div className="reprogramar-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Reprogramar Cita</h2>
        <p>Cita original: {new Date(fechaOriginal).toLocaleString()}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Selecciona una fecha:</label>
            <select 
              value={fechaSeleccionada} 
              onChange={handleFechaChange}
              required
            >
              <option value="">-- Selecciona una fecha --</option>
              {Object.keys(disponibilidadPorFecha).map(fecha => (
                <option key={fecha} value={fecha}>
                  {new Date(fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </option>
              ))}
            </select>
          </div>

          {fechaSeleccionada && (
            <div className="form-group">
              <label>Selecciona una hora:</label>
              <select 
                value={horaSeleccionada} 
                onChange={handleHoraChange}
                required
              >
                <option value="">-- Selecciona una hora --</option>
                {disponibilidadPorFecha[fechaSeleccionada]?.map(hora => (
                  <option key={hora} value={hora}>
                    {hora}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn" disabled={!fechaSeleccionada || !horaSeleccionada}>
              Continuar
            </button>
          </div>
        </form>

        {showConfirmacion && (
          <div className="confirmation-modal">
            <div className="confirmation-content">
              <h3>Confirmar Reprogramación</h3>
              <p>¿Estás seguro que deseas reprogramar tu cita para el {new Date(fechaSeleccionada).toLocaleDateString()} a las {horaSeleccionada}?</p>
              <div className="confirmation-buttons">
                <button onClick={() => setShowConfirmacion(false)}>Cancelar</button>
                <button onClick={confirmarReprogramacion}>Confirmar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReprogramarCita;