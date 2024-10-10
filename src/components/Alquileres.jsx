import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './Alquileres.css'; 

const Alquileres = () => {
  const [alquileres, setAlquileres] = useState([]);

  useEffect(() => {
    const alquileresCollection = collection(db, 'rentas');
    const querySnapshot = getDocs(alquileresCollection);
    querySnapshot.then((querySnapshot) => {
      const alquileres = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAlquileres(alquileres);
    });
  }, []);

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alquileres;
