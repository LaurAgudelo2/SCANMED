import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './FuncionPago.css';

const FuncionPago = ({ servicio, precio, onPaymentSuccess, onClose, formData }) => {
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [paypalEmail, setPaypalEmail] = useState('');
  const [bancolombiaData, setBancolombiaData] = useState({
    accountNumber: '',
    accountType: 'ahorros'
  });
  const [nequiPhone, setNequiPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateCardNumber = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length > 16) return false;
    return cleanValue;
  };

  const validateCVV = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length > 4) return false;
    return cleanValue;
  };

  const validateExpiryDate = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length > 4) return false;
    if (cleanValue.length === 4) {
      const month = parseInt(cleanValue.slice(0, 2));
      const year = parseInt(cleanValue.slice(2, 4));
      const currentYear = new Date().getFullYear() % 100;
      if (month < 1 || month > 12 || year < currentYear) return false;
    }
    return cleanValue;
  };

  const validatePhone = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length > 10) return false;
    return cleanValue;
  };

  const validateAccountNumber = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length > 20) return false;
    return cleanValue;
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const formatCardNumber = (value) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 16);
    return cleanValue.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 4);
    if (cleanValue.length > 2) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}`;
    }
    return cleanValue;
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let error = '';

    if (name === 'cardNumber') {
      const validated = validateCardNumber(value);
      if (validated === false) {
        error = 'El número de tarjeta debe tener máximo 16 dígitos';
      } else {
        newValue = formatCardNumber(value);
      }
    } else if (name === 'cvv') {
      const validated = validateCVV(value);
      if (validated === false) {
        error = 'El CVV debe tener 3 o 4 dígitos';
      } else {
        newValue = validated;
      }
    } else if (name === 'expiryDate') {
      const validated = validateExpiryDate(value.replace(/\//g, ''));
      if (validated === false) {
        error = 'Fecha de expiración inválida (MM/AA)';
      } else {
        newValue = formatExpiryDate(validated);
      }
    } else if (name === 'cardName') {
      newValue = value.toUpperCase().slice(0, 50);
      if (!/^[A-Z\s]*$/.test(newValue)) {
        error = 'Solo letras y espacios';
      }
    }

    setCardData(prev => ({ ...prev, [name]: newValue }));
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handlePaypalChange = (e) => {
    const value = e.target.value;
    setPaypalEmail(value);
    setErrors(prev => ({
      ...prev,
      paypalEmail: validateEmail(value) ? '' : 'Correo electrónico inválido'
    }));
  };

  const handleBancolombiaChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let error = '';

    if (name === 'accountNumber') {
      const validated = validateAccountNumber(value);
      if (validated === false) {
        error = 'El número de cuenta debe tener máximo 20 dígitos';
      } else {
        newValue = validated;
      }
    }

    setBancolombiaData(prev => ({ ...prev, [name]: newValue }));
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleNequiChange = (e) => {
    const value = e.target.value;
    const validated = validatePhone(value);
    setNequiPhone(validated || value);
    setErrors(prev => ({
      ...prev,
      nequiPhone: validated === false ? 'El número debe tener máximo 10 dígitos' : ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === 'tarjeta') {
      if (!cardData.cardNumber || cardData.cardNumber.replace(/\D/g, '').length !== 16) {
        newErrors.cardNumber = 'El número de tarjeta debe tener 16 dígitos';
      }
      if (!cardData.cardName) {
        newErrors.cardName = 'El nombre es obligatorio';
      }
      if (!cardData.expiryDate || !/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
        newErrors.expiryDate = 'Fecha de expiración inválida (MM/AA)';
      }
      if (!cardData.cvv || !/^\d{3,4}$/.test(cardData.cvv)) {
        newErrors.cvv = 'El CVV debe tener 3 o 4 dígitos';
      }
    } else if (paymentMethod === 'paypal') {
      if (!paypalEmail || !validateEmail(paypalEmail)) {
        newErrors.paypalEmail = 'Correo electrónico inválido';
      }
    } else if (paymentMethod === 'bancolombia') {
      if (!bancolombiaData.accountNumber || bancolombiaData.accountNumber.length < 6) {
        newErrors.accountNumber = 'El número de cuenta debe tener al menos 6 dígitos';
      }
    } else if (paymentMethod === 'nequi') {
      if (!nequiPhone || nequiPhone.length !== 10) {
        newErrors.nequiPhone = 'El número de teléfono debe tener 10 dígitos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire('Error', 'Por favor corrige los errores en el formulario', 'error');
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      if (!servicio?.id || !precio || !formData?.doctorId || !formData?.fecha || !formData?.hora) {
        throw new Error('Faltan datos necesarios para procesar el pago');
      }

      // Crear cita
      const citaResponse = await axios.post(
        "http://localhost:4000/api/citas",
        {
          servicioId: servicio.id,
          doctorId: formData.doctorId,
          fecha: formData.fecha,
          hora: formData.hora
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!citaResponse.data.success) {
        throw new Error(citaResponse.data.message || 'Error al crear la cita');
      }

      const { citaId, idPaciente, paciente, medico, servicio: nombreServicio, fecha, hora } = citaResponse.data.data;
      if (!citaId || !idPaciente) {
        throw new Error('Faltan datos en la respuesta de la cita (citaId o idPaciente)');
      }

      // Registrar pago
      const paymentRecord = {
        pacienteId: idPaciente,
        servicioId: servicio.id,
        citaId: citaId,
        metodoPago: paymentMethod.toUpperCase(),
        transaccionId: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        monto: precio,
        detalles: `Pago por servicio ${servicio.nombre}`,
        estado: 'COMPLETADO'
      };

      const paymentResponse = await axios.post(
        'http://localhost:4000/api/pagos',
        paymentRecord,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Generar factura
      if (paymentResponse.data.success) {
        const facturaResponse = await axios.post(
          'http://localhost:4000/api/facturas',
          {
            pagoId: paymentResponse.data.data.pagoId,
            pacienteId: idPaciente,
            numeroFactura: `FAC-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            total: precio,
            servicioId: servicio.id,
            descripcion: servicio.nombre,
            cantidad: 1
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (facturaResponse.data.success) {
          // Preparar datos para pasar a onPaymentSuccess
          const paymentData = {
            ...paymentResponse.data.data,
            citaId,
            paciente,
            medico,
            servicio: nombreServicio,
            fecha,
            hora,
            precio,
            facturaData: {
              pagoId: paymentResponse.data.data.pagoId,
              pacienteId: idPaciente,
              facturaId: facturaResponse.data.data.facturaId
            }
          };

          // Llamar a onPaymentSuccess y cerrar el modal
          onPaymentSuccess(paymentData);
          onClose();
        } else {
          throw new Error(facturaResponse.data.message || 'Error al generar factura');
        }
      } else {
        throw new Error(paymentResponse.data.message || 'Error al registrar el pago');
      }
    } catch (error) {
      console.error('Error en el pago:', error.response?.data || error);
      setErrors({ general: error.response?.data?.message || error.message || 'Ocurrió un error al procesar el pago' });
      Swal.fire('Error', error.response?.data?.message || error.message || 'Ocurrió un error al procesar el pago', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-modal">
      <div className="payment-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Completar Pago</h2>

        <div className="payment-summary">
          <p><strong>Servicio:</strong> {servicio.nombre}</p>
          <p><strong>Total a pagar:</strong> ${precio.toFixed(2)}</p>
          <p><strong>Paciente:</strong> {formData.nombre} {formData.apellidos}</p>
        </div>

        <div className="payment-methods">
          <h3>Selecciona un método de pago</h3>
          <div className="method-options">
            <label className={paymentMethod === 'tarjeta' ? 'selected' : ''}>
              <input
                type="radio"
                name="paymentMethod"
                value="tarjeta"
                checked={paymentMethod === 'tarjeta'}
                onChange={() => setPaymentMethod('tarjeta')}
              />
              <span>Tarjeta de Crédito/Débito</span>
            </label>
            <label className={paymentMethod === 'paypal' ? 'selected' : ''}>
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={() => setPaymentMethod('paypal')}
              />
              <span>PayPal</span>
            </label>
            <label className={paymentMethod === 'bancolombia' ? 'selected' : ''}>
              <input
                type="radio"
                name="paymentMethod"
                value="bancolombia"
                checked={paymentMethod === 'bancolombia'}
                onChange={() => setPaymentMethod('bancolombia')}
              />
              <span>Transferencia Bancolombia</span>
            </label>
            <label className={paymentMethod === 'nequi' ? 'selected' : ''}>
              <input
                type="radio"
                name="paymentMethod"
                value="nequi"
                checked={paymentMethod === 'nequi'}
                onChange={() => setPaymentMethod('nequi')}
              />
              <span>Nequi</span>
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {paymentMethod === 'tarjeta' && (
            <div className="card-form">
              <div className="form-group">
                <label>Número de Tarjeta</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleCardChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className={errors.cardNumber ? 'input-error' : ''}
                />
                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
              </div>
              <div className="form-group">
                <label>Nombre en la Tarjeta</label>
                <input
                  type="text"
                  name="cardName"
                  value={cardData.cardName}
                  onChange={handleCardChange}
                  placeholder="Como aparece en la tarjeta"
                  className={errors.cardName ? 'input-error' : ''}
                />
                {errors.cardName && <span className="error-message">{errors.cardName}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Expiración</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardData.expiryDate}
                    onChange={handleCardChange}
                    placeholder="MM/AA"
                    maxLength="5"
                    className={errors.expiryDate ? 'input-error' : ''}
                  />
                  {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardChange}
                    placeholder="123"
                    maxLength="4"
                    className={errors.cvv ? 'input-error' : ''}
                  />
                  {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="paypal-form">
              <div className="form-group">
                <label>Correo de PayPal</label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={handlePaypalChange}
                  placeholder="tucorreo@paypal.com"
                  className={errors.paypalEmail ? 'input-error' : ''}
                />
                {errors.paypalEmail && <span className="error-message">{errors.paypalEmail}</span>}
              </div>
              <p className="payment-note">Serás redirigido a PayPal para completar el pago</p>
            </div>
          )}

          {paymentMethod === 'bancolombia' && (
            <div className="bancolombia-form">
              <div className="form-group">
                <label>Número de Cuenta</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bancolombiaData.accountNumber}
                  onChange={handleBancolombiaChange}
                  placeholder="Número de cuenta"
                  className={errors.accountNumber ? 'input-error' : ''}
                />
                {errors.accountNumber && <span className="error-message">{errors.accountNumber}</span>}
              </div>
              <div className="form-group">
                <label>Tipo de Cuenta</label>
                <select
                  name="accountType"
                  value={bancolombiaData.accountType}
                  onChange={handleBancolombiaChange}
                >
                  <option value="ahorros">Ahorros</option>
                  <option value="corriente">Corriente</option>
                </select>
              </div>
              <div className="payment-instructions">
                <h4>Instrucciones para transferencia:</h4>
                <ol>
                  <li>Realiza una transferencia a la cuenta Bancolombia #123456789</li>
                  <li>Referencia: PAGO-{formData.documento}</li>
                  <li>Monto: ${precio.toFixed(2)}</li>
                  <li>Envía el comprobante a pagos@scanmed.com</li>
                </ol>
              </div>
            </div>
          )}

          {paymentMethod === 'nequi' && (
            <div className="nequi-form">
              <div className="form-group">
                <label>Número de Teléfono Nequi</label>
                <input
                  type="tel"
                  value={nequiPhone}
                  onChange={handleNequiChange}
                  placeholder="3101234567"
                  maxLength="10"
                  className={errors.nequiPhone ? 'input-error' : ''}
                />
                {errors.nequiPhone && <span className="error-message">{errors.nequiPhone}</span>}
              </div>
              <div className="payment-instructions">
                <h4>Instrucciones para pago con Nequi:</h4>
                <ol>
                  <li>Ingresa a la app de Nequi</li>
                  <li>Selecciona "Pagar"</li>
                  <li>Busca "ScanMed" o ingresa el número 3101234567</li>
                  <li>Ingresa el monto: ${precio.toFixed(2)}</li>
                  <li>Confirma el pago</li>
                </ol>
              </div>
            </div>
          )}

          {errors.general && <div className="payment-error">{errors.general}</div>}

          <button type="submit" className="pay-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> Procesando...
              </>
            ) : (
              `Pagar $${precio.toFixed(2)}`
            )}
          </button>
        </form>

        <div className="payment-security">
          <p>🔒 Transacción segura - Todos tus datos están protegidos</p>
        </div>
      </div>
    </div>
  );
};

export default FuncionPago;