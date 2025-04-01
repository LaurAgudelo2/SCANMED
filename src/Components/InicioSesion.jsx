import React, { useState } from "react";
import "./InicioSesion.css";
import PerfilUsuario from "./PerfilUsuario"; 
import axios from "axios"; // Asegúrate de tener axios instalado

const InicioSesion = () => {
  const [logueado, setLogueado] = useState(false); 
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reiniciar el mensaje de error

    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        correo,
        contrasena,
      });

      if (response.data.success) {
        setLogueado(true); // Cambiar el estado a logueado
      }
    } catch (err) {
      if (err.response) {
        // Si hay una respuesta del servidor
        setError(err.response.data.message);
      } else {
        setError("Error en el servidor. Inténtalo de nuevo más tarde.");
      }
    }
  };

  return (
    <div>
      {logueado ? ( 
        <PerfilUsuario /> 
      ) : (
        <div className="container">
          <div className="left-section">
            <img src="/EDIFICIO.png" alt="edificiologin" className="edificio"/>
            <div className="logoo"> 
              <img src="/Logo.png" alt="Logo" className="logoim" />
            </div>
          </div>

          <div className="login-box">
            <h2>BIENVENIDOS A SCANMED</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Usuario-Email" 
                  className="input-field" 
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)} // Actualizar el estado del correo
                />
              </div>
              <div className="input-group">
                <input 
                  type="password" 
                  placeholder="Contraseña" 
                  className="input-field" 
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)} // Actualizar el estado de la contraseña
                />
              </div>
              <button type="submit" className="btn2">ENTRAR</button>
            </form>
            {error && <div className="error-message">{error}</div>} {/* Mostrar mensaje de error */}
            <div className="links">
              <a href="#" className="registro"></a> 
              <a href="#" className="contra">¿Olvidaste tu contraseña?</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InicioSesion;