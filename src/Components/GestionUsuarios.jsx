import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import "./GestionUsuarios.css";

const GestionUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [filtroRol, setFiltroRol] = useState("TODOS");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/usuarios")
      .then((res) => setUsers(res.data.data))
      .catch(console.error);
  }, []);

  const handleRoleChange = (id, newRole) => {
    axios
      .put(`http://localhost:4000/api/usuarios/${id}/role`, { role: newRole })
      .then(() => {
        setUsers((u) =>
          u.map((usr) =>
            usr.id === id ? { ...usr, role: newRole } : usr
          )
        );
      })
      .catch(console.error);
  };

  // Filtrado por rol
  const usuariosFiltrados = users.filter((u) =>
    filtroRol === "TODOS" ? true : u.role === filtroRol
  );

    const exportarCSV = () => {
    const csv = Papa.unparse(usuariosFiltrados);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "usuarios.csv");
  };

  return (
    <div className="users-mgmt">
      <h2>Gestión de Usuarios</h2>

      <div className="filtro-rol">
        <label>Filtrar por rol: </label>
        <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
          <option value="TODOS">Todos</option>
          <option value="ADMINISTRADOR">Administrador</option>
          <option value="RECEPCIONISTA">Recepcionista</option>
          <option value="MEDICO">Médico</option>
          <option value="PACIENTE">Paciente</option>
        </select>
        <button onClick={exportarCSV} style={{ marginLeft: "1rem" }}>
          Exportar CSV
        </button>

      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Identificación</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.identificacion}</td>
              <td>{u.email}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                >
                  <option value="ADMINISTRADOR">Administrador</option>
                  <option value="RECEPCIONISTA">Recepcionista</option>
                  <option value="MEDICO">Médico</option>
                  <option value="PACIENTE">Paciente</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionUsuarios;
