import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GestionUsuarios.css";

const GestionUsuarios = () => {
  const [users, setUsers] = useState([]);

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

  return (
    <div className="users-mgmt">
      <h2>Gestión de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
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
