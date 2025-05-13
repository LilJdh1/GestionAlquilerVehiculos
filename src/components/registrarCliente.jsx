import React, { useState } from 'react';
import { db, auth } from '../firebase/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './registroCliente.css';

const RegistrarCliente = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleRegistro = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
      const user = userCredential.user;

      const clienteData = {
        uid: user.uid,
        nombre,
        password,
        apellido,
        correo,
        telefono,
        rol: 'cliente', // Asignar rol como cliente
      };

      await addDoc(collection(db, 'usuarios'), clienteData);
      setMensaje('Cliente registrado con éxito');
      resetFormulario();
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      setMensaje('Error al registrar cliente');
    }
  };

  const resetFormulario = () => {
    setNombre('');
    setApellido('');
    setCorreo('');
    setTelefono('');
    setPassword('');
  };

  return (
    <div className="registrar-cliente-container">
      <h2>Registrar Cliente</h2>
      <form onSubmit={handleRegistro} className="registrar-cliente-form">
        <label>
          Nombre:
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>
        <label>
          Apellido:
          <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
        </label>
        <label>
          Email:
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </label>
        <label>
          Teléfono:
          <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        </label>
        <label>
          Contraseña:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Registrar Cliente</button>
      </form>
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default RegistrarCliente;