import React, { useState, useEffect } from 'react';
import './formularioAlquiler.css';
import { useNavigate } from 'react-router-dom';

const FormularioAlquiler = ({ vehiculo, handleRenta }) => {
  const navigate = useNavigate();
  const [numeroLicencia, setNumeroLicencia] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fechaAlquiler, setFechaAlquiler] = useState('');
  const [fechaDevolucion, setFechaDevolucion] = useState('');
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(vehiculo || '');
  const [precio, setPrecio] = useState(vehiculo ? vehiculo.precio : 0);
  const [costoTotal, setCostoTotal] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehiculo) {
      setVehiculoSeleccionado(vehiculo);
      setPrecio(vehiculo.precio);
    }
  }, [vehiculo]);

  const calcularDias = (fechaInicio, fechaFin) => {
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
    const diferenciaTiempo = fechaFinObj.getTime() - fechaInicioObj.getTime();
    const dias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
    return dias;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const diaActual = new Date();
    diaActual.setHours(0, 0, 0, 0);
    const fechaInicioObj = new Date(fechaAlquiler);
    fechaInicioObj.setHours(0, 0, 0, 0);

    const fechaFinObj = new Date(fechaDevolucion);

    
    if (fechaInicioObj < diaActual) {
      setError('La fecha del alquiler no puede ser anterior a la fecha actual');
      return;
    }

    
    if (fechaFinObj < fechaInicioObj) {
      setError('La fecha de devolución no puede ser anterior a la fecha de alquiler');
      return;
    }

    setError('');
    const dias = calcularDias(fechaAlquiler, fechaDevolucion);
    const costo = dias * precio;
    setCostoTotal(costo); 

    const datosAlquiler = {
      numeroLicencia,
      ubicacion,
      fechaAlquiler,
      fechaDevolucion,
      vehiculo: vehiculoSeleccionado,
      precio,
      costoTotal: costo,
    };

    handleRenta(datosAlquiler);
    navigate('/generar-factura', { state: { datosAlquiler } });
  };

  return (
    <div className="formulario-container">
      <h2 className='title'>Formulario de Alquiler de Vehículo</h2>
      <form onSubmit={handleSubmit} className="formulario-alquiler">
        <div className="form-group">
          <label htmlFor="vehiculo">Vehículo:</label>
          <input type="text" id="vehiculo" value={`${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo}`} readOnly />
        </div>
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
            min={new Date().toISOString().split('T')[0]}
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
        <div className="form-group">
          <label htmlFor="precio">Precio por día:</label>
          <input
            type="number"
            id="precio"
            value={precio} 
            onChange={(event) => setPrecio(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="costoTotal">Costo Total:</label>
          <input
            type="number"
            id="costoTotal"
            value={costoTotal}
            readOnly
          />
        </div>
        <button type="submit" className="submit-button">Confirmar Alquiler</button>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </form>
    </div>
  );
};

export default FormularioAlquiler;
