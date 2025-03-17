import React from "react";
import "./Servicios.css";

const servicios = [
  {
    titulo: "MAMOGRAFÍA DIGITAL",
    descripcion:
      "Examen de detección de cáncer de mama que utiliza imágenes en rayos X de alta resolución para identificar anomalías en el tejido mamario.",
    imagen: "/images/mamografia.jpg",
  },
  {
    titulo: "BIOPSIA DE MAMA GUIADA POR ECOGRAFÍA",
    descripcion:
      "Obtención precisa de muestras de tejido mamario bajo orientación ecográfica para diagnóstico temprano de cáncer.",
    imagen: "/images/biopsia.jpg",
  },
  {
    titulo: "RADIOGRAFÍA DIGITAL",
    descripcion:
      "Imágenes radiográficas de alta calidad mediante tecnología digital para diagnóstico preciso de diversas afecciones.",
    imagen: "/images/radiografia.jpg",
  },
  {
    titulo: "DENSITOMETRÍA ÓSEA",
    descripcion:
      "Examen para medir la densidad mineral ósea, crucial en la detección temprana de osteoporosis y evaluación de riesgos de fracturas.",
    imagen: "/images/densitometria.jpg",
  },
  {
    titulo: "ECOGRAFÍA GENERAL",
    descripcion:
      "Obtención de imágenes en tiempo real de órganos y tejidos mediante ultrasonido, útil en el diagnóstico de diversas condiciones médicas.",
    imagen: "/images/ecografia.jpg",
  },
  {
    titulo: "CONSULTA DE NEUROLOGÍA EPILEPTOLOGÍA",
    descripcion:
      "Evaluaciones y tratamiento especializado de trastornos neurológicos, incluyendo epilepsia, para mejorar la calidad de vida.",
    imagen: "/images/neurologia.jpg",
  },
  {
    titulo: "ELECTROENCEFALOGRAMA",
    descripcion:
      "Registro de la actividad eléctrica cerebral, útil en el diagnóstico de condiciones como epilepsia, trastornos del sueño y enfermedades neurológicas.",
    imagen: "/images/eeg.jpg",
  },
  {
    titulo: "TELEMETRÍA",
    descripcion:
      "Monitoreo remoto y continuo de la actividad cardíaca, útil en el diagnóstico de arritmias y otras anomalías del ritmo cardíaco.",
    imagen: "/images/telemetria.jpg",
  },
  {
    titulo: "TOMOGRAFÍA MULTICORTE",
    descripcion:
      "Imágenes detalladas de estructuras del cuerpo para diagnóstico exhaustivo de enfermedades.",
    imagen: "/images/tomografia.jpg",
  },
];

const Servicios = () => {
  return (
    <section className="servicios">
      <h2 className="titulo">NUESTROS SERVICIOS</h2>
      <div className="contenedor-servicios">
        {servicios.map((servicio, index) => (
          <div className="servicio-card" key={index}>
            <img src={servicio.imagen} alt={servicio.titulo} />
            <h3>{servicio.titulo}</h3>
            <p>{servicio.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Servicios;

