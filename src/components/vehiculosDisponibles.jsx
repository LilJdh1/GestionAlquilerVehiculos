import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import FormularioAlquiler from './formularioAlquiler';
import './vehiculosDisponibles.css';
import { Link } from 'react-router-dom';

const auth = getAuth();

const VehiculosDisponibles = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [showFormulario, setShowFormulario] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchVehiculos = async () => {
      const vehiculosCollection = collection(db, 'vehiculos');
      const querySnapshot = await getDocs(vehiculosCollection);
      const vehiculosData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVehiculos(vehiculosData);
    };

    fetchVehiculos();
  }, []);

  const handleRenta = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setShowFormulario(true);
  };

  const handleRentaSubmit = async (datosAlquiler) => {
    const rentasCollection = collection(db, 'rentas');
    const renta = {
      usuario: auth.currentUser.uid,
      vehiculo: vehiculoSeleccionado.id,
      fechaAlquiler: datosAlquiler.fechaAlquiler,
      fechaDevolucion: datosAlquiler.fechaDevolucion,
      numeroLicencia: datosAlquiler.numeroLicencia,
      fechaInicio: new Date(),
    };
    
    await addDoc(rentasCollection, renta);
    
    const vehiculoRef = doc(db, 'vehiculos', vehiculoSeleccionado.id);
    const vehiculoActualizado = { ...vehiculoSeleccionado, disponible: false };
    
    await updateDoc(vehiculoRef, vehiculoActualizado);
    setMensaje(`El vehículo ${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo} ha sido rentado`);
    
    setTimeout(() => {
      setMensaje('');
    }, 3000);
  };

  return (
    <div className="vehiculos-container">
      <h1>Vehículos disponibles</h1>
      <ul className="vehiculos-list">
        {vehiculos.map((vehiculo) => (
          <li key={vehiculo.id} className="vehiculo-item">
            <h2>{vehiculo.marca} {vehiculo.modelo}</h2>
            <p>{vehiculo.descripcion}</p>
            <img src={vehiculo.imagen} alt={vehiculo.modelo} className="vehiculo-imagen" />
            <div className="button-container"> {/* Contenedor para el botón */}
              {vehiculo.disponible ? (
                <button className="rentar-button" onClick={() => handleRenta(vehiculo)}>Rentar</button>
              ) : (
                <p className="no-disponible">No disponible</p>
              )}
            </div>
            <Link to="/home">
            <button>Volver a la página de inicio</button>
            </Link>
          </li>
          
        ))}
      </ul>
      {showFormulario && (
        <FormularioAlquiler
          vehiculo={vehiculoSeleccionado}
          handleRenta={handleRentaSubmit}
        />
      )}

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default VehiculosDisponibles;