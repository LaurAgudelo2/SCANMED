import React, { useState } from 'react'
import axios from 'axios';
import PerfilMedicos from './PerfilMedicos';
import './LoginMedicos.css';

const LoginMedicos = () => {
  const [logueado, setLogueado] = useState(false);
  const [credenciales, setCredenciales] = useState({ correo: '', contrasena: '' });
  const [error, setError] = useState('');
  const [medicoInfo, setMedicoInfo] = useState(null);

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const { data } = await axios.post("http://localhost:4000/api/login", credenciales);
  
      if (data.success && data.role === "MEDICO") {
        // Combina datos de usuario y médico
// En tu LoginMedicos.jsx, crea medicoInfo así:
        setMedicoInfo({
          medicoId: data.medico.ID_MEDICO,
          nombre: `${data.usuario.Primer_Nombre} ${data.usuario.Segundo_Nombre}`,
          ID_SERVICIO: data.medico.ID_SERVICIO,
          Numero_Licencia: data.medico.Numero_Licencia,
          // si quieres otros campos del usuario (correo, etc), también puedes agregarlos
        });

        setLogueado(true);
        localStorage.setItem("token", data.token); //  Después de setLogueado(true)
      } else {
        setError("No tienes permisos de médico");
      }
    } catch (err) {
      console.error("Error completo:", err); // 👈 Verifica el error real en consola
      setError("Error al conectar con el servidor");
    }
  };

  // Si ya está logueado, muestro perfil y paso los datos del médico
  if (logueado && medicoInfo?.medicoId) { // Usa optional chaining
    return <PerfilMedicos medicoInfo={medicoInfo} />;
  }

  return (
    <div className="login-medicos-container">
      <div className="login-medicos-left">
        <img src="medicos.png" alt="Equipo médico" className="login-medicos-image" />
        <div className="login-medicos-logo">
          <img src="Logo.png" alt="LogoMedicos" className="LogoDeMedicos" width={550} />
        </div>
      </div>

      <div className="login-medicos-right">
        <h2>BIENVENIDO A SCANMED</h2>
        <p>Ingresa tus credenciales para iniciar sesión</p>

        <form className="login-medicos-form" onSubmit={handleLogin}>
          <div className="input-group2">
            <i className="fa fa-envelope icon"></i>
            <input
              type="email"
              name="correo"
              placeholder="Usuario"
              value={credenciales.correo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group2">
            <i className="fa fa-lock icon"></i>
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={credenciales.contrasena}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">Iniciar Sesión</button>
          {error && <p style={{ color: 'red', marginLeft: '250px' }}>{error}</p>}
          <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
        </form>
      </div>
    </div>
  );
};

export default LoginMedicos;