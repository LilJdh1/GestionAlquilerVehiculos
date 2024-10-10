import React,{useState} from "react";
const RegistroCliente = ({handleRegistro}) =>{
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telefono, setTelefono] = useState('');
    const [identificacion, setIdentificacion] = useState('');

    const handleSubmit = (event) => {
        event.prevenDefault();
        const cliente ={
            nombre, 
            apellido,
            email,
            password,
            telefono,
            identificacion,
        };
        handleRegistro(cliente);
    }
    return(
        <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" value={nombre} onChange={(event) => setNombre(event.target.value)} />
        </label>
        <label>
          Apellido:
          <input type="text" value={apellido} onChange={(event) => setApellido(event.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Contraseña:
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <label>
          Teléfono:
          <input type="text" value={telefono} onChange={(event) => setTelefono(event.target.value)} />
        </label>
        <label>
          Identificación:
          <input type="text" value={identificacion} onChange={(event) => setIdentificacion(event.target.value)} />
        </label>
        <button type="submit">Registrar</button>
      </form>
    )
}
export default RegistroCliente;