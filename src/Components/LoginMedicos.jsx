import React from 'react';
import './LoginMedicos.css';

const LoginMedicos = () => {
  return (
    <div className="login-medicos-container">
      <div className="login-medicos-left">
        <img
          src="medicos.png" 
          alt="Equipo médico"
          className="login-medicos-image"
        />
        <div className="login-medicos-logo">
        <img src="Logo.png" alt="LogoMedicos" className='LogoDeMedicos'width={550}/>
        </div>
      </div>

      <div className="login-medicos-right">
        <h2>BIENVENIDO A SCANMED</h2>
        <p>Ingresa tus credenciales para iniciar sesion</p>

        <form className="login-medicos-form">
          <div className="input-group2">
            <i className="fa fa-envelope icon"></i>
            <input type="email" placeholder="Usuario" required />
          </div>
          <div className="input-group2">
            <i className="fa fa-lock icon"></i>
            <input type="password" placeholder="Contraseña" required />
          </div>
          <button type="submit" className="login-button">Iniciar Sesion</button>
          <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
        </form>
      </div>
    </div>
  );
};

export default LoginMedicos;
