import React, { useState } from 'react';

const DetallesAlquiler = ({ onDetallesCompletados }) => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onDetallesCompletados({ fechaInicio, fechaFin });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Fecha de Inicio:
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
      </label>
      <label>
        Fecha de Fin:
        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
      </label>
      <button type="submit">Guardar Detalles</button>
    </form>
  );
};

export default DetallesAlquiler;
