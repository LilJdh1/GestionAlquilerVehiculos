import React from 'react';
import { Link } from 'react-router-dom';
import './paginaInicio.css';  

const Bienvenida = () => {
  return (
    <div className="container">
      <div className="welcome-content">
        <h1 className="welcome-title">Bienvenido a Nuestra Plataforma de Alquiler de Vehículos</h1>
        <p className="welcome-description">
          En nuestra plataforma, ofrecemos una amplia gama de vehículos para satisfacer todas tus necesidades de transporte. Ya sea para un evento especial, un viaje de negocios o una escapada de fin de semana, estamos aquí para ayudarte a encontrar el coche perfecto.
        </p>
        <p className="welcome-instruction">
          Disfruta de un proceso de alquiler sin complicaciones, con atención al cliente de primera clase y precios competitivos. Haz clic en el botón a continuación para comenzar tu experiencia de alquiler con nosotros.
        </p>
        <div className="buttons">
          <Link to="/login" className="button">Iniciar Alquiler</Link>
        </div>
      </div>
    </div>
  );
};

export default Bienvenida;
