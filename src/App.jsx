import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import Servicios from "./Components/servicios";
import InicioSesion from "./Components/InicioSesion";
import Registrarse from "./Components/Registrarse";

const Header = () => (
  <header className="header">
    <nav className="nav">
      <img className="lg" src="Logo.png" alt="logo" width={400} />
      <img className="im1" src="tel.png" alt="telefono" width={40} />
      <p className="titu1">
        Telefono
        <br /> 312-640-8097
      </p>
      <img className="img2" src="hor.png" alt="horario" width={40} />
      <p className="titu2">
        Horario <br /> 7:00-4:00(Lun-Vie)
      </p>
      <img className="img3" src="ubi.png" alt="Ubicacion" width={30} />
      <p className="titu3">
        Ubicación <br />
        Carrera 27 #24-19
      </p>
      {/* <href className="text1">LInk</href> */}
    </nav>
  </header>
);


const HeroSection = ({ setMostrarServicios, setMostrarInicioSesion, setMostrarRegistrarse }) => {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  return (
    <section className="hero">
      <img src="/path-to-hero-image.jpg" alt="Hero" className="hero-img" />
      <div className="overlay">
        <div className="hero-buttons">
          <button className="btn">Inicio</button>
          <button className="btn" onClick={() => setMostrarServicios(true)}>
            Servicios
          </button>
          <button className="btn">Solicitar Cita</button>
          <button className="btn" onClick={() => setMostrarInicioSesion(true)}>
            Consulta de Resultados
            </button>
        </div>

        <div 
          className="zona-transicional-container"
          onMouseEnter={() => setMostrarOpciones(true)}
          onMouseLeave={() => setMostrarOpciones(false)}
        >
          <button className="btnZona">ZONA TRANSICIONAL</button>
          {mostrarOpciones && (
            <div className="dropdown-menu">
              <button className="dropdown-btn" onClick={() => setMostrarRegistrarse(true)}>
                Registrarse
              </button>
              <button className="dropdown-btn" onClick={() => setMostrarInicioSesion(true)}>
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const BuildingSection = () => (
  <section className="building">
    <img src="foto.png" alt="foto" className="building-img" width={10} />
    <p className="textoNegrita">
      Precisión, confianza y excelencia en <br />
      cada diagnóstico
    </p>
  </section>
);

const SedeSection = () => (
  <section className="sede">
    <img src="sede.jpg" className="sede-img" width={10} />

    <div className="titleSede">
      <p>BIENVENIDOS A SCANMED</p>

      <div className="titleSede1">
        <p>SCANMED: Tecnología de vanguardia para tu bienestar.</p>
      </div>  

      <div className="titleSede2">
        <p>Ofrecemos una amplia gama de estudios de imagen y diagnósticos avanzados para apoyar la prevención y el cuidado de tu salud. Confía y date el gusto para obtener resultados confiables y precisos.</p>

        {}
        <a href="https://www.ejemplo.com" target="_blank" rel="noopener noreferrer">
          <img className="paci" src="pa.png" alt="pac" width={180} />
        </a>

        <a href="https://www.ejemplo.com" target="_blank" rel="noopener noreferrer">
          <img className="dis" src="dis.png" alt="dis" width={180} />
        </a>

        <a href="https://www.ejemplo.com" target="_blank" rel="noopener noreferrer">
          <img className="eq" src="eq.png" alt="eq" width={180} />
        </a>
      </div>

    </div>
  </section>
);


const Specialties = () => (
  <section className="specialties">
        <p className="textoEspe">
      Siempre cuidando  <br />
       nuestras especialidades
    </p>
    
    {/* Primer grupo */}
    <div className="grid">
      {["Neurología", "Biopsias", "Oncología", "Cardiología"].map((spec, index) => (
        <div key={index} className="specialty">
          <img src="especi.png" alt="Especialidad" className="especi" />
          <p>{spec}</p>
        </div>
      ))}
    </div>

    {/* Segundo grupo */}
    <div className="second-grid">
      {["Radiología", "Ortopedia", "Medicina General", "Nefrología"].map((spec, index) => (
        <div key={index + 4} className="specialty">
          <img src="especi.png" alt="Especialidad" className="especi" />
          <p>{spec}</p>
        </div>
      ))}
    </div>
  </section>
);



const Partners = () => (
  <section className="partners">
    <h3 className="section-titleE">NUESTROS CONVENIOS</h3>
    
    <div className="logos">
      <img src="convenios.png" alt="Convenios" className="Convenios" />
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer">
    <img className="LogoMar" src="LogoMar.png" alt="logoMar" width={330} />

    <p className="Contacta">
       Contactanos: </p>
    
    <img className="gps" src="gps.png" alt="cel" width={50} />
    <p className="Ubicacion2">
      Tulua, Valle del Cauca<br />
      Carrera 27 #24-19
    </p>

    <img className= "celu" src="call.png" alt="cel" width={30} />
    <p className="telefonos"> 
      312-640-8097<br />
      320-489-5544
    </p>

    <img className= "correo"src="correo.png" alt="correo" width={40} />
    <p className="correos"> 
      scanmed@gmail.com<br />
      usuarioscanmed@gmail.com
    </p>
    <p className="Redes">
    Redes Sociales: </p>

    <a href="https://www.instagram.com/laurac_20?igsh=MTRtY2Z2OXZ4NmxzYg==" target="_blank" rel="noopener noreferrer">
  <img className="insta" src="instagram.png" alt="Instagram" width={35} />
</a>
<p className="instagram">Instagram</p>


<a href="https://www.facebook.com/share/1BjXgGZs4x/" target="_blank" rel="noopener noreferrer">
  <img className="face" src="facebook.png" alt="Facebook" width={35} />
</a>
<p className="facebook">Facebook</p>


    <img className= "link" src="link.png" alt="linke"width={38} />

    <p className="lk">
    Linkedln </p>

      

  </footer>
);

const ScanmedPage = () => {
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [mostrarInicioSesion, setMostrarInicioSesion] = useState(false);
  const [mostrarRegistrarse, setMostrarRegistrarse] = useState(false);

  return (
    <div>
      {  mostrarServicios ? (
        <Servicios />
      ) : mostrarInicioSesion ? (
        <InicioSesion />
      ) : mostrarRegistrarse ? (
        <Registrarse/>
      
      ) : (
        <>
          <Header />
          <HeroSection setMostrarServicios={setMostrarServicios} setMostrarInicioSesion={setMostrarInicioSesion} setMostrarRegistrarse={setMostrarRegistrarse}/>
          <BuildingSection />
          <SedeSection />
          <Specialties />
          <Partners />
          <Footer />
        </>
      )}
    </div>
  );
};


export default ScanmedPage;