import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './clientes.css'; 

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const usuariosCollection = collection(db, 'usuarios');
        const querySnapshot = await getDocs(usuariosCollection);
        const clientesData = querySnapshot.docs
          .filter((doc) => doc.data().rol === 'cliente')
          .map((doc) => ({ id: doc.id, ...doc.data() }));
        setClientes(clientesData);
      } catch (error) {
        setError(error);
        console.error("Error al recuperar clientes:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchClientes();
  }, []);

  if (cargando) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">Error al cargar clientes: {error.message}</div>;
  }

  return (
    <div className="clientes-container">
      <h1 className="clientes-title">Lista de Clientes</h1>
      {clientes.length > 0 ? (
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-clientes-message">No hay clientes para mostrar.</p>
      )}
    </div>
  );
};

export default Clientes;
