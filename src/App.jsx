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
import RegistroUsuario from './components/RegistroUsuario';
import { auth } from './firebase/firebaseConfig';
import InventarioVehiculos from './components/inventarioVehiculos';
import Bienvenida from './components/paginaInicio';

function App() {
  const [usuario, setUsuario] = useState(null);

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
      console.log('estado de usuario: ', usuarioFirebase)
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase);
      } else {
        setUsuario(null);
      }
    });
    return unsuscribe;
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta para la página de bienvenida */}
        <Route path="/" element={<Bienvenida />} />
        
        {/* Otras rutas protegidas por autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={usuario ? <Home /> : <Navigate to="/" />} />
        <Route path="/admin/*" element={usuario ? <Admin signOut={signOut} /> : <Navigate to="/" />} />
        <Route path="/admin/vehiculos" element={usuario ? <InventarioVehiculos /> : <Navigate to="/" />} />
        <Route path="/admin/usuarios" element={usuario ? <Clientes /> : <Navigate to="/" />} />
        <Route path="/admin/alquileres" element={usuario ? <Alquileres /> : <Navigate to="/" />} />
        <Route path="/cliente/vehiculos" element={usuario ? <VehiculosDisponibles /> : <Navigate to="/" />} />
        <Route path="/cliente/alquileres" element={usuario ? <MisRentas /> : <Navigate to="/" />} />
        
        {/* Manejo de rutas no encontradas */}
        <Route path="*" element={<div>No encontrado</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
