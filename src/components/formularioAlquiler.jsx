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
            required
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
      </form>
    </div>
  );
};

export default FormularioAlquiler;
