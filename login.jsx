import React, { useState } from "react";
import imageProfile from "../assets/Kratos.png";

import appFirebase from "../../firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
const auth = getAuth(appFirebase)

const Login = () => {
  const [registrando, setRegistrando] = useState(false);
  const [name, setName] = useState();
  const [lastname, setLastName] = useState();
  const [id, setId] = useState();

  const functAuthentication = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    const contraseña = e.target.password.value;
    if (registrando) {
      try {
        await createUserWithEmailAndPassword(auth, correo, contraseña)
        console.log('name', name)
        console.log('lastname', lastname)
        console.log('id', id)
      } catch (error) {
        alert('Asegúrate de que la contraseña tenga más de 8 caracteres')
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, correo, contraseña)
      } catch (error) {
        alert('El correo o la contraseña son incorrectos')
      }
    }
  }

  return (
    <>
      <header className="header">
        <div className="container-header">
          <div className="nav-buttons">
          <button className="btn">Buscar</button>
          <button className="btn">Cuando reservar</button>
          <button className="btn">Ofertas</button>
        </div>
        <button className="btn login-btn">Inicio de Sesion</button>
    </div>
      </header>
      <div className="Container">
        <div className="padre">
          <div className="card card-body">
            <img src={imageProfile} alt="" className="estilo-profile" />
            <form onSubmit={functAuthentication}>
              {registrando && (
                <>
                  <input
                    type="text"
                    placeholder="nombre"
                    className="cajaTexto"
                    id="nombre"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="apellido"
                    className="cajaTexto"
                    id="apellido"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="identificación"
                    className="cajaTexto"
                    id="identificacion"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                  />
                </>
              )}
              <input
                type="text"
                placeholder="Email"
                className="cajaTexto"
                id="email"
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="cajaTexto"
                id="password"
              />

              <button className="btnform">
                {registrando ? "Regístrate" : "Inicia Sesión"}
              </button>
            </form>
            <h4 className="texto">
              {registrando ? "Si ya tienes cuenta" : "No tienes cuenta"}{" "}
              <button className="btnswitch" onClick={() => setRegistrando(!registrando)}>
                {registrando ? "Inicia Sesión" : "Regístrate"}
              </button>
            </h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
