import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc,getDoc } from 'firebase/firestore';
import './Alquileres.css'; 

const Alquileres = () => {
  const [alquileres, setAlquileres] = useState([]);

  useEffect(() => {
    const alquileresCollection = collection(db, 'rentas');
    const fetchAlquileres = async () => {
      const querySnapshot = await getDocs(alquileresCollection);
      const alquileresData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAlquileres(alquileresData);
    };
    fetchAlquileres();
  }, []);

  const handleEliminarAlquiler = async (alquilerId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este alquiler?')) {
      try {
        const alquilerRef = doc(db, 'rentas', alquilerId);
        const alquilerData = await getDoc(alquilerRef);
        const vehiculoId = alquilerData.data().vehiculo;

        // Eliminar el alquiler
        await deleteDoc(alquilerRef);

        // Actualizar la disponibilidad del vehículo
        const vehiculoRef = doc(db, 'vehiculos', vehiculoId);
        await updateDoc(vehiculoRef, { disponible: true });

        setAlquileres(alquileres.filter(alquiler => alquiler.id !== alquilerId));
        alert('Alquiler eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar alquiler:', error);
        alert('Error al eliminar alquiler');
      }
    }
  };

  return (
    <div className="contenedor-alquileres">
      <header className="encabezado-alquileres">
        <h1>Alquileres</h1>
      </header>
      <div className="lista-alquileres">
        {alquileres.map((alquiler) => (
          <div className="tarjeta-alquiler" key={alquiler.id}>
            <h2 className="alquiler-id">Alquiler ID: {alquiler.id}</h2>
            <p><strong>Usuario:</strong> {alquiler.usuario}</p>
            <p><strong>Vehículo:</strong> {alquiler.vehiculo}</p>
            <p><strong>Fecha de alquiler:</strong> {new Date(alquiler.fechaAlquiler).toLocaleDateString()}</p>
            <p><strong>Fecha de devolución:</strong> {new Date(alquiler.fechaDevolucion).toLocaleDateString()}</p>
            <p><strong>Número de licencia:</strong> {alquiler.numeroLicencia}</p>
            <button onClick={() => handleEliminarAlquiler(alquiler.id)} className="eliminar-alquiler-button">Eliminar Alquiler</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alquileres;