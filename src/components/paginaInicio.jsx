import React from 'react';
import { Link } from 'react-router-dom';



const Bienvenida = () => {
  return (
    <div className="container">
      <h1>Bienvenido a nuestra plataforma de alquiler de vehículos</h1>
      <p>Aqui podras tener el alquiler del carro de tus sueños para tener la experecia que te mereces</p>
      <p>Por favor da click en el boton para continuar con tu experiencia</p>
      <div className="buttons">
        <Link to="/login" className="button">COMIENZA TU EXPERIENCIA</Link>
      </div>
    </div>
  );
};

export default Bienvenida;