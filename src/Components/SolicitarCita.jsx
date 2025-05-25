import { useState, useEffect } from "react";
import axios from "axios";
import "./SolicitarCita.css";
import FuncionPago from './FuncionPago';
import Factura from './Factura';
import Swal from 'sweetalert2';

const SolicitarCita = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    documento: "",
    correo: "",
    servicioId: "",
    doctorId: "",
    fecha: "",
    hora: ""
  });

  const [servicios, setServicios] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [confirmar, setConfirmar] = useState(false);
  const [loading, setLoading] = useState({
    usuario: true,
    servicios: true,
    doctores: false,
    disponibilidad: false
  });
  const [showPayment, setShowPayment] = useState(false);
  const [showFactura, setShowFactura] = useState(false);
  const [facturaData, setFacturaData] = useState(null);
  const [paymentData, setPaymentData] = useState({
    servicio: '',
    precio: 0
  });
  const [errors, setErrors] = useState({
    usuario: null,
    servicios: null,
    doctores: null,
    disponibilidad: null
  });

  // Cargar datos del usuario y servicios al montar el componente
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        // 1. Cargar datos del usuario
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No hay sesión activa');
        }

        const userResponse = await axios.get("http://localhost:4000/api/usuario/actual", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (userResponse.data.success) {
          const user = userResponse.data.data;
          setFormData(prev => ({
            ...prev,
            nombre: user.primerNombre,
            apellidos: `${user.primerApellido} ${user.segundoApellido || ''}`.trim(),
            documento: user.documento,
            correo: user.correo
          }));
        } else {
          throw new Error(userResponse.data.message || 'Error al obtener datos del usuario');
        }

        // 2. Cargar servicios
        const serviciosResponse = await axios.get("http://localhost:4000/api/servicios");
        if (serviciosResponse.data.success && serviciosResponse.data.data.length > 0) {
          setServicios(serviciosResponse.data.data);
        } else {
          throw new Error("No se encontraron servicios disponibles");
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        if (error.response?.status === 401) {
          setErrors(prev => ({
            ...prev,
            usuario: "Por favor inicia sesión para agendar una cita"
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            usuario: error.message || 'Error al cargar tus datos',
            servicios: error.message || 'Error al cargar servicios'
          }));
        }
      } finally {
        setLoading(prev => ({ ...prev, usuario: false, servicios: false }));
      }
    };

    cargarDatosIniciales();
  }, []);

  // Cargar doctores cuando se selecciona un servicio
  useEffect(() => {
    if (!formData.servicioId) {
      setDoctores([]);
      setFormData(prev => ({ ...prev, doctorId: "", fecha: "", hora: "" }));
      return;
    }

    const cargarDoctores = async () => {
      try {
        setLoading(prev => ({ ...prev, doctores: true }));
        setErrors(prev => ({ ...prev, doctores: null }));

        const response = await axios.get(
          `http://localhost:4000/api/medicos/servicio/${formData.servicioId}`
        );

        if (response.data.success) {
          if (response.data.data.length === 0) {
            setErrors(prev => ({
              ...prev,
              doctores: "No hay médicos disponibles para este servicio"
            }));
            setDoctores([]);
          } else {
            setDoctores(response.data.data);
          }
        } else {
          throw new Error(response.data.message || "Datos de doctores no recibidos");
        }
      } catch (error) {
        console.error("Error al cargar doctores:", error);
        setErrors(prev => ({
          ...prev,
          doctores: error.message || "Error al cargar doctores"
        }));
        setDoctores([]);
      } finally {
        setLoading(prev => ({ ...prev, doctores: false }));
      }
    };

    cargarDoctores();
  }, [formData.servicioId]);

  // Cargar disponibilidad cuando se selecciona un doctor
  useEffect(() => {
    if (!formData.doctorId) {
      setDisponibilidad([]);
      setFormData(prev => ({ ...prev, fecha: "", hora: "" }));
      return;
    }

    const cargarDisponibilidad = async () => {
      try {
        setLoading(prev => ({ ...prev, disponibilidad: true }));
        setErrors(prev => ({ ...prev, disponibilidad: null }));

        const response = await axios.get(
          `http://localhost:4000/api/disponibilidad/${formData.doctorId}`
        );

        if (response.data.success && response.data.data) {
          // Filtrar solo días laborables (lunes a viernes)
          const diasLaborables = [1, 2, 3, 4, 5];
          const disponibilidadFiltrada = response.data.data.filter(slot => {
            const fecha = new Date(slot.fecha + 'T00:00:00');
            const diaSemana = fecha.getDay();
            return diasLaborables.includes(diaSemana);
          });
          setDisponibilidad(disponibilidadFiltrada);
        } else {
          throw new Error(response.data.message || "Datos de disponibilidad no recibidos");
        }
      } catch (error) {
        console.error("Error al cargar disponibilidad:", error);
        setErrors(prev => ({
          ...prev,
          disponibilidad: error.message || "Error al cargar horarios disponibles"
        }));
      } finally {
        setLoading(prev => ({ ...prev, disponibilidad: false }));
      }
    };

    cargarDisponibilidad();
  }, [formData.doctorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmar = () => {
    const camposRequeridos = [
      { field: "servicioId", name: "Servicio" },
      { field: "doctorId", name: "Doctor" },
      { field: "fecha", name: "Fecha" },
      { field: "hora", name: "Hora" }
    ];

    const camposFaltantes = camposRequeridos.filter(
      item => !formData[item.field]
    );

    if (camposFaltantes.length > 0) {
      Swal.fire({
        title: 'Campos incompletos',
        html: `Por favor complete los siguientes campos:<br>${camposFaltantes
          .map(item => `• ${item.name}`)
          .join("<br>")}`,
        icon: 'warning'
      });
      return;
    }

    setConfirmar(true);
  };

  const handleReserva = async () => {
    try {
      let horaFormateada = formData.hora;
      if (!horaFormateada.includes(':')) {
        horaFormateada += ':00';
      } else if (horaFormateada.split(':')[1].length === 1) {
        horaFormateada = horaFormateada.replace(/:(\d)$/, ':0$1');
      }

      const servicioSeleccionado = servicios.find(s => s.id === parseInt(formData.servicioId));
      if (!servicioSeleccionado) {
        throw new Error('Servicio no encontrado');
      }

      const confirmacion = await Swal.fire({
        title: 'Confirmar Reserva',
        html: `
          <div style="text-align: left;">
            <p><strong>Paciente:</strong> ${formData.nombre} ${formData.apellidos}</p>
            <p><strong>Documento:</strong> ${formData.documento}</p>
            <p><strong>Correo:</strong> ${formData.correo}</p>
            <p><strong>Servicio:</strong> ${servicioSeleccionado.nombre}</p>
            <p><strong>Precio:</strong> $${parseFloat(servicioSeleccionado.precio).toFixed(2)}</p>
            <p><strong>Médico:</strong> ${
              doctores.find(d => d.ID_MEDICO === parseInt(formData.doctorId))?.Primer_Nombre
            } ${
              doctores.find(d => d.ID_MEDICO === parseInt(formData.doctorId))?.Primer_Apellido
            }</p>
            <p><strong>Fecha:</strong> ${formData.fecha}</p>
            <p><strong>Hora:</strong> ${horaFormateada}</p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Pagar Ahora',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      });

      if (confirmacion.isConfirmed) {
        setPaymentData({
          servicio: servicioSeleccionado,
          precio: parseFloat(servicioSeleccionado.precio)
        });
        setShowPayment(true);
      }
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
      Swal.fire('Error', error.message || 'Ocurrió un error al procesar tu reserva', 'error');
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      console.log('Iniciando handlePaymentSuccess con paymentData:', paymentData);

      // Validar datos recibidos
      const requiredFields = ['citaId', 'paciente', 'medico', 'servicio', 'fecha', 'hora', 'precio', 'facturaData'];
      const missingFields = requiredFields.filter(field => !paymentData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Faltan campos en paymentData: ${missingFields.join(', ')}`);
      }

      // Almacenar facturaData para usarlo más tarde
      setFacturaData(paymentData.facturaData);

      // Mostrar comprobante de cita con botón para ver factura
      await Swal.fire({
        title: '¡Reserva Exitosa!',
        html: `
          <div style="text-align: left;">
            <h3 style="color: #2c3e50; margin-bottom: 1rem;">Comprobante de Cita</h3>
            <p><strong>Número de Cita:</strong> ${paymentData.citaId}</p>
            <p><strong>Paciente:</strong> ${paymentData.paciente}</p>
            <p><strong>Médico:</strong> ${paymentData.medico}</p>
            <p><strong>Servicio:</strong> ${paymentData.servicio}</p>
            <p><strong>Precio:</strong> $${parseFloat(paymentData.precio).toFixed(2)}</p>
            <p><strong>Fecha:</strong> ${paymentData.fecha}</p>
            <p><strong>Hora:</strong> ${paymentData.hora}</p>
            <hr style="margin: 1rem 0;">
            <p>Recibirá un correo de confirmación en <strong>${formData.correo}</strong></p>
            <p>La factura ha sido generada y está disponible para descargar</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Ver Factura',
        cancelButtonColor: '#10b981'
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          // Mostrar factura al hacer clic en "Ver Factura"
          setShowFactura(true);
        }
      });

      // Resetear formulario
      setFormData(prev => ({
        ...prev,
        servicioId: "",
        doctorId: "",
        fecha: "",
        hora: ""
      }));
      setConfirmar(false);
      setShowPayment(false);

      // Recargar disponibilidad si es necesario
      if (formData.doctorId) {
        console.log('Recargando disponibilidad para doctorId:', formData.doctorId);
        const disponibilidadResponse = await axios.get(
          `http://localhost:4000/api/disponibilidad/${formData.doctorId}`
        );
        setDisponibilidad(disponibilidadResponse.data.data);
        console.log('Disponibilidad actualizada:', disponibilidadResponse.data.data);
      }
    } catch (error) {
      console.error('Error en handlePaymentSuccess:', error);
      Swal.fire({
        title: 'Error',
        html: `<div style="text-align: left;">${error.message || 'Error al procesar la reserva'}</div>`,
        icon: 'error'
      });
    }
  };

  const handleFacturaClose = () => {
    setShowFactura(false);
    setFacturaData(null);
  };

  if (loading.usuario) {
    return (
      <div className="conte">
        <div className="solicitar-cita-container">
          <h2>DATOS DE LA RESERVA DE CITA</h2>
          <div className="loading-container">
            <p>Cargando tus datos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errors.usuario) {
    return (
      <div className="conte">
        <div className="solicitar-cita-container">
          <h2>DATOS DE LA RESERVA DE CITA</h2>
          <div className="error-container">
            <p className="error-message">{errors.usuario}</p>
            <a href="/login" className="login-link">Iniciar sesión</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="conte">
      <header className="header4">
        <div className="logo"></div>
        <img src="LogoSinF.png" className="LogoSF" alt="Logo" />
        <nav className="nav">
          <a href="#">INICIO</a>
          <a href="#">NOSOTROS</a>
          <a href="#">CONTACTOS</a>
          <a href="#">AYUDA</a>
        </nav>
        <div className="perfil2">
          <a href="#">MI PERFIL</a>
          <img src="user.png" alt="Perfil" className="user" width={50} />
        </div>
      </header>

      <div className="solicitar-cita-container">
        <h2>DATOS DE LA RESERVA DE CITA</h2>

        {confirmar ? (
          <div className="confirmacion">
            <h3>Confirme su Reserva</h3>
            <p><b>Paciente:</b> {formData.nombre} {formData.apellidos}</p>
            <p><b>Documento:</b> {formData.documento}</p>
            <p><b>Correo:</b> {formData.correo}</p>
            <p><b>Servicio:</b> {
              servicios.find(s => s.id === parseInt(formData.servicioId))?.nombre
            }</p>
            <p><b>Precio:</b> ${
              parseFloat(servicios.find(s => s.id === parseInt(formData.servicioId))?.precio || 0).toFixed(2)
            }</p>
            <p><b>Doctor:</b> {
              doctores.find(d => d.ID_MEDICO === parseInt(formData.doctorId))?.Primer_Nombre
            } {
              doctores.find(d => d.ID_MEDICO === parseInt(formData.doctorId))?.Primer_Apellido
            }</p>
            <p><b>Fecha:</b> {formData.fecha}</p>
            <p><b>Hora:</b> {formData.hora}</p>

            <div className="confirmacion-botones">
              <button className="btn" onClick={handleReserva}>
                Confirmar Reserva
              </button>
              <button className="btn-cancel" onClick={() => setConfirmar(false)}>
                Cancelar
              </button>
            </div>

            {showPayment && (
              <FuncionPago
                servicio={paymentData.servicio}
                precio={paymentData.precio}
                onPaymentSuccess={handlePaymentSuccess}
                onClose={() => setShowPayment(false)}
                formData={formData}
              />
            )}
          </div>
        ) : (
          <form className="form-cita" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                readOnly
                className="readonly-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellidos">Apellidos:</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                readOnly
                className="readonly-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="documento">Documento:</label>
              <input
                type="text"
                id="documento"
                name="documento"
                value={formData.documento}
                readOnly
                className="readonly-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="correo">Correo electrónico:</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                readOnly
                className="readonly-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="servicioId">Servicio:</label>
              <select
                id="servicioId"
                name="servicioId"
                value={formData.servicioId}
                onChange={handleChange}
                required
                disabled={loading.servicios}
              >
                <option value="">Seleccione un Servicio</option>
                {loading.servicios ? (
                  <option disabled>Cargando servicios...</option>
                ) : errors.servicios ? (
                  <option disabled className="error-text">
                    {errors.servicios}
                  </option>
                ) : (
                  servicios.map(servicio => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.nombre} - ${servicio.precio}
                    </option>
                  ))
                )}
              </select>
              {errors.servicios && !loading.servicios && (
                <p className="error-message">{errors.servicios}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="doctorId">Doctor:</label>
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
                disabled={!formData.servicioId || loading.doctores}
              >
                <option value="">Seleccione un Doctor</option>
                {loading.doctores ? (
                  <option disabled>Cargando doctores...</option>
                ) : errors.doctores ? (
                  <option disabled className="error-text">
                    {errors.doctores}
                  </option>
                ) : (
                  doctores.map(doctor => (
                    <option key={doctor.ID_MEDICO} value={doctor.ID_MEDICO}>
                      {doctor.Primer_Nombre} {doctor.Primer_Apellido} - {doctor.Especialidad}
                    </option>
                  ))
                )}
              </select>
              {errors.doctores && !loading.doctores && (
                <p className="error-message">{errors.doctores}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="fecha">Fecha:</label>
              <select
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
                disabled={!formData.doctorId || loading.disponibilidad}
              >
                <option value="">Seleccione una Fecha</option>
                {loading.disponibilidad ? (
                  <option disabled>Cargando fechas disponibles...</option>
                ) : errors.disponibilidad ? (
                  <option disabled className="error-text">
                    {errors.disponibilidad}
                  </option>
                ) : (
                  [...new Set(disponibilidad.map(d => d.fecha))]
                    .sort((a, b) => new Date(a) - new Date(b))
                    .map((fecha, idx) => {
                      const fechaObj = new Date(fecha + 'T00:00:00');
                      return (
                        <option key={idx} value={fecha}>
                          {fechaObj.toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </option>
                      );
                    })
                )}
              </select>
              {errors.disponibilidad && !loading.disponibilidad && (
                <p className="error-message">{errors.disponibilidad}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="hora">Hora:</label>
              <select
                id="hora"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                required
                disabled={!formData.fecha}
              >
                <option value="">Seleccione una Hora</option>
                {formData.fecha &&
                  disponibilidad
                    .filter(d => d.fecha === formData.fecha)
                    .map((slot, idx) => (
                      <option key={idx} value={slot.hora}>
                        {slot.hora}
                      </option>
                    ))}
              </select>
            </div>

            <button
              type="button"
              className="btn"
              onClick={handleConfirmar}
              disabled={
                loading.servicios ||
                loading.doctores ||
                loading.disponibilidad ||
                !formData.servicioId ||
                !formData.doctorId ||
                !formData.fecha ||
                !formData.hora
              }
            >
              Confirmar Datos
            </button>
          </form>
        )}

        {showFactura && facturaData && (
          <Factura
            pagoId={facturaData.pagoId}
            pacienteId={facturaData.pacienteId}
            onClose={handleFacturaClose}
          />
        )}
      </div>
    </div>
  );
};

export default SolicitarCita;