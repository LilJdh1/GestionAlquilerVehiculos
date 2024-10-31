import React, { useState, useEffect, useRef } from 'react';
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
  const [searchTerm, setSearchTerm] = useState(''); // Estado para búsqueda
  const [filterAvailable, setFilterAvailable] = useState(false); // Estado para filtrar por disponibilidad

  
  const formularioRef = useRef(null);

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

    if(formularioRef.current){
      formularioRef.current.scrollIntoView({behavior:'smooth'});
    }
  };

  const handleRentaSubmit = async (datosAlquiler) => {
    const rentasCollection = collection(db, 'rentas');
    const renta = {
      usuario: auth.currentUser.uid,
      vehiculo: datosAlquiler.vehiculo.id,
      fechaAlquiler: datosAlquiler.fechaAlquiler,
      fechaDevolucion: datosAlquiler.fechaDevolucion,
      numeroLicencia: datosAlquiler.numeroLicencia,
      fechaInicio: new Date(),
    };
    
    await addDoc(rentasCollection, renta);
    
    const vehiculoRef = doc(db, 'vehiculos', datosAlquiler.vehiculo.id);
    const vehiculoActualizado = { ...datosAlquiler.vehiculo, disponible: false };
    
    await updateDoc(vehiculoRef, vehiculoActualizado);
    setMensaje(`El vehículo ${datosAlquiler.vehiculo.marca} ${datosAlquiler.vehiculo.modelo} ha sido rentado`);
    
    setTimeout(() => {
      setMensaje('');
      setShowFormulario(false);
    }, 3000);
  };

  
  const filteredVehiculos = vehiculos.filter((vehiculo) => {
    const matchesSearch = vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAvailability = filterAvailable ? vehiculo.disponible : true;

    return matchesSearch && matchesAvailability;
  });

  return (
    <div className="vehiculos-container">
      <header>
        <nav>
          <Link to="/home">Inicio</Link> | 
          <Link to="/cliente/alquileres">Mis Alquileres</Link>
        </nav>
      </header>

      
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por marca o modelo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <label>
          <input
            type="checkbox"
            checked={filterAvailable}
            onChange={(e) => setFilterAvailable(e.target.checked)}
          />
          Mostrar solo disponibles
        </label>
      </div>

      <ul className="vehiculos-list">
        {filteredVehiculos.map((vehiculo) => (
          <li key={vehiculo.id} className="vehiculo-item">
            <h2>{vehiculo.marca} {vehiculo.modelo}</h2>
            <p>{vehiculo.descripcion}</p>
            <img src={vehiculo.imagen} alt={vehiculo.modelo} className="vehiculo-imagen" />
            <div className="button-container">
              {vehiculo.disponible ? (
                <button className="rentar-button" onClick={() => handleRenta(vehiculo)}>Rentar</button>
              ) : (
                <p className="no-disponible">No disponible</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {showFormulario && (
        <div ref ={formularioRef}>
        <FormularioAlquiler
          vehiculo={vehiculoSeleccionado}
          handleRenta={handleRentaSubmit}
          vehiculosDisponibles={vehiculos}            
        />
        </div>
      )}

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default VehiculosDisponibles;
