import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, deleteDoc, onSnapshot, getDoc, updateDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './misRentas.css';
import { Link } from 'react-router-dom';

const auth = getAuth();

const MisRentas = () => {
  const [vehiculosRentados, setVehiculosRentados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase);
      } else {
        setUsuario(null);
      }
    });
  }, []);

  useEffect(() => {
    if (usuario) {
      const rentasCollection = collection(db, 'rentas');
      const unsubscribe = onSnapshot(rentasCollection, (querySnapshot) => {
        const rentas = querySnapshot.docs.filter((doc) => doc.data().usuario === usuario.uid);
        const vehiculosRentadosPromesas = rentas.map((renta) => {
          const vehiculoRef = doc(db, 'vehiculos', renta.data().vehiculo);
          return getDoc(vehiculoRef);
        });
        Promise.all(vehiculosRentadosPromesas).then((vehiculosRentadosDocs) => {
          const vehiculosRentados = vehiculosRentadosDocs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setVehiculosRentados(vehiculosRentados);
        });
      });
      return unsubscribe;
    }
  }, [usuario]);

  const handleDevolver = async (vehiculo) => {
    const vehiculoRef = doc(db, 'vehiculos', vehiculo.id);
    const vehiculoActualizado = { ...vehiculo, disponible: true };

    await updateDoc(vehiculoRef, vehiculoActualizado);

    const rentasCollection = collection(db, 'rentas');
    const querySnapshot = await getDocs(rentasCollection);
    const renta = querySnapshot.docs.find((doc) => doc.data().vehiculo === vehiculo.id);
    if (renta) {
      await deleteDoc(doc(db, 'rentas', renta.id));
    }

    setMensaje(`El vehículo ${vehiculo.marca} ${vehiculo.modelo} ha sido devuelto`);

    setTimeout(() => {
      setMensaje('');
    }, 3000);
  };

  return (
    <div className="mis-rentas-container">
      <header>
        <nav>
          <Link to="/home">Inicio</Link> | 
          <Link to="/cliente/vehiculos">Vehículos Disponibles</Link>
        </nav>
      </header>
      <h1 className="titulo">Mis Alquileres</h1>
      <div className="vehiculos-list">
        {vehiculosRentados.length > 0 ? (
          vehiculosRentados.map((vehiculo) => (
            <div key={vehiculo.id} className="vehiculo-card">
              <img src={vehiculo.imagen} alt={vehiculo.modelo} className="vehiculo-imagen" />
              <div className="vehiculo-info">
                <h2 className="vehiculo-nombre">{vehiculo.marca} {vehiculo.modelo}</h2>
                <p className="vehiculo-descripcion">{vehiculo.descripcion}</p>
                <button className="devolver-button" onClick={() => handleDevolver(vehiculo)}>Devolver</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-rentas">No tienes vehículos alquilados en este momento.</p>
        )}
      </div>
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default MisRentas;
