import React, { useState, useEffect, useCallback } from 'react';

const API_URL = `http://${window.location.hostname || 'localhost'}:3000`;

const obtenerMensajeError = async (res, mensajeBase) => {
    const data = await res.json().catch(() => ({}));
    return data.error ? `${mensajeBase}: ${data.error}` : mensajeBase;
};

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [nuevo, setNuevo] = useState({ nombre: '', precio: '', stock: '', id_categoria: 1, id_proveedor: 1 });

    const cargarProductos = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/productos`, { credentials: 'include' });
            if (!res.ok) throw new Error(await obtenerMensajeError(res, 'Error al cargar productos'));
            const data = await res.json();
            setProductos(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        cargarProductos();
    }, [cargarProductos]);

    const handleChange = (e) => {
        setNuevo({ ...nuevo, [e.target.name]: e.target.value });
    };

    const crearProducto = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/productos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(nuevo)
            });
            if (!res.ok) throw new Error(await obtenerMensajeError(res, 'Error al crear producto'));
            setNuevo({ nombre: '', precio: '', stock: '', id_categoria: 1, id_proveedor: 1 });
            cargarProductos();
        } catch (err) {
            setError(err.message);
        }
    };

    const eliminarProducto = async (id) => {
        try {
            const res = await fetch(`${API_URL}/productos/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!res.ok) throw new Error(await obtenerMensajeError(res, 'Error al eliminar producto'));
            cargarProductos();
        } catch (err) {
            setError(err.message);
        }
    };

    const editarProducto = async (p) => {
        const nuevoNombre = prompt('Nuevo nombre:', p.nombre);
        if (!nuevoNombre) return;
        const nuevoPrecio = prompt('Nuevo precio:', p.precio);
        const nuevoStock = prompt('Nuevo stock:', p.stock);
        if (!nuevoPrecio || nuevoStock === null || nuevoStock === '') {
            setError('Error al actualizar producto: precio y stock son obligatorios');
            return;
        }
        
        try {
            const res = await fetch(`${API_URL}/productos/${p.id_producto}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ ...p, nombre: nuevoNombre, precio: nuevoPrecio, stock: nuevoStock })
            });
            if (!res.ok) throw new Error(await obtenerMensajeError(res, 'Error al actualizar producto'));
            cargarProductos();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Gestión de Productos</h2>
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={crearProducto} style={{ marginBottom: '20px' }}>
                <input name="nombre" placeholder="Nombre" value={nuevo.nombre} onChange={handleChange} required />
                <input name="precio" type="number" placeholder="Precio" value={nuevo.precio} onChange={handleChange} required />
                <input name="stock" type="number" placeholder="Stock" value={nuevo.stock} onChange={handleChange} required />
                <button type="submit">Agregar Producto</button>
            </form>

            <table border="1" cellPadding="5">
                <thead>
                    <tr>
                        <th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(p => (
                        <tr key={p.id_producto}>
                            <td>{p.id_producto}</td>
                            <td>{p.nombre}</td>
                            <td>{p.precio}</td>
                            <td>{p.stock}</td>
                            <td>
                                <button onClick={() => editarProducto(p)} style={{ marginRight: '5px' }}>Editar</button>
                                <button onClick={() => eliminarProducto(p.id_producto)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
