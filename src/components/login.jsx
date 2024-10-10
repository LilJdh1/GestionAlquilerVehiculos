
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
  const [rol, setRol] = useState('');
  const [campos, setCampos] = useState({});
  const [credenciales, setCredenciales] = useState({ email: '', password: '' });

  const functAuthentication = async (e) => {
    e.preventDefault();
    if (registrando) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, campos.correo, campos.contraseña);
        const usuario = {
          uid: userCredential.user.uid,
          rol: rol,
          ...campos,
        };
        const usuariosCollection = collection(db, 'usuarios');
        await addDoc(usuariosCollection, usuario);
        console.log('Usuario registrado con éxito');
        navigate('/home');
      } catch (error) {
        console.error('Error al registrar usuario:', error);
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, credenciales.email, credenciales.password);
        const user = userCredential.user;
        const usuariosCollection = collection(db, 'usuarios');
        const querySnapshot = await getDocs(usuariosCollection);
        const usuario = querySnapshot.docs.find((doc) => doc.data().uid === user.uid);
        if (usuario.data().rol === 'administrador') {
          navigate('/admin');
        } else if (usuario.data().rol === 'cliente') {
          navigate('/home');
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      }
    }
  };

  const handleRolChange = (e) => {
    setRol(e.target.value);
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
        <h2>{registrando ? 'Registro' : 'Iniciar sesión'}</h2>
        {registrando ? (
          <>
            <select value={rol} onChange={handleRolChange} className="input-field">
              <option value="">Seleccione un rol</option>
              <option value="administrador">Administrador</option>
              <option value="cliente">Cliente</option>
            </select>
            {rol === 'administrador' && (
              <>
                <input type="text" name="nombre" placeholder="Nombre" value={campos.nombre} onChange={handleCampoChange} className="input-field" />
                <input type="text" name="apellido" placeholder="Apellido" value={campos.apellido} onChange={handleCampoChange} className="input-field" />
                <input type="email" name="correo" placeholder="Correo" value={campos.correo} onChange={handleCampoChange} className="input-field" />
                <input type="password" name="contraseña" placeholder="Contraseña" value={campos.contraseña} onChange={handleCampoChange} className="input-field" />
                <input type="text" name="inventario" placeholder="Inventario" value={campos.inventario} onChange={handleCampoChange} className="input-field" />
              </>
            )}
            {rol === 'cliente' && (
              <>
                <input type="text" name="identificacion" placeholder="Identificación" value={campos.identificacion} onChange={handleCampoChange} className="input-field" />
                <input type="text" name="nombre" placeholder="Nombre" value={campos.nombre} onChange={handleCampoChange} className="input-field" />
                <input type="text" name="apellido" placeholder="Apellido" value={campos.apellido} onChange={handleCampoChange} className="input-field" />
                <input type="text" name="telefono" placeholder="Teléfono" value={campos.telefono} onChange={handleCampoChange} className="input-field" />
                <input type="email" name="correo" placeholder="Correo" value={campos.correo} onChange={handleCampoChange} className="input-field" />
                <input type="password" name="contraseña" placeholder="Contraseña" value={campos.contraseña} onChange={handleCampoChange} className="input-field" />
              </>
            )}
          </>
        ) : (
          <>
            <input type="email" name="email" placeholder="Correo" value={credenciales.email} onChange={handleCredencialesChange} className="input-field" />
            <input type="password" name="password" placeholder="Contraseña" value={credenciales.password} onChange={handleCredencialesChange} className="input-field" />
          </>
        )}
        <button type="submit" className="submit-button">
          {registrando ? 'Registrar' : 'Iniciar sesión'}
        </button>
        <button onClick={() => setRegistrando(!registrando)} className="toggle-button">
          {registrando ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
        </button>
      </form>
    </div>
  );
  
};

export default Login;