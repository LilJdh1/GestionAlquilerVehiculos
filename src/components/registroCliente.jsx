import React, { useState } from 'react';
import './registroCliente.css'; 

const RegistroCliente = ({ handleRegistro }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [identificacion, setIdentificacion] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const cliente = {
      nombre,
      apellido,
      email,
      password,
      telefono,
      identificacion,
    };
    handleRegistro(cliente);
  };

  return (
    <div className="registro-container">
      <form onSubmit={handleSubmit} className="registro-form">
        <h2 className="registro-title">Registrar Cliente</h2>
        <label>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            className="input-field"
          />
        </label>
        <label>
          Apellido:
          <input
            type="text"
            value={apellido}
            onChange={(event) => setApellido(event.target.value)}
            className="input-field"
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input-field"
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input-field"
          />
        </label>
        <label>
          Teléfono:
          <input
            type="text"
            value={telefono}
            onChange={(event) => setTelefono(event.target.value)}
            className="input-field"
          />
        </label>
        <label>
          Identificación:
          <input
            type="text"
            value={identificacion}
            onChange={(event) => setIdentificacion(event.target.value)}
            className="input-field"
          />
        </label>
        <button type="submit" className="submit-button">Registrar</button>
      </form>
    </div>
  );
};

export default RegistroCliente;
