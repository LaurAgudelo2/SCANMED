
import React, { useState } from "react";
import axios from "axios";
import "./LoginAdmin.css";

import PerfilAdmin from "./PerfilAdmin"
import RecuperarContraseña from "./RecuperarContraseña";

const LoginAdmin = ({ onLogin }) => {
  const [logueado, setLogueado] = useState(false);
  const [usuario, setUsuario] = useState(null);  // Nuevo estado para almacenar los datos del usuario
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
    const [mostrarRecuperar, setMostrarRecuperar] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/login",
        { correo, contrasena }
      );
      if (data.success && data.role === "ADMINISTRADOR") {
        localStorage.setItem("token", data.token);
        setLogueado(true);
        setUsuario(response.data.usuario);  // Almacena los datos del usuario
        setUsuarioLogueado(response.data.usuario);
      } else {
        setError("Credenciales inválidas o sin permisos de administrador.");
      }
    } catch (err) {
      console.log(err)
      setError(
        err.response?.data?.message || "Error de conexión. Inténtalo de nuevo."
      );
    }
  };

  return (
    <div>
      {logueado ? (
        <PerfilAdmin usuario={usuario} />  
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

export default LoginAdmin;
