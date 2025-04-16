import { useState } from "react";
import "./solicitarCita.css";

const SolicitarCita = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    examen: "",
    fecha: ""
  });

  const examenes = [
    "Mamografía Digital",
    "Biopsia de Mama Guiada por Ecografía",
    "Radiografía Digital",
    "Densitometría Ósea",
    "Ecografía General",
    "Ecografía Doppler",
    "Tomografía Multicorte",
    "Electroencefalograma",
    "Telemetría"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reserva realizada:", formData);
  };

  return (
    <div className="conte">
      <header className="header4">
        <div className="logo"></div> <img src="LogoSinF.png" className="LogoSF" alt="" /> 
        <nav className="nav">
          <a href="#">INICIO</a>
          <a href="#">NOSOTROS</a>
          <a href="#">CONTACTOS</a>
          <a href="#">AYUDA</a>
        </nav>
        <div className="perfil2">
          <a href="#">MI PERFIL</a>
          <img src="user.png" alt="Perfil" className="user" width={50} />
        </div>
      </header>

      <div className="solicitar-cita-container">
        <h2>DATOS DE LA RESERVA DE CITA</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre del paciente" value={formData.nombre} onChange={handleChange} required />
          <input type="text" name="apellidos" placeholder="Apellidos" value={formData.apellidos} onChange={handleChange} required />
          <input type="email" name="correo" placeholder="Correo" value={formData.correo} onChange={handleChange} required />
          
          <select name="examen" value={formData.examen} onChange={handleChange} required>
            <option value="">Seleccione un examen</option>
            {examenes.map((examen, index) => (
              <option key={index} value={examen}>{examen}</option>
            ))}
          </select>
          
          <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
          <button type="submit">Realizar reserva</button>
        </form>
      </div>
    </div>
  );
};

export default SolicitarCita;
