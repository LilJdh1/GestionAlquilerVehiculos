import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Login from './components/login';
import Home from './components/home';
import Admin from './components/administrador';
import Clientes from './components/clientes';
import VehiculosDisponibles from './components/vehiculosDisponibles';
import MisRentas from './components/misRentas';
import Alquileres from './components/Alquileres';
import { auth } from './firebase/firebaseConfig';
import InventarioVehiculos from './components/inventarioVehiculos';
import Bienvenida from './components/paginaInicio';
import RegistrarCliente from './components/registrarCliente';
import RegistrarAlquiler from './components/registrarAlquiler';
import EstadisticasAlquileres from './components/estadisticasAlquileres';
import GenerarFactura from './components/GenerarFactura'; 
import "jspdf-autotable";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null); 

  const signOut = async () => {
    try {
      await getAuth().signOut();
      setUsuario(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      console.log('estado de usuario: ', usuarioFirebase);
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase);
      } else {
        setUsuario(null);
      }
    });
    return unsuscribe;
  }, []);

  const onSelectVehicle = (vehiculo) => {
    setSelectedVehicle(vehiculo); 
  };

  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<Bienvenida />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={usuario ? <Home selectedVehicle={selectedVehicle} /> : <Navigate to="/" />} />
        <Route path="/generar-factura" element={usuario ? <GenerarFactura /> : <Navigate to="/" />} /> {/* Ruta para GenerarFactura */}
        <Route path="/admin/*" element={usuario ? <Admin signOut={signOut} /> : <Navigate to="/" />} />
        <Route path="/admin/vehiculos" element={usuario ? <InventarioVehiculos /> : <Navigate to="/" />} />
        <Route path="/admin/usuarios" element={usuario ? <Clientes /> : <Navigate to="/" />} />
        <Route path="/admin/alquileres" element={usuario ? <Alquileres /> : <Navigate to="/" />} />
        <Route path="/admin/registrar-cliente" element={usuario ? <RegistrarCliente /> : <Navigate to="/" />} />
        <Route path="/admin/registrar-alquiler" element={usuario ? <RegistrarAlquiler /> : <Navigate to="/" />} />
        <Route path="/admin/estadisticas-alquileres" element={usuario ? <EstadisticasAlquileres /> : <Navigate to="/" />} />
        <Route path="/cliente/vehiculos" element={usuario ? <VehiculosDisponibles onSelectVehicle={onSelectVehicle} /> : <Navigate to="/" />} />
        <Route path="/cliente/alquileres" element={usuario ? <MisRentas /> : <Navigate to="/" />} />
        <Route path="/generar-factura" element={usuario ? <GenerarFactura /> : <Navigate to="/" />} />

        
        <Route path="*" element={<div>No encontrado</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
