import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, doc, updateDoc, onSnapshot, getDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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

    // Elimina la renta del vehículo
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

    // Actualiza la lista de vehículos rentados
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
  };

  return (
    <div>
      <h1>Mis alquileres</h1>
      <ul>
        {vehiculosRentados.map((vehiculo) => (
          <li key={vehiculo.id}>
            <h2>{vehiculo.marca} {vehiculo.modelo}</h2>
            <p>{vehiculo.descripcion}</p>
            <img src={vehiculo.imagen} alt={vehiculo.modelo} style={{ width: '100px', height: '100px' }} />
            <button onClick={() => handleDevolver(vehiculo)}>Devolver</button>
          </li>
        ))}
      </ul>
      {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}
    </div>
  );
};

export default MisRentas;