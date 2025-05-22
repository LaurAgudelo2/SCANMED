import React, { useState } from "react";
import "./InicioSesion.css";
import PerfilUsuario from "./PerfilUsuario"; 
import RecuperarContraseña from "./RecuperarContraseña"; // Importamos el nuevo componente
import axios from "axios";


const InicioSesion = ({ setUsuarioLogueado }) => {
  const [logueado, setLogueado] = useState(false);
  const [usuario, setUsuario] = useState(null);  // Nuevo estado para almacenar los datos del usuario
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [mostrarRecuperar, setMostrarRecuperar] = useState(false); // Estado para mostrar RecuperarContraseña

  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        correo,
        contrasena,
      });

      if (response.data.success) {
        
        localStorage.setItem('token', response.data.token);  // Asegúrate de que 'token' sea lo que tu backend envíe como respuesta

        setLogueado(true);
        setUsuario(response.data.usuario);  // Almacena los datos del usuario
        setUsuarioLogueado(response.data.usuario);

      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Error en el servidor. Inténtalo de nuevo más tarde.");
      }
    }
  };

  return (
    <div>
      {logueado ? (
        <PerfilUsuario usuario={usuario} />  
      ) : mostrarRecuperar ? (
        <RecuperarContraseña onClose={() => setMostrarRecuperar(false)} /> 
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
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className="input-group">
                <input 
                  type="password" 
                  placeholder="Contraseña" 
                  className="input-field" 
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
              </div>
              <button type="submit" className="btn2">ENTRAR</button>
            </form>
            {error && <div className="error-message">{error}</div>}
            <div className="links">
              <a href="#" className="registro"></a> 
              <a href="#" className="contra" onClick={() => setMostrarRecuperar(true)}>¿Olvidaste tu contraseña?</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InicioSesion;