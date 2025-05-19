import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManejoCitas.css";

const ManejoCitas = () => {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/citas")
      .then((res) => setCitas(res.data.data))
      .catch(console.error);
  }, []);

  const handleEstadoChange = (id, newEstado) => {
    axios
      .put(`http://localhost:4000/api/citas/${id}/estado`, { estado: newEstado })
      .then(() => {
        setCitas((list) =>
          list.map((c) =>
            c.id === id ? { ...c, estado: newEstado } : c
          )
        );
      })
      .catch(console.error);
  };

  return (
    <div className="citas-mgmt">
      <h2>Gestión de Citas</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.pacienteNombre}</td>
              <td>{new Date(c.fecha).toLocaleString()}</td>
              <td>
                <select
                  value={c.estado}
                  onChange={(e) => handleEstadoChange(c.id, e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="Realizada">Realizada</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManejoCitas;
