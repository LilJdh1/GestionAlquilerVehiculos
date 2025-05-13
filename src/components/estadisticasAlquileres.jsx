import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './estadisticasAlquileres.css'
const EstadisticasAlquileres = () => {
  const [alquileres, setAlquileres] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    alquileresPorDia: {},
    alquileresPorMes: {},
    alquileresPorAño: {},
    clientesPorDia: {},
    clientesPorMes: {},
    clientesPorAño: {},
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlquileres = async () => {
      try {
        const alquileresCollection = collection(db, 'rentas');
        const querySnapshot = await getDocs(alquileresCollection);
        const alquileresData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAlquileres(alquileresData);
      } catch (error) {
        setError(error);
      }
    };

    const fetchClientes = async () => {
      try {
        const clientesCollection = collection(db, 'usuarios');
        const querySnapshot = await getDocs(clientesCollection);
        const clientesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setClientes(clientesData);
      } catch (error) {
        setError(error);
      }
    };

    fetchAlquileres();
    fetchClientes();
  }, []);

  const calcularEstadisticas = () => {
    if (alquileres.length > 0 && clientes.length > 0) {
      const estadisticasCalculadas = {
        alquileresPorDia: {},
        alquileresPorMes: {},
        alquileresPorAño: {},
        clientesPorDia: {},
        clientesPorMes: {},
        clientesPorAño: {},
      };

      alquileres.forEach((alquiler) => {
        const fechaAlquilerDate = new Date(alquiler.fechaInicio);
        const dia = fechaAlquilerDate.getDate();
        const mes = fechaAlquilerDate.getMonth() + 1; 
        const año = fechaAlquilerDate.getFullYear();

        estadisticasCalculadas.alquileresPorDia[dia] = (estadisticasCalculadas.alquileresPorDia[dia] || 0) + 1;
        estadisticasCalculadas.alquileresPorMes[mes] = (estadisticasCalculadas.alquileresPorMes[mes] || 0) + 1;
        estadisticasCalculadas.alquileresPorAño[año] = (estadisticasCalculadas.alquileresPorAño[año] || 0) + 1;

        const cliente = clientes.find((cliente) => cliente.id === alquiler.cliente);
        if (cliente) {
          estadisticasCalculadas.clientesPorDia[dia] = (estadisticasCalculadas.clientesPorDia[dia] || 0) + 1;
          estadisticasCalculadas.clientesPorMes[mes] = (estadisticasCalculadas.clientesPorMes[mes] || 0) + 1;
          estadisticasCalculadas.clientesPorAño[año] = (estadisticasCalculadas.clientesPorAño[año] || 0) + 1;
        }
      });

      setEstadisticas(estadisticasCalculadas);
    }
  };

  useEffect(() => {
    calcularEstadisticas();
  }, [alquileres, clientes]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="estadisticas-container">
      <h2 className="estadisticas-title">Estadísticas de Alquileres</h2>
      {Object.keys(estadisticas.alquileresPorDia).length > 0 && (
        <div>
          <div className="estadisticas-section">
            <h3>Alquileres por Día:</h3>
            <ul className="estadisticas-list">
              {Object.keys(estadisticas.alquileresPorDia).map((dia) => (
                <li key={dia}>
                  {dia}: {estadisticas.alquileresPorDia[dia]}
                </li>
              ))}
            </ul>
          </div>
          <div className="estadisticas-section">
            <h3>Alquileres por Mes:</h3>
            <ul className="estadisticas-list">
              {Object.keys(estadisticas.alquileresPorMes).map((mes) => (
                <li key={mes}>
                  {mes}: {estadisticas.alquileresPorMes[mes]}
                </li>
              ))}
            </ul>
          </div>
          <div className="estadisticas-section">
            <h3>Alquileres por Año:</h3>
            <ul className="estadisticas-list">
              {Object.keys(estadisticas.alquileresPorAño).map((año) => (
                <li key={año}>
                  {año}: {estadisticas.alquileresPorAño[año]}
                </li>
              ))}
            </ul>
          </div>
          <div className="estadisticas-section">
            <h3>Clientes por Día:</h3>
            <ul className="estadisticas-list">
              {Object.keys(estadisticas.clientesPorDia).map((dia) => (
                <li key={dia}>
                  {dia}: {estadisticas.clientesPorDia[dia]}
                </li>
              ))}
            </ul>
          </div>
          <div className="estadisticas-section">
            <h3>Clientes por Mes:</h3>
            <ul className="estadisticas-list">
              {Object.keys(estadisticas.clientesPorMes).map((mes) => (
                <li key={mes}>
                  {mes}: {estadisticas.clientesPorMes[mes]}
                </li>
              ))}
            </ul>
          </div>
          <div className="estadisticas-section">
            <h3>Clientes por Año:</h3>
            <ul className="estadisticas-list">
              {Object.keys(estadisticas.clientesPorAño).map((año) => (
                <li key={año}>
                  {año}: {estadisticas.clientesPorAño[año]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default EstadisticasAlquileres;