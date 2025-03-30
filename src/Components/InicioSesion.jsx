import React, { useState } from "react";
import "./InicioSesion.css";
import PerfilUsuario from "./PerfilUsuario"; 

const InicioSesion = () => {
  const [logueado, setLogueado] = useState(false); 

  const handleLogin = (e) => {
    e.preventDefault();
    setLogueado(true); 
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
                <input type="text" placeholder="Usuario-Email" className="input-field" />
              </div>
              <div className="input-group">
                <input type="password" placeholder="Contraseña" className="input-field" />
              </div>
              <button type="submit" className="btn2">ENTRAR</button>
            </form>
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
