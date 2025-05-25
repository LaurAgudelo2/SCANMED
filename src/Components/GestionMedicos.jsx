import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GestionMedicos.css";


const GestionMedicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [filtroEspecialidad, setFiltroEspecialidad] = useState("");

  // Cargar especialidades
useEffect(() => {
  axios.get("http://localhost:4000/api/servicios")
    .then(res => {
      if (res.data.success) {
        setEspecialidades(res.data.data); // [{ id, nombre, precio }]
      }
    })
    .catch(err => console.error("Error al obtener especialidades:", err));
}, []);


  // Cargar médicos (con filtro si aplica)
useEffect(() => {
  const url = filtroEspecialidad
    ? `http://localhost:4000/api/medicos/servicio/${filtroEspecialidad}`
    : "http://localhost:4000/api/medicos";

  axios
    .get(url)
    .then((res) => {
      if (res.data.success) {
        setMedicos(res.data.data || []);
      }
    })
    .catch((err) => {
      console.error("Error al obtener médicos:", err);
    });
}, [filtroEspecialidad]);


  return (
    <div className="gestion-medicos">
      <h2>Gestión de Médicos</h2>

      <div className="filtro-especialidad">
        <label htmlFor="filtro">Filtrar por especialidad: </label>
<select
  value={filtroEspecialidad}
  onChange={(e) => setFiltroEspecialidad(Number(e.target.value))}
>
  <option value="">Todas</option>
  {especialidades.map((esp) => (
    <option key={esp.id} value={esp.id}>{esp.nombre}</option>
  ))}
</select>


      </div>

<table>
  <thead>
    <tr>
      <th>ID Médico</th>
      <th>Nombre Completo</th>
      <th>Especialidad</th>
    </tr>
  </thead>
  <tbody>
  {medicos.length === 0 ? (
    <tr>
      <td colSpan="4">No hay médicos para esta especialidad.</td>
    </tr>
  ) : (
    medicos.map(m => {
  const nombreCompleto = `${m.Primer_Nombre || ""} ${m.Segundo_Nombre || ""} ${m.Primer_Apellido || ""} ${m.Segundo_Apellido || ""}`.trim();
  return (
    <tr key={m.ID_MEDICO}>
      <td>{m.ID_MEDICO}</td>
      <td>{nombreCompleto || "No especificado"}</td>
      <td>{m.Servicios || "No especificado"}</td>
    </tr>
  );
})

  )}
</tbody>

</table>

    </div>
  );
};

export default GestionMedicos;
