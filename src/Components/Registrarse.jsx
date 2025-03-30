import React, { useState } from "react";
import "./registrarse.css";

const Registrarse = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  const handlePaisChange = (e) => {
    const pais = e.target.value;
    if (pais === "Colombia") {
      setDepartamentos(["Antioquia", "Cundinamarca", "Valle del Cauca"]);
      setCiudades([]);
    } else {
      setDepartamentos([]);
      setCiudades([]);
    }
  };

  const handleDepartamentoChange = (e) => {
    const depto = e.target.value;
    if (depto === "Antioquia") {
      setCiudades(["Medellín", "Envigado", "Itagüí"]);
    } else if (depto === "Cundinamarca") {
      setCiudades(["Bogotá", "Soacha", "Zipaquirá"]);
    } else {
      setCiudades([]);
    }
  };

  return (
    <div className="registro-container">
      <h2>REGISTRATE</h2> <img src="Logo.png" alt="logore" className="LogoR"/>
      <form className="registro-form">
        <input type="text" placeholder="Primer Nombre" />
        <input type="text" placeholder="Segundo Nombre" />
        <input type="text" placeholder="Primer Apellido" />
        <input type="text" placeholder="Segundo Apellido" />
        <input type="number" placeholder="Edad" />
        <input type="date" placeholder="Fecha de Nacimiento" />
        <select>
          <option>Seleccionar Tipo de Documento</option>
          <option>Cédula de Ciudadanía</option>
          <option>Cédula de Extranjería</option>
          <option>Pasaporte</option>
        </select>
        <input type="text" placeholder="Número de Identificación" />
        <select onChange={handlePaisChange}>
          <option>Seleccionar País</option>
          <option>Colombia</option>
          <option>Argentina</option>
          <option>Chile</option>
        </select>
        <select onChange={handleDepartamentoChange}>
          <option>Seleccionar Departamento</option>
          {departamentos.map((depto, index) => (
            <option key={index}>{depto}</option>
          ))}
        </select>
        <select>
          <option>Seleccionar Ciudad</option>
          {ciudades.map((ciudad, index) => (
            <option key={index}>{ciudad}</option>
          ))}
        </select>
        <input type="text" placeholder="Dirección" />
        <input type="tel" placeholder="Teléfono" />
        <input type="email" placeholder="Correo" />
        <input type="password" placeholder="Contraseña" />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Registrarse;