import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { Link, Route, useNavigate, Routes } from 'react-router-dom';
import Clientes from './clientes';
import InventarioVehiculos from './inventarioVehiculos';
import Alquileres from './Alquileres';
import './administrador.css'; 
import RegistroCliente from './registroCliente';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';


const auth = getAuth();
const Administrador = () => {
  const [showRegistro, setShowRegistro] = useState(false);

  const handleRegistro = async (cliente) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cliente.email, cliente.password);
      const usuario = {
        uid: userCredential.user.uid,
        rol: 'cliente',
        ...cliente,
      };
      const usuariosCollection = collection(db, 'usuarios');
      await addDoc(usuariosCollection, usuario);
      console.log('cliente registado con exito');
      alert('Usuario Registrado con exito')
    } catch (error) {
      console.log('Error al registrar cliente', error)
      alert('Error al registrar cliente')
      
    }
  }

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
          <Link to="admin/estadisticas-alquileres" className="admin-button">Estadisticas de alquileres</Link>
        </div>
        <button className="logout-button" onClick={signOut}>Cerrar sesión</button>
      </form>
      <Routes>
        <Route path='/admin/usuarios' element={<Clientes />} />
        <Route path='/admin/vehiculos' element={<InventarioVehiculos />} />
        <Route path='/admin/alquileres' element={<Alquileres />} />
        <Route path='/admin/registrar-cliente' element={<RegistroCliente handleRegistro={handleRegistro}/>}/>
      </Routes>
    </div>
  );
};

export default Administrador;