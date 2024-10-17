import React, { useState } from 'react';

const FormularioAlquiler = ({ vehiculo, handleRenta }) => {
  const [numeroLicencia, setNumeroLicencia] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fechaAlquiler, setFechaAlquiler] = useState('');
  const [fechaDevolucion, setFechaDevolucion] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const datosAlquiler = {
      numeroLicencia,
      ubicacion,
      fechaAlquiler,
      fechaDevolucion,
    };
    handleRenta(datosAlquiler);
  };

  return (
    <div className="formulario-container">
      <h2 className='title'>Formulario de Alquiler de Vehículo</h2>
      <form onSubmit={handleSubmit} className="formulario-alquiler">
        <div className="form-group">
          <label htmlFor="numeroLicencia">Número de Licencia:</label>
          <input
            type="text"
            id="numeroLicencia"
            value={numeroLicencia}
            onChange={(event) => setNumeroLicencia(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ubicacion">Ubicación:</label>
          <input
            type="text"
            id="ubicacion"
            value={ubicacion}
            onChange={(event) => setUbicacion(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fechaAlquiler">Fecha de Alquiler:</label>
          <input
            type="date"
            id="fechaAlquiler"
            value={fechaAlquiler}
            onChange={(event) => setFechaAlquiler(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fechaDevolucion">Fecha de Devolución:</label>
          <input
            type="date"
            id="fechaDevolucion"
            value={fechaDevolucion}
            onChange={(event) => setFechaDevolucion(event.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Rentar Vehículo</button>
      </form>
    </div>
  );
};

export default FormularioAlquiler;
