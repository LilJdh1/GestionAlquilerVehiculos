import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { addDoc, collection, doc, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import './inventarioVehiculos.css';  

const storage = getStorage();

const InventarioVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [año, setAño] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tamaño, setTamaño] = useState('pequeño');
  const [imagen, setImagen] = useState(null);
  const [imagenUrl, setImagenUrl] = useState('');
  const [vehiculoEditar, setVehiculoEditar] = useState(null);

  useEffect(() => {
    const vehiculosCollection = collection(db, 'vehiculos');
    const getVehiculos = async () => {
      const querySnapshot = await getDocs(vehiculosCollection);
      const vehiculos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVehiculos(vehiculos);
    };
    getVehiculos();
  }, []);

  const handleAgregarVehiculo = async () => {
    try {
      const vehiculosCollection = collection(db, 'vehiculos');
      await addDoc(vehiculosCollection, {
        marca,
        modelo,
        año,
        descripcion,
        tamaño,
        imagen: imagenUrl,
        disponible: true,
      });
      resetFormulario();
      // Update the vehicle state
      setVehiculos([...vehiculos, { marca, modelo, año, descripcion, tamaño, imagen: imagenUrl, disponible: true }]);
    } catch (error) {
      console.error("Error al agregar vehículo:", error);
    }
  };

  const handleSubirImagen = async () => {
    try {
      const storageRefImagen = storageRef(storage, `vehiculos/${imagen.name}`);
      await uploadBytes(storageRefImagen, imagen);
      const urlImagen = await getDownloadURL(storageRefImagen);
      setImagenUrl(urlImagen);
    } catch (error) {
      console.error("Error al subir imagen:", error);
    }
  };

  const handleEditarVehiculo = (vehiculo) => {
    setVehiculoEditar(vehiculo);
    setMarca(vehiculo.marca);
    setModelo(vehiculo.modelo);
    setAño( vehiculo.año);
    setDescripcion(vehiculo.descripcion);
    setTamaño(vehiculo.tamaño);
    setImagenUrl(vehiculo.imagen);
  };

  const handleGuardarEdicion = async () => {
    try {
      const vehiculoRef = doc(collection(db, 'vehiculos'), vehiculoEditar.id);
      await updateDoc(vehiculoRef, {
        marca,
        modelo,
        año,
        descripcion,
        tamaño,
        imagen: imagenUrl,
      });
      
      setVehiculos(vehiculos.map(v => (v.id === vehiculoEditar.id ? { ...v, marca, modelo, año, descripcion, tamaño, imagen: imagenUrl } : v)));
      resetFormulario();
    } catch (error) {
      console.error("Error al editar vehículo:", error);
    }
  };

  const handleEliminarVehiculo = async (vehiculo) => {
    try {
      const vehiculoRef = doc(collection(db, 'vehiculos'), vehiculo.id);
      await deleteDoc(vehiculoRef);
      // Update the vehicle state
      setVehiculos(vehiculos.filter(v => v.id !== vehiculo.id));
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);
    }
  };

  const resetFormulario = () => {
    setMarca('');
    setModelo('');
    setAño('');
    setDescripcion('');
    setTamaño('pequeño');
    setImagen(null);
    setImagenUrl('');
    setVehiculoEditar(null);
  };

  // Ordenar los vehículos por tamaño (pequeño, mediano, grande)
  const vehiculosOrdenados = vehiculos.sort((a, b) => {
    const tamaños = { pequeño: 1, mediano: 2, grande: 3 };
    return tamaños[a.tamaño] - tamaños[b.tamaño];
  });

  return (
    <div className="inventario-container">
      <h1 className="inventario-title">Inventario De Vehículos</h1>

      <div className="inventario-layout">
        <div className="tabla-vehiculos">
          <table className="vehiculos-table">
            <thead>
              <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>Descripción</th>
                <th>Tamaño</th>
                <th>Imagen</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {vehiculosOrdenados.map((vehiculo) => (
                <tr key={vehiculo.id}>
                  <td>{vehiculo.marca}</td>
                  <td>{vehiculo.modelo}</td>
                  <td>{vehiculo.año}</td>
                  <td>{vehiculo.descripcion}</td>
                  <td>{vehiculo.tamaño}</td>
                  <td>
                    <img src={vehiculo.imagen} alt={vehiculo.modelo} className="vehiculo-imagen" />
                  </td>
                  <td>
                    <button className="editar-btn" onClick={() => handleEditarVehiculo(vehiculo)}>Editar</button>
                  </td>
                  <td>
                    <button className="eliminar-btn" onClick={() => handleEliminarVehiculo(vehiculo)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="form-container">
          <h2>{vehiculoEditar ? "Editar Vehículo" : "Agregar Vehículo"}</h2>
          <form className="vehiculo-form">
            <label>Marca: 
              <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} />
            </label>
            <label>Modelo: 
              <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} />
            </label>
            <label>Año: 
              <input type="number" value={año} onChange={(e) => setAño(e.target.value)} />
            </label>
            <label>Descripción: 
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </label>
            <label>
              Tamaño:
              <select value={tamaño} onChange={(e) => setTamaño(e.target.value)}>
                <option value="pequeño">Pequeño</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </select>
            </label>
            <label>Imagen: 
              <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} />
            </label>
            <div className="form-buttons">
              <button type="button" className="subir-imagen-btn" onClick={handleSubirImagen}>Subir Imagen</button>
              <button type="button" className="agregar-vehiculo-btn" onClick={vehiculoEditar ? handleGuardarEdicion : handleAgregarVehiculo}>
                {vehiculoEditar ? "Guardar Edición" : "Agregar Vehículo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InventarioVehiculos;