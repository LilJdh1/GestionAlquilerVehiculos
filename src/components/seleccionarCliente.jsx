import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const SeleccionarCliente = ({ onClienteSeleccionado }) => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const querySnapshot = await getDocs(collection(db, 'usuarios'));
      const listaClientes = querySnapshot.docs
        .filter(doc => doc.data().rol === 'cliente')
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setClientes(listaClientes);
    };

    fetchClientes();
  }, []);

  return (
    <div>
      <h3>Seleccionar Cliente</h3>
      <select onChange={(e) => onClienteSeleccionado(e.target.value)}>
        <option value="">Seleccione un cliente</option>
        {clientes.map(cliente => (
          <option key={cliente.id} value={cliente.id}>
            {cliente.nombre} {cliente.apellido}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SeleccionarCliente;
