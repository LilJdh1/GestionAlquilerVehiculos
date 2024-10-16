import React, { useState } from 'react';
import SeleccionarCliente from './seleccionarCliente';
import SeleccionarVehiculo from './seleccionarVehiculo';
import DetallesAlquiler from './detallesDelAlquiler';
import { db } from '../firebase/firebaseConfig';
import { addDoc, collection,updateDoc,doc } from 'firebase/firestore';
import './registrarAlquiler.css';  

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

      const vehiculoRef = doc(db, 'vehiculos', vehiculoSeleccionado);
      const vehiculoActualizado = { ...vehiculoSeleccionado, disponible: false };
      await updateDoc(vehiculoRef, vehiculoActualizado);

      alert('Alquiler registrado con éxito');
    } catch (error) {
      console.error('Error al registrar alquiler:', error);
    }
  };

  return (
    <div className="registrar-alquiler-container">
      <h2 className="title">Registrar Alquiler</h2>
      <div className="form-section">
        <SeleccionarCliente onClienteSeleccionado={handleClienteSeleccionado} />
        <SeleccionarVehiculo onVehiculoSeleccionado={handleVehiculoSeleccionado} />
        <DetallesAlquiler onDetallesCompletados={handleDetallesCompletados} />
        <button className="submit-button" onClick={handleRegistrarAlquiler}>Registrar Alquiler</button>
      </div>
    </div>
  );
};

export default RegistrarAlquiler;