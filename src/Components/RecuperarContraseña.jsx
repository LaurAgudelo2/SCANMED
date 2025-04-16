import React, { useState } from "react";
import "./InicioSesion.css";  // Corregido .ccs a .css
import PerfilUsuario from "./PerfilUsuario";  // Corregida la ruta

const InicioSesion = () => {
    const [logueado, setLogueado] = useState(false);
    const [mostrarRecuperar, setMostrarRecuperar] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLogueado(true);
    };

    const handleRecuperar = (e) => {
        e.preventDefault();
        alert("Se ha enviado un enlace de recuperación a tu correo electrónico.");
    };

    return ( // Ahora el return está dentro de la función
        <div>
            {logueado ? (
                <PerfilUsuario />
            ) : (
                <div className="container">
                    <div className="left-section">
                        <img src="/EDIFICIO.png" alt="edificiologin" className="edificio" />
                        <div className="logoo">
                            <img src="/logo.png" alt="logo" className="logoim" />
                        </div>
                    </div>

                    <div className="login-box">
                        {mostrarRecuperar ? (
                            <div>
                                <h2>Recuperar Contraseña</h2>
                                <form onSubmit={handleRecuperar}>
                                    <div className="input-group">
                                        <input type="email" placeholder="Ingrese su correo" className="input-field" required />
                                    </div>
                                    <button type="submit" className="btn2">Enviar enlace</button>
                                </form>
                                <button className="btn2" onClick={() => setMostrarRecuperar(false)}>
                                    Volver
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h2>BIENVENIDOS A SCANMED</h2>
                                <form onSubmit={handleLogin}>
                                    <div className="input-group">
                                        <input type="text" placeholder="Usuario-Email" className="input-field" />
                                    </div>
                                    <div className="input-group"> {/* Corregido el error de typo */}
                                        <input type="password" placeholder="Contraseña" className="input-field" />
                                    </div>
                                    <button type="submit" className="btn2">Entrar</button> {/* Corregido "sumbit" */}
                                </form>
                                <div className="links">
                                    <a href="#" className="registro"></a>
                                    <a href="#" className="contra" onClick={() => setMostrarRecuperar(true)}>
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InicioSesion;
