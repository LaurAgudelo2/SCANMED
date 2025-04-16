import React, { useState } from 'react';
import axios from 'axios';
import PerfilMedicos from './PerfilMedicos';
import './LoginMedicos.css';

const LoginMedicos = () => {
  const [logueado, setLogueado] = useState(false);
  const [credenciales, setCredenciales] = useState({ correo: '', contrasena: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/api/login', credenciales);
      const { success, rol } = response.data;

      if (success && rol === 'MEDICO') {
        setLogueado(true);
      } else {
        setError("No tienes acceso como médico.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión.");
    }
  };

  if (logueado) {
    return <PerfilMedicos />;
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
