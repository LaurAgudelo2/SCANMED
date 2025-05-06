import React, { useState } from 'react';
import './FuncionPago.css';
import Swal from 'sweetalert2';
import axios from 'axios';

const FuncionPago = ({ servicio, precio, onPaymentSuccess, onClose, formData }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    loading: false,
    error: null
  });

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      setPaymentData(prev => ({
        ...prev,
        [name]: formatCardNumber(value)
      }));
    } else if (name === 'expiryDate') {
      // Formato MM/AA
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
      }
      setPaymentData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'cvv') {
      // Solo números, máximo 4 dígitos
      setPaymentData(prev => ({
        ...prev,
        [name]: value.replace(/\D/g, '').substring(0, 4)
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    // Validar número de tarjeta (16 dígitos sin espacios)
    const cardNumberValid = paymentData.cardNumber.replace(/\s/g, '').length === 16;
    
    // Validar nombre (mínimo 3 caracteres)
    const cardNameValid = paymentData.cardName.trim().length >= 3;
    
    // Validar fecha de expiración (MM/AA)
    const expiryValid = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(paymentData.expiryDate);
    
    // Validar CVV (3 o 4 dígitos)
    const cvvValid = /^[0-9]{3,4}$/.test(paymentData.cvv);
    
    return cardNumberValid && cardNameValid && expiryValid && cvvValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentData(prev => ({ ...prev, loading: true, error: null }));

    if (!validateForm()) {
      setPaymentData(prev => ({ ...prev, loading: false }));
      Swal.fire('Error', 'Por favor complete todos los campos correctamente', 'error');
      return;
    }

    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Registrar el pago en el backend
      const response = await axios.post("http://localhost:4000/api/pagos", {
        ID_PACIENTE: 1, // Debería obtenerse del usuario autenticado
        ID_SERVICIO: formData.servicioId,
        monto: precio,
        metodo_pago: 'Tarjeta de Crédito',
        estado: 'COMPLETADO',
        transaccion_id: `TXN-${Date.now()}`
      });

      if (response.data.success) {
        await Swal.fire({
          title: '¡Pago exitoso!',
          html: `
            <div style="text-align: left;">
              <p><strong>Servicio:</strong> ${servicio}</p>
              <p><strong>Monto:</strong> $${precio.toFixed(2)}</p>
              <p><strong>Número de transacción:</strong> ${response.data.transaccion_id}</p>
              <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
            </div>
          `,
          icon: 'success'
        });
        
        onPaymentSuccess();
      } else {
        throw new Error(response.data.message || 'Error en el pago');
      }
    } catch (error) {
      console.error('Error en el pago:', error);
      setPaymentData(prev => ({ ...prev, error: error.message }));
      Swal.fire('Error', 'Ocurrió un error al procesar el pago', 'error');
    } finally {
      setPaymentData(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="payment-modal">
      <div className="payment-container">
        <button className="close-btn" onClick={onClose} aria-label="Cerrar">
          &times;
        </button>
        
        <h2>Pagar Servicio Médico</h2>
        
        <div className="payment-summary">
          <p><strong>Servicio:</strong> {servicio}</p>
          <p><strong>Total a pagar:</strong> ${precio.toFixed(2)}</p>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="cardNumber">Número de Tarjeta</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentData.cardNumber}
              onChange={handleInputChange}
              maxLength="19"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cardName">Nombre en la Tarjeta</label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              placeholder="JUAN PEREZ"
              value={paymentData.cardName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Fecha de Expiración</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/AA"
                value={paymentData.expiryDate}
                onChange={handleInputChange}
                maxLength="5"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="password"
                id="cvv"
                name="cvv"
                placeholder="123"
                value={paymentData.cvv}
                onChange={handleInputChange}
                maxLength="4"
                required
              />
            </div>
          </div>
          
          {paymentData.error && (
            <div className="payment-error">
              {paymentData.error}
            </div>
          )}
          
          <button
            type="submit"
            className="pay-btn"
            disabled={paymentData.loading}
          >
            {paymentData.loading ? (
              <>
                <span className="spinner"></span>
                Procesando...
              </>
            ) : (
              `Pagar $${precio.toFixed(2)}`
            )}
          </button>
        </form>
        
        <div className="payment-security">
          <p>🔒 Pago seguro con encriptación SSL</p>
          <div className="test-card-info">
            <p><strong>Tarjeta de prueba:</strong></p>
            <p>Número: 4242 4242 4242 4242</p>
            <p>Fecha: Cualquier fecha futura (MM/AA)</p>
            <p>CVV: Cualquier número de 3 dígitos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuncionPago;