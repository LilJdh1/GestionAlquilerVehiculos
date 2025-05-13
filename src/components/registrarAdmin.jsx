import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import './registrarAdmin.css'; 

const auth = getAuth();

const RegistrarAdmin = () => {
  const [campos, setCampos] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampos((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        campos.correo,
        campos.contraseña
      );

      // Crear documento en Firestore para el nuevo administrador
      const usuario = {
        uid: userCredential.user.uid,
        nombre: campos.nombre,
        apellido: campos.apellido,
        correo: campos.correo,
        rol: 'administrador',
      };

      const usuariosCollection = collection(db, 'usuarios');
      await addDoc(usuariosCollection, usuario);

      alert("Administrador registrado con éxito");
      setCampos({ nombre: '', apellido: '', correo: '', contraseña: '' });  // Limpiar formulario
    } catch (error) {
      console.error("Error al registrar administrador:", error);
      setError("Hubo un error al registrar el administrador. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registrar-admin-container">
      <h2>Registrar Administrador</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="registrar-admin-form">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={campos.nombre}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={campos.apellido}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={campos.correo}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={campos.contraseña}
          onChange={handleInputChange}
          required
        />

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar Administrador'}
        </button>
      </form>
    </div>
  );
};

export default RegistrarAdmin;
