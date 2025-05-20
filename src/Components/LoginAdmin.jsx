import React, { useState } from "react";
import axios from "axios";
import "./LoginAdmin.css";
import PerfilAdmin from "./PerfilAdmin";
import RecuperarContraseña from "./RecuperarContraseña";

const LoginAdmin = ({ onLogin }) => {
  const [logueado, setLogueado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [mostrarRecuperar, setMostrarRecuperar] = useState(false);
  const [loading, setLoading] = useState(false); // Nuevo estado para carga

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("Intento de login con:", { correo });

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/login",
        { correo, contrasena },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Respuesta del servidor:", data);

      if (data.success && data.role === "ADMINISTRADOR") {
        localStorage.setItem("token", data.token);
        setUsuario(data.usuario);
        setLogueado(true);
        if (onLogin) onLogin(data.usuario); // Llamar a onLogin si está definido
        console.log("Login exitoso, usuario:", data.usuario);
      } else {
        setError("Credenciales inválidas o sin permisos de administrador.");
        console.warn("Rol recibido:", data.role);
      }
    } catch (err) {
      console.error("Error en login:", err);
      const errorMessage =
        err.response?.data?.message || "Error de conexión. Inténtalo de nuevo.";
      setError(errorMessage);
      console.error("Detalles del error:", err.response?.data);
    } finally {
      setLoading(false);
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
            <img src="/EDIFICIO.png" alt="edificiologin" className="edificio" />
            <div className="logoo">
              <img src="/Logo.png" alt="Logo" className="logoim" />
            </div>
          </div>

          <div className="login-box">
            <h2>BIENVENIDOS A SCANMED</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Usuario-Email"
                  className="input-field"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="input-field"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <button type="submit" className="btn2" disabled={loading}>
                {loading ? "Cargando..." : "ENTRAR"}
              </button>
            </form>
            {error && <div className="error-message">{error}</div>}
            <div className="links">
              <a
                href="#"
                className="contra"
                onClick={() => setMostrarRecuperar(true)}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginAdmin;