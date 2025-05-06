import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import "./SubirResultado.css";

const SubirResultado = () => {
  const [formData, setFormData] = useState({
    ID_PACIENTE: "",
    ID_CITA: "",
    Descripcion: "",
    documento: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      documento: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones iniciales
    if (!formData.documento) {
      Swal.fire("Error", "Debes seleccionar un archivo PDF", "error");
      return;
    }
    if (!formData.ID_PACIENTE) {
      Swal.fire("Error", "El ID de paciente es requerido", "error");
      return;
    }

    try {
      // Mostrar confirmación
      const confirmation = await Swal.fire({
        title: "Confirmar Subida de Resultado",
        html: `
          <div style="text-align: left;">
            <p><strong>ID Paciente:</strong> ${formData.ID_PACIENTE}</p>
            ${formData.ID_CITA ? `<p><strong>ID Cita:</strong> ${formData.ID_CITA}</p>` : ""}
            <p><strong>Descripción:</strong> ${formData.Descripcion}</p>
            <p><strong>Archivo:</strong> ${formData.documento.name}</p>
          </div>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmar Subida",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33"
      });

      if (!confirmation.isConfirmed) return;

      // Mostrar carga durante la subida
      Swal.fire({
        title: "Subiendo archivo",
        html: "Por favor espere...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      // Subir archivo

        const fileFormData = new FormData();
        fileFormData.append('documento', formData.documento);
    
    
        // Intenta primero solo subir el archivo
        const uploadResponse = await axios.post(
          'http://localhost:4000/api/upload-resultado',
          fileFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          }
        );



      // Luego guardar los datos en la base de datos
      const resultadoData = {
        ID_PACIENTE: formData.ID_PACIENTE,
        ID_CITA: formData.ID_CITA || null,
        Descripcion: formData.Descripcion,
        Documento_Examen: uploadResponse.data.filePath
      };

    
      await axios.post('http://localhost:4000/api/resultados', resultadoData);

      Swal.fire({
        title: "¡Éxito!",
        html: `
          <div style="text-align: left;">
            <p><strong>Resultado subido correctamente</strong></p>
            <p>ID Paciente: ${formData.ID_PACIENTE}</p>
            <p>Archivo: ${formData.documento.name}</p>
            <p>Tamaño: ${(formData.documento.size / 1024).toFixed(2)} KB</p>
          </div>
        `,

        icon: "success",
        confirmButtonText: "Aceptar"
      });

      setFormData({
        ID_PACIENTE: "",
        ID_CITA: "",
        Descripcion: "",
        documento: null
      });
      setUploadProgress(0);
    } catch (error) {
      console.error("Error completo:", error);
      let errorMessage = "Error al subir el resultado";
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Error del servidor: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No se recibió respuesta del servidor";
      } else {
        errorMessage = error.message;
      }

      Swal.close();


      Swal.fire({
        title: "Error",
        html: `<div style="text-align: left;">${errorMessage}</div>`,
        icon: "error"
      });

    }
  };

  return (
    <div className="subir-resultado-container">
      <h2>Subir Resultado de Examen</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ID Paciente:</label>
          <input
            type="text"
            name="ID_PACIENTE"
            value={formData.ID_PACIENTE}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>ID Cita (opcional):</label>
          <input
            type="text"
            name="ID_CITA"
            value={formData.ID_CITA}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="Descripcion"
            value={formData.Descripcion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Documento PDF:</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="progress-bar">
            <div style={{ width: `${uploadProgress}%` }}>{uploadProgress}%</div>
          </div>
        )}
        <button type="submit" className="submit-btn">
          Subir Resultado
        </button>
      </form>
    </div>
  );
};

export default SubirResultado;