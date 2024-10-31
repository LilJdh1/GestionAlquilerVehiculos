import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './generarFactura.css'; 

const GenerarFactura = () => {
  const location = useLocation();
  const { datosAlquiler } = location.state || {};
  const navigate = useNavigate();

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text("Factura de Alquiler", 20, 10);
    
    
    doc.text(`Número de Licencia: ${datosAlquiler.numeroLicencia}`, 20, 20);
    doc.text(`Ubicación: ${datosAlquiler.ubicacion}`, 20, 30);
    doc.text(`Vehículo: ${datosAlquiler.vehiculo.marca} ${datosAlquiler.vehiculo.modelo}`, 20, 40);
    doc.text(`Fecha de Alquiler: ${datosAlquiler.fechaAlquiler}`, 20, 50);
    doc.text(`Fecha de Devolución: ${datosAlquiler.fechaDevolucion}`, 20, 60);
    doc.text(`Precio por día: $${datosAlquiler.precio}`, 20, 70);
    doc.text(`Costo Total: $${datosAlquiler.costoTotal}`, 20, 80);

    doc.save("factura_alquiler.pdf");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión: ', error);
    }
  };

  return (
    <div className="factura-container">
      <header>
        <nav>
          <Link to="/home">Inicio</Link> | 
          <Link to="/cliente/vehiculos">Vehículos Disponibles</Link> | 
          <Link to="/cliente/alquileres">Mis Alquileres</Link>
          <button className="nav-button" onClick={generarPDF}>Generar Factura</button>
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </nav>
      </header>

      <div className="agradecimiento">
        <h2>¡Gracias por elegirnos!</h2>
        <p>
          Agradecemos tu preferencia y confianza en nuestros servicios de alquiler de vehículos. 
          Si necesitas asistencia adicional o tienes alguna pregunta, no dudes en contactarnos. 
          ¡Esperamos verte de nuevo pronto!
        </p>
        <p>¡Buen viaje!</p>
      </div>
    </div>
  );
};

export default GenerarFactura;
