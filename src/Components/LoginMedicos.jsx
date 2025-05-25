import React, { useState } from 'react';
import axios from 'axios';
import PerfilMedicos from './PerfilMedicos';
import './LoginMedicos.css';

const LoginMedicos = () => {
  const [logueado, setLogueado] = useState(false);
  const [credenciales, setCredenciales] = useState({ correo: '', contrasena: '' });
  const [error, setError] = useState('');
  const [medicoInfo, setMedicoInfo] = useState(null);
  const [loading, setLoading] = useState(false); // Nuevo estado para mostrar carga

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    setError(''); // Limpiar error al cambiar credenciales
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Mostrar estado de carga
    console.log('Intentando iniciar sesión con:', credenciales);

    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/login',
        credenciales,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Respuesta del servidor:', data);

      if (data.success && data.role === 'MEDICO') {
        const medicoData = {
          medicoId: data.medico.medicoId, // Ajustado a la respuesta del backend
          nombre: `${data.usuario.Primer_Nombre} ${data.usuario.Segundo_Nombre || ''} ${data.usuario.Primer_Apellido}`,
          ID_SERVICIO: data.medico.servicioId, // Ajustado a la respuesta del backend
          Numero_Licencia: data.medico.Numero_Licencia || 'N/A',
        };
        setMedicoInfo(medicoData);
        setLogueado(true);
        localStorage.setItem('token', data.token);
        console.log('Login exitoso, medicoInfo:', medicoData);
      } else {
        setError('No tienes permisos de médico');
        console.warn('Rol recibido:', data.role);
      }
    } catch (err) {
      console.error('Error en login:', err);
      const errorMessage =
        err.response?.data?.message ||
        'Error al conectar con el servidor. Por favor, intenta de nuevo.';
      setError(errorMessage);
      console.error('Detalles del error:', err.response?.data);
    } finally {
      setLoading(false); // Finalizar estado de carga
    }
  };

  if (logueado && medicoInfo?.medicoId) {
    console.log('Renderizando PerfilMedicos con:', medicoInfo);
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
          {error && (
            <p style={{ color: 'red', marginLeft: '250px', marginTop: '10px' }}>
              {error}
            </p>
          )}
          <a href="#" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
        </form>
      </div>
    </div>
  );
};

export default LoginMedicos;