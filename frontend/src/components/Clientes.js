import React, { useState, useEffect } from 'react';

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState(null);
    const [nuevo, setNuevo] = useState({ nombre: '', correo: '' });

    const obtenerMensajeError = async (res, mensajeBase) => {
        const data = await res.json().catch(() => ({}));
        return data.error ? `${mensajeBase}: ${data.error}` : mensajeBase;
    };

    const cargarClientes = async () => {
        try {
            const res = await fetch('http://localhost:3000/clientes', { credentials: 'include' });
            if (!res.ok) throw new Error(await obtenerMensajeError(res, 'Error al cargar clientes'));
            const data = await res.json();
            setClientes(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    const handleChange = (e) => {
        setNuevo({ ...nuevo, [e.target.name]: e.target.value });
    };

    const crearCliente = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(nuevo)
            });
            if (!res.ok) throw new Error(await obtenerMensajeError(res, 'Error al crear cliente'));
            setNuevo({ nombre: '', correo: '' });
            cargarClientes();
        } catch (err) {
            setError(err.message);
        }
    };

    const eliminarCliente = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/clientes/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!res.ok) throw new Error(await obtenerMensajeError(res, 'Error al eliminar cliente'));
            cargarClientes();
        } catch (err) {
            setError(err.message);
        }
    };

    const editarCliente = async (c) => {
        const nuevoNombre = prompt('Nuevo nombre:', c.nombre);
        if (!nuevoNombre) return;
        const nuevoCorreo = prompt('Nuevo correo:', c.correo);
        if (!nuevoCorreo) {
            setError('Error al actualizar cliente: el correo es obligatorio');
            return;
        }
        
        try {
            const res = await fetch(`http://localhost:3000/clientes/${c.id_cliente}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ nombre: nuevoNombre, correo: nuevoCorreo })
            });
            if (!res.ok) throw new Error(await obtenerMensajeError(res, 'Error al actualizar cliente'));
            cargarClientes();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Gestión de Clientes</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={crearCliente} style={{ marginBottom: '20px' }}>
                <input name="nombre" placeholder="Nombre" value={nuevo.nombre} onChange={handleChange} required />
                <input name="correo" type="email" placeholder="Correo" value={nuevo.correo} onChange={handleChange} required />
                <button type="submit">Agregar Cliente</button>
            </form>

            <table border="1" cellPadding="5">
                <thead>
                    <tr>
                        <th>ID</th><th>Nombre</th><th>Correo</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map(c => (
                        <tr key={c.id_cliente}>
                            <td>{c.id_cliente}</td>
                            <td>{c.nombre}</td>
                            <td>{c.correo}</td>
                            <td>
                                <button onClick={() => editarCliente(c)} style={{ marginRight: '5px' }}>Editar</button>
                                <button onClick={() => eliminarCliente(c.id_cliente)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
