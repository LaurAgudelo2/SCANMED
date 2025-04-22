import { useState, useEffect } from "react";
import axios from "axios";
import "./solicitarCita.css";
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
    servicios: true,
    doctores: false,
    disponibilidad: false
  });
  const [errors, setErrors] = useState({
    servicios: null,
    doctores: null,
    disponibilidad: null
  });

  // Cargar servicios al montar el componente
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        console.log("🔄 Iniciando carga de servicios desde frontend...");
        setLoading(prev => ({ ...prev, servicios: true }));
        setErrors(prev => ({ ...prev, servicios: null }));
        
        const response = await axios.get("http://localhost:4000/api/servicios", {
          timeout: 8000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log("📦 Respuesta completa de la API:", {
          status: response.status,
          data: response.data
        });
        
        if (response.status === 200 && response.data.success) {
          if (response.data.data && response.data.data.length > 0) {
            setServicios(response.data.data);
            console.log("✅ Servicios cargados:", response.data.data);
          } else {
            throw new Error("La API no devolvió datos de servicios");
          }
        } else {
          throw new Error(response.data.message || "Respuesta inesperada de la API");
        }
      } catch (error) {
        let errorMessage = "Error al cargar servicios";
        
        if (error.code === 'ECONNABORTED') {
          errorMessage = "Tiempo de espera agotado. El servidor no respondió.";
        } else if (error.response) {
          // El servidor respondió con un código de error
          console.error("❌ Error de respuesta:", {
            status: error.response.status,
            data: error.response.data
          });
          
          errorMessage = error.response.data.message || 
                        `Error ${error.response.status}: ${error.response.statusText}`;
        } else if (error.request) {
          // La solicitud fue hecha pero no hubo respuesta
          console.error("❌ No hubo respuesta del servidor:", error.request);
          errorMessage = "El servidor no respondió. Verifica:";
          errorMessage += "\n1. Que el backend esté corriendo";
          errorMessage += "\n2. Que el puerto (4000) sea correcto";
          errorMessage += "\n3. Que no haya errores de CORS";
        } else {
          // Error al configurar la solicitud
          console.error("❌ Error de configuración:", error.message);
          errorMessage = error.message || "Error desconocido";
        }
        
        setErrors(prev => ({ ...prev, servicios: errorMessage }));
      } finally {
        setLoading(prev => ({ ...prev, servicios: false }));
      }
    };

    cargarServicios();
  }, []);


  // Cargar doctores cuando se selecciona un servicio
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
          setDisponibilidad(response.data.data);
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
    // Validación de campos obligatorios
    const camposRequeridos = [
      { field: "nombre", name: "Nombre" },
      { field: "apellidos", name: "Apellidos" },
      { field: "documento", name: "Documento" },
      { field: "correo", name: "Correo electrónico" },
      { field: "servicioId", name: "Servicio" },
      { field: "doctorId", name: "Doctor" },
      { field: "fecha", name: "Fecha" },
      { field: "hora", name: "Hora" }
    ];

    const camposFaltantes = camposRequeridos.filter(
      item => !formData[item.field]
    );

    if (camposFaltantes.length > 0) {
      alert(
        `Por favor complete los siguientes campos:\n${camposFaltantes
          .map(item => `- ${item.name}`)
          .join("\n")}`
      );
      return;
    }

    setConfirmar(true);
  };

  const handleReserva = async () => {
    try {
      // Formatear hora correctamente
      let horaFormateada = formData.hora;
      if (!horaFormateada.includes(':')) {
        horaFormateada += ':00';
      } else if (horaFormateada.split(':')[1].length === 1) {
        horaFormateada = horaFormateada.replace(/:(\d)$/, ':0$1');
      }
  
      // Mostrar confirmación
      const confirmacion = await Swal.fire({
        title: 'Confirmar Reserva',
        html: `
          <div style="text-align: left;">
            <p><strong>Paciente:</strong> ${formData.nombre} ${formData.apellidos}</p>
            <p><strong>Documento:</strong> ${formData.documento}</p>
            <p><strong>Correo:</strong> ${formData.correo}</p>
            <p><strong>Servicio:</strong> ${
              servicios.find(s => s.id === parseInt(formData.servicioId))?.nombre
            }</p>
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
        confirmButtonText: 'Confirmar Reserva',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      });
  
      if (confirmacion.isConfirmed) {
        // Mostrar carga mientras se procesa
        Swal.fire({
          title: 'Procesando reserva',
          html: 'Por favor espere...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
  
        // Enviar datos al servidor
        const response = await axios.post("http://localhost:4000/api/citas", {
          ...formData,
          hora: horaFormateada
        });
  
        // Cerrar alerta de carga
        Swal.close();
  
        if (response.data.success) {
          // Mostrar comprobante de reserva
          await Swal.fire({
            title: '¡Reserva Exitosa!',
            html: `
              <div style="text-align: left;">
                <h3 style="color: #2c3e50; margin-bottom: 1rem;">Comprobante de Cita</h3>
                <p><strong>Número de Cita:</strong> ${response.data.data.citaId}</p>
                <p><strong>Paciente:</strong> ${response.data.data.paciente}</p>
                <p><strong>Médico:</strong> ${response.data.data.medico}</p>
                <p><strong>Servicio:</strong> ${response.data.data.servicio}</p>
                <p><strong>Fecha:</strong> ${response.data.data.fecha}</p>
                <p><strong>Hora:</strong> ${response.data.data.hora}</p>
                <hr style="margin: 1rem 0;">
                <p>Recibirá un correo de confirmación en <strong>${formData.correo}</strong></p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
  
          // Resetear formulario
          setFormData({
            nombre: "",
            apellidos: "",
            documento: "",
            correo: "",
            servicioId: "",
            doctorId: "",
            fecha: "",
            hora: ""
          });
          setConfirmar(false);
          
          // Recargar disponibilidad
          if (formData.doctorId) {
            const disponibilidadResponse = await axios.get(
              `http://localhost:4000/api/disponibilidad/${formData.doctorId}`
            );
            setDisponibilidad(disponibilidadResponse.data.data);
          }
          
        }
      }
    }catch (error) {
      console.error("Error al reservar cita:", error);
      Swal.close();
      
      let errorMessage = "Error al procesar la reserva";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
        
        // Manejar específicamente el caso de usuario no registrado
        if (error.response.data.message.includes("Usuario no registrado")) {
          errorMessage += ". Por favor complete su registro primero.";
        }
        // Manejar caso de correo no coincidente
        else if (error.response.data.message.includes("El correo no coincide")) {
          errorMessage += ". Verifique sus datos de contacto.";
        }
      }
  
      Swal.fire({
        title: 'Error',
        html: `<div style="text-align: left;">${errorMessage}</div>`,
        icon: 'error'
      });
    }
  };
  

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
            <p><b>Doctor:</b> {
              doctores.find(d => d.ID_MEDICO === parseInt(formData.doctorId))?.Primer_Nombre
            } {
              doctores.find(d => d.ID_MEDICO === parseInt(formData.doctorId))?.Primer_Apellido
            }</p>
            <p><b>Fecha:</b> {formData.fecha}</p>
            <p><b>Hora:</b> {formData.hora}</p>

            <div className="confirmacion-botones">
              <button className="btn2" onClick={handleReserva}>
                Confirmar Reserva
              </button>
              <button className="btn-cancel" onClick={() => setConfirmar(false)}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <form className="form-cita" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellidos">Apellidos:</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                placeholder="Apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="documento">Documento:</label>
              <input
                type="text"
                id="documento"
                name="documento"
                placeholder="Documento"
                value={formData.documento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="correo">Correo electrónico:</label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="Correo electrónico"
                value={formData.correo}
                onChange={handleChange}
                required
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
                      {servicio.nombre}
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
                      {doctor.Primer_Nombre} {doctor.Primer_Apellido}
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
                  [...new Set(disponibilidad.map(d => d.fecha))].map((fecha, idx) => (
                    <option key={idx} value={fecha}>
                      {fecha}
                    </option>
                  ))
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
                loading.disponibilidad
              }
            >
              Confirmar Datos
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SolicitarCita;