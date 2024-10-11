
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';

const EstadisticasAlquileres = () => {
  const [alquileres, setAlquileres] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    const fetchAlquileres = async () => {
      const alquileresCollection = collection(db, 'rentas');
      const querySnapshot = await getDocs(alquileresCollection);
      const alquileresData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAlquileres(alquileresData);
    };

    const fetchClientes = async () => {
      const clientesCollection = collection(db, 'usuarios');
      const querySnapshot = await getDocs(clientesCollection);
      const clientesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClientes(clientesData);
    };

    fetchAlquileres();
    fetchClientes();
  }, []);

  const handleFechaInicioChange = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleFechaFinChange = (e) => {
    setFechaFin(e.target.value);
  };

  const filtrarAlquileres = () => {
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
    const alquileresFiltrados = alquileres.filter((alquiler) => {
      const fechaAlquilerDate = new Date(alquiler.fechaInicio);
      return fechaAlquilerDate >= fechaInicioDate && fechaAlquilerDate <= fechaFinDate;
    });
    return alquileresFiltrados;
  };

  const calcularEstadisticas = () => {
    const alquileresFiltrados = filtrarAlquileres();
    const estadisticas = {
      alquileresPorDia: {},
      alquileresPorMes: {},
      alquileresPorAño: {},
      clientesPorDia: {},
      clientesPorMes: {},
      clientesPorAño: {},
    };

    alquileresFiltrados.forEach((alquiler) => {
      const fechaAlquilerDate = new Date(alquiler.fechaInicio);
      const dia = fechaAlquilerDate.getDate();
      const mes = fechaAlquilerDate.getMonth() + 1;
      const año = fechaAlquilerDate.getFullYear();

      estadisticas.alquileresPorDia[dia] = (estadisticas.alquileresPorDia[dia] || 0) + 1;
      estadisticas.alquileresPorMes[mes] = (estadisticas.alquileresPorMes[mes] || 0) + 1;
      estadisticas.alquileresPorAño[año] = (estadisticas.alquileresPorAño[año] || 0) + 1;

      const cliente = clientes.find((cliente) => cliente.id === alquiler.cliente);
      if (cliente) {
        estadisticas.clientesPorDia[dia] = (estadisticas.clientesPorDia[dia] || 0) + 1;
        estadisticas.clientesPorMes[mes] = (estadisticas.clientesPorMes[mes] || 0) + 1;
        estadisticas.clientesPorAño[año] = (estadisticas.clientesPorAño[año] || 0) + 1;
      }
    });

    return estadisticas;
  };

  const estadisticas = calcularEstadisticas();

  const data = {
    labels: Object.keys(estadisticas.alquileresPorDia),
    datasets: [
      {
        label: 'Alquileres por día',
        data: Object.values(estadisticas.alquileresPorDia),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Estadísticas de alquileres</h2>
      <form>
        <label>Fecha de inicio:</label>
        <input type="date" value={fechaInicio} onChange={handleFechaInicioChange} />
        <br />
        <label>Fecha de fin:</label>
        <input type="date" value={fechaFin} onChange={handleFechaFinChange} />
      </form>
      <Line data={data} />
      <h3>Alquileres por día:</h3>
      <ul>
        {Object.keys(estadisticas.alquileresPorDia).map((dia, index) => (
          <li key={index}>
            {dia}: {estadisticas.alquileresPorDia[dia]}
          </li>
        ))}
      </ul>
      <h3>Alquileres por mes:</h3>
      <ul>
        {Object.keys(estadisticas.alquileresPorMes).map((mes, index) => (
          <li key={index}>
            {mes}: {estadisticas.alquileresPorMes[mes]}
          </li>
        ))}
      </ul>
      <h3>Alquileres por año:</h3>
      <ul>
        {Object.keys(estadisticas.alquileresPorAño).map((año, index) => (
          <li key={index}>
            {año}: {estadisticas.alquileresPorAño[año]}
          </li>
        ))}
      </ul>
      <h3>Clientes por día:</h3>
      <ul>
        {Object.keys(estadisticas.clientesPorDia).map((dia, index) => (
          <li key={index}>
            {dia}: {estadisticas.clientesPorDia[dia]}
          </li>
        ))}
      </ul>
      <h3>Clientes por mes:</h3>
      <ul>
        {Object.keys(estadisticas.clientesPorMes).map((mes, index) => (
          <li key={index}>
            {mes}: {estadisticas.clientesPorMes[mes]}
          </li>
        ))}
      </ul>
      <h3>Clientes por año:</h3>
      <ul>
        {Object.keys(estadisticas.clientesPorAño).map((año, index) => (
          <li key={index}>
            {año}: {estadisticas.clientesPorAño[año]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EstadisticasAlquileres;