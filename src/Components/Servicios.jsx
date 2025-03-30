  import React from "react";
  import "./servicios.css";

  const servicios = [
    {
      titulo: "MAMOGRAFÍA DIGITAL",
      descripcion:
        "Examen de detección de cáncer de mama que utiliza imágenes en rayos X de alta resolución para identificar anomalías en el tejido mamario.",
      imagen: "mamografia.png",
    },
    {
      titulo: "BIOPSIA DE MAMA GUIADA POR ECOGRAFÍA",
      descripcion:
        "Obtención precisa de muestras de tejido mamario bajo orientación ecográfica para diagnóstico temprano de cáncer.",
      imagen: "biopsiamama.png",
    },
    {
      titulo: "RADIOGRAFÍA DIGITAL",
      descripcion:
        "Imágenes radiográficas de alta calidad mediante tecnología digital para diagnóstico preciso de diversas afecciones.",
      imagen: "radiografiadigital.png",
    },
    {
      titulo: "DENSITOMETRÍA ÓSEA",
      descripcion:
        "Examen para medir la densidad mineral ósea, crucial en la detección temprana de osteoporosis y evaluación de riesgos de fracturas.",
      imagen: "densi.png",
    },
    {
      titulo: "ECOGRAFÍA GENERAL",
      descripcion:
        "Obtención de imágenes en tiempo real de órganos y tejidos mediante ultrasonido, útil en el diagnóstico de diversas condiciones médicas.",
      imagen: "ecogeneral.png",
    },
    {
      titulo: "CONSULTA DE NEUROLOGÍA EPILEPTOLOGÍA",
      descripcion:
        "Evaluaciones y tratamiento especializado de trastornos neurológicos, incluyendo epilepsia, para mejorar la calidad de vida.",
      imagen: "consulta.png",
    },
    {
      titulo: "ELECTROENCEFALOGRAMA",
      descripcion:
        "Registro de la actividad eléctrica cerebral, útil en el diagnóstico de condiciones como epilepsia, trastornos del sueño y enfermedades neurológicas.",
      imagen: "electro.png",
    },
    {
      titulo: "TELEMETRÍA",
      descripcion:
        "Monitoreo remoto y continuo de la actividad cardíaca, útil en el diagnóstico de arritmias y otras anomalías del ritmo cardíaco.",
      imagen: "telemetria.png",
    },
    {
      titulo: "TOMOGRAFÍA MULTICORTE",
      descripcion:
        "Imágenes detalladas de estructuras del cuerpo para diagnóstico exhaustivo de enfermedades.",
      imagen: "tomografia.png",
    },
  ];

  const Footer = () => (
    <footer className="info">
      <div className="ContenedorAbajo">
        <img className="LogoF" src="LogoMar.png" alt="logoMar" width={250} />

      <p className="contactico">Contáctanos:</p>
      <img className="loc" src="gps.png" alt="Ubicación" style={{ height: "42px", width: "auto" }} />
      <p className="Ubicacion4">
          Tulua, Valle del Cauca<br />
          Carrera 27 #24-19
        </p>
        <img className="ftel" src="call.png" alt="Teléfono" style={{ height: "30px", width: "auto" }} />
        <p className="telefonos2">
          312-640-8097<br />
          320-489-5544
        </p>
        <img className="fcorreo" src="correo.png" alt="Correo" style={{ height: "35px", width: "auto" }} />
        <p className="correos2">
          scanmed@gmail.com<br />
          usuarioscanmed@gmail.com
        </p>
        <p className="Redes2">Redes Sociales:</p>
        <a href="https://www.instagram.com/laurac_20" target="_blank" rel="noopener noreferrer">
          <img className="instagram2" src="instagram.png" alt="Instagram" style={{ height: "30px", width: "auto" }} />
        </a>
        <p className="Insta3">Instagram</p>

        <a href="https://www.facebook.com/share/1BjXgGZs4x/" target="_blank" rel="noopener noreferrer">
          <img className="facebook2" src="facebook.png" alt="Facebook" style={{ height: "30px", width: "auto" }} />
        </a>
        <p className="facebook3">Facebook</p>

        <img className="linke" src="link.png" alt="LinkedIn" style={{ height: "30px", width: "auto" }} />
        <p className="linki3">LinkedIn</p>
        </div>
    </footer>
  );

  const Servicios = () => {
    return (
      <section className="servicios">
        <nav className="navbar">
          <ul>
          <li><a href="/" className="ini">Inicio</a></li>
            <li><a href="#" className="consul">Consulta de Resultados</a></li>
            <li><a href="#" className="servis">Servicios</a></li>
            <li><a href="#" className="cit">Solicitar Cita</a></li>
            <li><button className="zona">Zona Transicional</button></li>
          </ul>
        </nav>


        <div className="logo-container">
          <img src="Logo.png" alt="ScanMed Logo" className="logo" />
        </div>

       
        <div className="titu">
          <h2 className="titulo">NUESTROS SERVICIOS</h2>
        </div>

        
        <div className="contenedor-servicios">
          {servicios.map((servicio, index) => (
            <div className="servicio-card" key={index}>
              <img src={servicio.imagen} alt={servicio.titulo} />
              <h3>{servicio.titulo}</h3>
              <p>{servicio.descripcion}</p>
            </div>
          ))}
        </div>

        {/* ✅ Footer */}
        <Footer />
      </section>
    );
  };

  export default Servicios;
