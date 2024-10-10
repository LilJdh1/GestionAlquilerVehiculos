import React, { useState } from 'react';
import SeleccionarCliente from './seleccionarCliente';
import SeleccionarVehiculo from './seleccionarVehiculo';
import DetallesAlquiler from './detallesDelAlquiler';
import { db } from '../firebase/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

const RegistrarAlquiler = () => {
    const [clienteSeleccionado, setClienteSeleccionado] = useState('');
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState('');
    const [detallesAlquiler, setDetallesAlquiler] = useState({});
  
    const handleClienteSeleccionado = (idCliente) => {
      setClienteSeleccionado(idCliente);
    };
  
    const handleVehiculoSeleccionado = (idVehiculo) => {
      setVehiculoSeleccionado(idVehiculo);
    };
  
    const handleDetallesCompletados = (detalles) => {
      setDetallesAlquiler(detalles);
    };
  
    const handleRegistrarAlquiler = async () => {
      try {
        const rentasCollection = collection(db, 'rentas');
        await addDoc(rentasCollection, {
          cliente: clienteSeleccionado,
          vehiculo: vehiculoSeleccionado,
          fechaInicio: detallesAlquiler.fechaInicio,
          fechaFin: detallesAlquiler.fechaFin,
        });
        alert('Alquiler registrado con éxito');
      } catch (error) {
        console.error('Error al registrar alquiler:', error);
      }
    };
  
    return (
      <div>
        <h2>Registrar Alquiler</h2>
        <SeleccionarCliente onClienteSeleccionado={handleClienteSeleccionado} />
        <SeleccionarVehiculo onVehiculoSeleccionado={handleVehiculoSeleccionado} />
        <DetallesAlquiler onDetallesCompletados={handleDetallesCompletados} />
        <button onClick={handleRegistrarAlquiler}>Registrar Alquiler</button>
      </div>
    );
  };
  
  export default RegistrarAlquiler;