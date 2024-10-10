import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const SeleccionarVehiculo = ({ onVehiculoSeleccionado }) => {
  const [vehiculos, setVehiculos] = useState([]);

  useEffect(() => {
    const fetchVehiculos = async () => {
      const querySnapshot = await getDocs(collection(db, 'vehiculos'));
      const listaVehiculos = querySnapshot.docs
        .filter(doc => doc.data().disponible === true)
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setVehiculos(listaVehiculos);
    };

    fetchVehiculos();
  }, []);

  return (
    <div>
      <h3>Seleccionar Vehículo</h3>
      <select onChange={(e) => onVehiculoSeleccionado(e.target.value)}>
        <option value="">Seleccione un vehículo</option>
        {vehiculos.map(vehiculo => (
          <option key={vehiculo.id} value={vehiculo.id}>
            {vehiculo.marca} {vehiculo.modelo}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SeleccionarVehiculo;
