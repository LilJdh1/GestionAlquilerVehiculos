import {  getAuth, signOut } from 'firebase/auth';
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Clientes from './clientes';
import InventarioVehiculos from './inventarioVehiculos';
import Alquileres from './Alquileres';
import './administrador.css'; 
import RegistrarCliente from './registrarCliente';
import RegistrarAdmin from './registrarAdmin';

const auth = getAuth();
const Administrador = () => {
  return (
    <div className="admin-container">
      <form className="admin-form">
        <h2 className="welcome-title">Bienvenido, Administrador</h2>
        <p className="welcome-message">Administra usuarios, vehículos y alquileres de forma eficiente.</p>
        <div className="admin-buttons">
          <Link to="/admin/usuarios" className="admin-button">Gestionar Usuarios</Link>
          <Link to="/admin/vehiculos" className="admin-button">Gestionar Vehículos</Link>
          <Link to="/admin/alquileres" className="admin-button">Gestionar Alquileres</Link>
          <Link to="/admin/registrar-cliente" className="admin-button">Registrar Cliente</Link>
          <Link to="/admin/registrar-alquiler" className="admin-button">Registrar Alquiler</Link>
          <Link to="/admin/estadisticas-alquileres" className="admin-button">Estadísticas de alquileres</Link>
          <Link to="/admin/registrar-admin" className='admin-button'>Registrar Administrador</Link>
        </div>
        <button className="logout-button" onClick={() => signOut(auth)}>Cerrar sesión</button>
      </form>
      <Routes>
        <Route path='/admin/usuarios' element={<Clientes />} />
        <Route path='/admin/vehiculos' element={<InventarioVehiculos />} />
        <Route path='/admin/alquileres' element={<Alquileres />} />
        <Route path='/admin/registrar-cliente' element={<RegistrarCliente />} />
        <Route path="/admin/registrar-admin" element={<RegistrarAdmin />} />
      </Routes>
    </div>
  );
};

export default Administrador;
