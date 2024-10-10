import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import './clientes.css';  

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const usuariosCollection = collection(db, 'usuarios');
        const q = query(usuariosCollection, where("rol", "==", "cliente"));
        const querySnapshot = await getDocs(q);
        const clientes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClientes(clientes);
        setCargando(false);
      } catch (error) {
        setError(error);
        console.error("Error al recuperar clientes:", error);
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
                <td>{cliente.correo}</td>
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
