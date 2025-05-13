import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './login.css';

const auth = getAuth();

const Login = () => {
  const navigate = useNavigate();
  const [registrando, setRegistrando] = useState(false);
  const [campos, setCampos] = useState({});
  const [credenciales, setCredenciales] = useState({ email: '', password: '' });

  const functAuthentication = async (e) => {
    e.preventDefault();

    if (registrando) {
      try {
        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          campos.correo,
          campos.contraseña
        );

        // Registrar usuario en Firestore con rol fijo 'cliente'
        const usuario = {
          uid: userCredential.user.uid,
          rol: 'cliente',
          ...campos,
        };
        await addDoc(collection(db, 'usuarios'), usuario);

        console.log('Cliente registrado con éxito');
        setRegistrando(false); // volver al login
      } catch (error) {
        console.error('Error al registrar usuario:', error);
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          credenciales.email,
          credenciales.password
        );
        const user = userCredential.user;

        // Obtener rol desde Firestore
        const usuariosCollection = collection(db, 'usuarios');
        const querySnapshot = await getDocs(usuariosCollection);
        const usuario = querySnapshot.docs.find((doc) => doc.data().uid === user.uid);

        if (!usuario) {
          console.error('Usuario no encontrado en Firestore');
          return;
        }

        const rol = usuario.data().rol;

        if (rol === 'administrador') {
          navigate('/admin');
        } else if (rol === 'cliente') {
          navigate('/home');
        } else {
          console.error('Rol desconocido:', rol);
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      }
    }
  };

  const handleCampoChange = (e) => {
    setCampos({ ...campos, [e.target.name]: e.target.value });
  };

  const handleCredencialesChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={functAuthentication}>
        <h2>{registrando ? 'Registro de Cliente' : 'Iniciar sesión'}</h2>

        {registrando ? (
          <>
            <input type="text" name="identificacion" placeholder="Identificación" value={campos.identificacion || ''} onChange={handleCampoChange} className="input-field" />
            <input type="text" name="nombre" placeholder="Nombre" value={campos.nombre || ''} onChange={handleCampoChange} className="input-field" />
            <input type="text" name="apellido" placeholder="Apellido" value={campos.apellido || ''} onChange={handleCampoChange} className="input-field" />
            <input type="text" name="telefono" placeholder="Teléfono" value={campos.telefono || ''} onChange={handleCampoChange} className="input-field" />
            <input type="email" name="correo" placeholder="Correo" value={campos.correo || ''} onChange={handleCampoChange} className="input-field" />
            <input type="password" name="contraseña" placeholder="Contraseña" value={campos.contraseña || ''} onChange={handleCampoChange} className="input-field" />
          </>
        ) : (
          <>
            <input type="email" name="email" placeholder="Correo" value={credenciales.email} onChange={handleCredencialesChange} className="input-field" />
            <input type="password" name="password" placeholder="Contraseña" value={credenciales.password} onChange={handleCredencialesChange} className="input-field" />
          </>
        )}

        <button type="submit" className="submit-button">
          {registrando ? 'Registrar Cliente' : 'Iniciar sesión'}
        </button>

        <button type="button" onClick={() => setRegistrando(!registrando)} className="toggle-button">
          {registrando ? '¿Ya tienes cuenta? Iniciar sesión' : '¿No tienes cuenta? Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default Login;
