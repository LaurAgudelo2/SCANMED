
// este componente se usa para mostrar mensajes de alerta

import React from "react";
import "./Warning.css";

const Warning = ({ message }) => {
  if (!message) return null;
  return <div className="warning">{message}</div>;
};

export default Warning;
