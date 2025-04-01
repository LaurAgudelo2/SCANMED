import React, { useState, useEffect } from "react";
import axios from "axios";
import "./registrarse.css";

const Registrarse = () => {
  const [formData, setFormData] = useState({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    edad: "",
    fechaNacimiento: "",
    tipoDocumento: "",
    numeroDocumento: "",
    pais: "1",
    departamento: "",
    ciudad: "",
    direccion: "",
    telefono: "",
    correo: "",
    contrasena: ""
  });

  const [documentos, setDocumentos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState({
    documentos: true,
    departamentos: false,
    ciudades: false,
    registro: false
  });
  const [registrationError, setRegistrationError] = useState({
    message: '',
    isUserExists: false
  });
  const [successMessage, setSuccessMessage] = useState(null);

  // Cargar tipos de documento al montar el componente
  useEffect(() => {
    const cargarDocumentos = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/documentos");
        if (data.success) {
          setDocumentos(data.data);
        } else {
          setRegistrationError({
            message: data.message || "Error al cargar documentos",
            isUserExists: false
          });
        }
      } catch (err) {
        setRegistrationError({
          message: err.response?.data?.message || "Error al conectar con el servidor",
          isUserExists: false
        });
        console.error("Error cargando documentos:", err);
      } finally {
        setLoading(prev => ({ ...prev, documentos: false }));
      }
    };

    cargarDocumentos();
  }, []);

  // Cargar departamentos cuando cambia el país
  useEffect(() => {
    const cargarDepartamentos = async () => {
      if (formData.pais) {
        setLoading(prev => ({ ...prev, departamentos: true }));
        setRegistrationError({ message: '', isUserExists: false });
        
        try {
          const { data } = await axios.get(
            `http://localhost:4000/api/departamentos/${formData.pais}`
          );
          
          if (data.success) {
            setDepartamentos(data.data);
            setCiudades([]);
            setFormData(prev => ({ 
              ...prev, 
              departamento: "", 
              ciudad: "" 
            }));
          } else {
            setRegistrationError({
              message: data.message || "Error al cargar departamentos",
              isUserExists: false
            });
          }
        } catch (err) {
          setRegistrationError({
            message: err.response?.data?.message || "Error al cargar departamentos",
            isUserExists: false
          });
          console.error("Error cargando departamentos:", err);
        } finally {
          setLoading(prev => ({ ...prev, departamentos: false }));
        }
      }
    };

    cargarDepartamentos();
  }, [formData.pais]);

  // Cargar ciudades cuando cambia el departamento
  useEffect(() => {
    const cargarCiudades = async () => {
      if (formData.departamento) {
        setLoading(prev => ({ ...prev, ciudades: true }));
        setRegistrationError({ message: '', isUserExists: false });
        
        try {
          const { data } = await axios.get(
            `http://localhost:4000/api/ciudades/${formData.departamento}`
          );
          
          if (data.success) {
            setCiudades(data.data);
            setFormData(prev => ({ ...prev, ciudad: "" }));
          } else {
            setRegistrationError({
              message: data.message || "Error al cargar ciudades",
              isUserExists: false
            });
          }
        } catch (err) {
          setRegistrationError({
            message: err.response?.data?.message || "Error al cargar ciudades",
            isUserExists: false
          });
          console.error("Error cargando ciudades:", err);
        } finally {
          setLoading(prev => ({ ...prev, ciudades: false }));
        }
      }
    };

    cargarCiudades();
  }, [formData.departamento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, registro: true }));
    setRegistrationError({ message: '', isUserExists: false });
    setSuccessMessage(null);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/registro",
        {
          primer_nombre: formData.primerNombre,
          segundo_nombre: formData.segundoNombre,
          primer_apellido: formData.primerApellido,
          segundo_apellido: formData.segundoApellido,
          edad: formData.edad || null,
          fecha_nacimiento: formData.fechaNacimiento || null,
          tipo_documento: formData.tipoDocumento,
          numero_documento: formData.numeroDocumento,
          id_ciudad: formData.ciudad,
          direccion: formData.direccion || null,
          telefono: formData.telefono || null,
          correo: formData.correo,
          contrasena: formData.contrasena
        }
      );

      if (data.success) {
        setSuccessMessage("¡Registro exitoso! Por favor inicia sesión.");
        setFormData({
          primerNombre: "",
          segundoNombre: "",
          primerApellido: "",
          segundoApellido: "",
          edad: "",
          fechaNacimiento: "",
          tipoDocumento: "",
          numeroDocumento: "",
          pais: "1",
          departamento: "",
          ciudad: "",
          direccion: "",
          telefono: "",
          correo: "",
          contrasena: ""
        });
      } else {
        setRegistrationError({
          message: data.message || "Error en el registro",
          isUserExists: data.userExists || false
        });
      }
    } catch (err) {
      const errorData = err.response?.data;
      setRegistrationError({
        message: errorData?.message || "Error al registrar. Por favor intenta nuevamente.",
        isUserExists: errorData?.userExists || false
      });
      console.error("Error en el registro:", err);
    } finally {
      setLoading(prev => ({ ...prev, registro: false }));
    }
  };

  const RegistrationError = ({ error, onClose, onReturnHome }) => {
    if (!error.message) return null;

    return (
      <div className="registration-error">
        <div className="error-content">
          <p>{error.message}</p>
          {error.isUserExists && (
            <button 
              onClick={onReturnHome}
              className="return-home-button"
            >
              Volver al Menú Principal
            </button>
          )}
        </div>
        <button onClick={onClose} className="close-error-button">×</button>
      </div>
    );
  };

  return (
    <div className="registro-container">
      <h2>REGISTRATE</h2>
      <img src="Logo.png" alt="logo" className="LogoR" />
      
      <RegistrationError 
        error={registrationError}
        onClose={() => setRegistrationError({ message: '', isUserExists: false })}
        onReturnHome={() => {
          // Aquí puedes usar navigate si estás usando react-router
          // navigate('/');
          window.location.href = '/'; // O redirige como prefieras
        }}
      />
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
          <button onClick={() => setSuccessMessage(null)}>×</button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="registro-form">
        <input
          type="text"
          name="primerNombre"
          placeholder="Primer Nombre *"
          value={formData.primerNombre}
          onChange={handleChange}
          required
        />
        
        <input
          type="text"
          name="segundoNombre"
          placeholder="Segundo Nombre"
          value={formData.segundoNombre}
          onChange={handleChange}
        />
        
        <input
          type="text"
          name="primerApellido"
          placeholder="Primer Apellido *"
          value={formData.primerApellido}
          onChange={handleChange}
          required
        />
        
        <input
          type="text"
          name="segundoApellido"
          placeholder="Segundo Apellido"
          value={formData.segundoApellido}
          onChange={handleChange}
        />
        
        <input
          type="number"
          name="edad"
          placeholder="Edad"
          value={formData.edad}
          onChange={handleChange}
          min="1"
          max="120"
        />
        
        <input
          type="date"
          name="fechaNacimiento"
          placeholder="Fecha de Nacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
        />
        
        <select
          name="tipoDocumento"
          value={formData.tipoDocumento}
          onChange={handleChange}
          required
          disabled={loading.documentos}
        >
          <option value="">{loading.documentos ? "Cargando..." : "Seleccionar Tipo de Documento *"}</option>
          {documentos.map(doc => (
            <option key={doc.ID_DOCUMENTOIDENTIDAD} value={doc.ID_DOCUMENTOIDENTIDAD}>
              {doc.Tipo_Documento}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          name="numeroDocumento"
          placeholder="Número de Documento *"
          value={formData.numeroDocumento}
          onChange={handleChange}
          required
        />
        
        <select
          name="departamento"
          value={formData.departamento}
          onChange={handleChange}
          required
          disabled={loading.departamentos || !formData.pais}
        >
          <option value="">{loading.departamentos ? "Cargando..." : "Seleccionar Departamento *"}</option>
          {departamentos.map(depto => (
            <option key={depto.ID_DEPARTAMENTO} value={depto.ID_DEPARTAMENTO}>
              {depto.Nombre}
            </option>
          ))}
        </select>
        
        <select
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          required
          disabled={loading.ciudades || !formData.departamento}
        >
          <option value="">{loading.ciudades ? "Cargando..." : "Seleccionar Ciudad *"}</option>
          {ciudades.map(ciudad => (
            <option key={ciudad.ID_CIUDAD} value={ciudad.ID_CIUDAD}>
              {ciudad.Nombre}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
        />
        
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
        />
        
        <input
          type="email"
          name="correo"
          placeholder="Correo Electrónico *"
          value={formData.correo}
          onChange={handleChange}
          required
        />
        
        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña *"
          value={formData.contrasena}
          onChange={handleChange}
          minLength="6"
          required
        />
        
        <button 
          type="submit" 
          disabled={loading.registro}
          className={loading.registro ? "loading" : ""}
        >
          {loading.registro ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
};

export default Registrarse;