import React, { useState, useEffect } from 'react';

export default function Ventas() {
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);

    const [idCliente, setIdCliente] = useState('');
    const [idEmpleado, setIdEmpleado] = useState('1');

    const [idProductoSeleccionado, setIdProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);

    const [carrito, setCarrito] = useState([]);

    // Estados para nuevo cliente
    const [mostrarNuevoCliente, setMostrarNuevoCliente] = useState(false);
    const [nuevoClienteNombre, setNuevoClienteNombre] = useState('');
    const [nuevoClienteCorreo, setNuevoClienteCorreo] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/productos')
            .then(res => res.json())
            .then(data => {
                setProductos(data);
                if (data.length > 0) setIdProductoSeleccionado(data[0].id_producto);
            });

        fetch('http://localhost:3000/clientes')
            .then(res => res.json())
            .then(data => {
                setClientes(data);
                if (data.length > 0) setIdCliente(data[0].id_cliente);
            });
    }, []);

    const agregarAlCarrito = () => {
        const prod = productos.find(p => p.id_producto == idProductoSeleccionado);
        if (!prod) return;

        if (cantidad > prod.stock) {
            setError(`No hay suficiente stock. Quedan ${prod.stock} disponibles.`);
            return;
        }

        const existente = carrito.find(item => item.id_producto == prod.id_producto);
        if (existente) {
            if (existente.cantidad + cantidad > prod.stock) {
                setError(`Excede el stock disponible sumando lo que ya está en el carrito.`);
                return;
            }
            setCarrito(carrito.map(item =>
                item.id_producto == prod.id_producto ? { ...item, cantidad: item.cantidad + parseInt(cantidad) } : item
            ));
        } else {
            setCarrito([...carrito, { id_producto: prod.id_producto, nombre: prod.nombre, cantidad: parseInt(cantidad), precio: prod.precio }]);
        }
        setError('');
        setMensaje('Producto agregado al carrito.');
    };

    const quitarDelCarrito = (id) => {
        setCarrito(carrito.filter(item => item.id_producto !== id));
    };

    const crearCliente = async () => {
        if (!nuevoClienteNombre || !nuevoClienteCorreo) {
            setError('Nombre y correo son obligatorios para crear cliente.');
            return;
        }
        try {
            const res = await fetch('http://localhost:3000/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nuevoClienteNombre, correo: nuevoClienteCorreo })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al crear cliente');
            
            // Refrescar lista de clientes
            const resClientes = await fetch('http://localhost:3000/clientes');
            const dataClientes = await resClientes.json();
            setClientes(dataClientes);
            
            setIdCliente(data.id_cliente); // Seleccionar el recién creado
            setMostrarNuevoCliente(false);
            setNuevoClienteNombre('');
            setNuevoClienteCorreo('');
            setMensaje('Cliente creado exitosamente');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const realizarVenta = async () => {
        if (carrito.length === 0) {
            setError('El carrito está vacío.');
            return;
        }

        try {
            const venta = {
                id_cliente: parseInt(idCliente),
                id_empleado: parseInt(idEmpleado),
                productos: carrito
            };

            const res = await fetch('http://localhost:3000/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(venta)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error en la transacción');
            }

            setMensaje(data.message);
            setError('');
            setCarrito([]);

            // refrescar productos para ver nuevo stock
            fetch('http://localhost:3000/productos').then(r => r.json()).then(d => setProductos(d));

        } catch (err) {
            setError(err.message);
            setMensaje('');
        }
    };

    const totalCarrito = carrito.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);

    return (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
            <h2> Nueva Venta (Punto de Venta)</h2>
            <p>Selecciona un cliente, los productos y realiza la transaccion. El stock se reducira automáticamente usando BEGIN, COMMIT y ROLLBACK.</p>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <label>Cliente:</label><br />
                    <select value={idCliente} onChange={(e) => setIdCliente(e.target.value)} style={{ padding: '8px' }}>
                        {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}
                    </select>
                    <button onClick={() => setMostrarNuevoCliente(!mostrarNuevoCliente)} style={{ marginLeft: '10px', padding: '8px', cursor: 'pointer' }}>
                        + Nuevo
                    </button>
                    {mostrarNuevoCliente && (
                        <div style={{ marginTop: '10px', padding: '10px', border: '1px dashed #ccc', background: '#fff' }}>
                            <input type="text" placeholder="Nombre" value={nuevoClienteNombre} onChange={e => setNuevoClienteNombre(e.target.value)} style={{ padding: '5px', marginRight: '5px' }} />
                            <input type="email" placeholder="Correo" value={nuevoClienteCorreo} onChange={e => setNuevoClienteCorreo(e.target.value)} style={{ padding: '5px', marginRight: '5px' }} />
                            <button onClick={crearCliente} style={{ padding: '5px 10px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>Guardar</button>
                        </div>
                    )}
                </div>
                <div>
                    <label>ID Empleado (1-25):</label><br />
                    <input type="number" min="1" max="25" value={idEmpleado} onChange={(e) => setIdEmpleado(e.target.value)} style={{ padding: '8px', width: '80px' }} />
                </div>
            </div>

            <div style={{ background: '#fff', padding: '15px', border: '1px solid #ccc', marginBottom: '20px' }}>
                <h3>Agregar Producto</h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <div>
                        <label>Producto:</label><br />
                        <select value={idProductoSeleccionado} onChange={(e) => setIdProductoSeleccionado(e.target.value)} style={{ padding: '8px', width: '200px' }}>
                            {productos.map(p => (
                                <option key={p.id_producto} value={p.id_producto}>
                                    {p.nombre} - ${p.precio} (Stock: {p.stock})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Cantidad:</label><br />
                        <input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(parseInt(e.target.value))} style={{ padding: '8px', width: '80px' }} />
                    </div>
                    <button onClick={agregarAlCarrito} style={{ padding: '8px 15px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>+ Agregar</button>
                </div>
            </div>

            <h3>Carrito de Compras</h3>
            {carrito.length === 0 ? <p>No hay productos en el carrito.</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Producto</th>
                            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Cantidad</th>
                            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Precio U.</th>
                            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Subtotal</th>
                            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carrito.map(item => (
                            <tr key={item.id_producto} style={{ textAlign: 'center' }}>
                                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{item.nombre}</td>
                                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{item.cantidad}</td>
                                <td style={{ padding: '10px', border: '1px solid #ccc' }}>${item.precio}</td>
                                <td style={{ padding: '10px', border: '1px solid #ccc' }}>${(item.cantidad * item.precio).toFixed(2)}</td>
                                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                    <button onClick={() => quitarDelCarrito(item.id_producto)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px' }}>X</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <h3>Total: ${totalCarrito.toFixed(2)}</h3>

            <button onClick={realizarVenta} style={{ padding: '15px', fontSize: '16px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', width: '100%', marginTop: '10px' }}>
                Completar Venta
            </button>

            {mensaje && <p style={{ color: 'green', marginTop: '15px', fontWeight: 'bold' }}> {mensaje}</p>}
            {error && <p style={{ color: 'red', marginTop: '15px', fontWeight: 'bold' }}>{error}</p>}
        </div>
    );
}
