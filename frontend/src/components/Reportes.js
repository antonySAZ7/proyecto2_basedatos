import React, { useState } from 'react';

export default function Reportes({ user }) {
    const [datos, setDatos] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [error, setError] = useState(null);
    const esAuditor = user?.rol === 'rol_auditor';

    const cargarReporte = async (url, nombreReporte) => {
        try {
            const res = await fetch(`http://localhost:3000${url}`, { credentials: 'include' });
            if (!res.ok) throw new Error('Error al cargar reporte');
            const data = await res.json();
            setDatos(data);
            setTitulo(nombreReporte);
            setError(null);
        } catch (err) {
            setError(err.message);
            setDatos([]);
        }
    };

    const descargarCSV = () => {
        if (datos.length === 0) return;
        const cabeceras = Object.keys(datos[0]).join(',');
        const filas = datos.map(fila => Object.values(fila).join(','));
        const csvContent = "data:text/csv;charset=utf-8," + cabeceras + "\n" + filas.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "reporte.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div>
            <h2>Reportes y Consultas SQL</h2>
            <p>Selecciona un reporte para visualizar los resultados de las queries complejas de la base de datos.</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => cargarReporte('/ventas', 'JOIN múltiple (Ventas)')}>Ver Ventas (JOIN)</button>
                <button onClick={() => cargarReporte('/reportes/clientes-frecuentes', 'Subquery IN (Clientes Frecuentes)')}>Clientes Frecuentes (IN)</button>
                <button onClick={() => cargarReporte('/reportes/productos-vendidos', 'Subquery EXISTS (Productos)')}>Productos Vendidos (EXISTS)</button>
                <button onClick={() => cargarReporte('/reportes/top-productos', 'GROUP BY y HAVING (Top Productos)')}>Top Productos (GROUP BY)</button>
                <button onClick={() => cargarReporte('/reportes/top-clientes', 'CTE (Top Clientes)')}>Top Clientes (CTE)</button>
                <button onClick={() => cargarReporte('/reportes/vista', 'Vista SQL (Detalle de Ventas)')}>Vista (Detalle)</button>
                {esAuditor && (
                    <button onClick={() => cargarReporte('/reportes/usuarios', 'Auditoria (Usuarios del sistema)')}>
                        Usuarios del sistema
                    </button>
                )}
            </div>

            {datos.length > 0 && (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3>{titulo}</h3>
                        <button onClick={descargarCSV} style={{ height: '30px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                            Descargar CSV
                        </button>
                    </div>
                    <table border="1" cellPadding="5" style={{ marginTop: '10px', width: '100%', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f2f2f2' }}>
                            <tr>
                                {Object.keys(datos[0]).map(key => <th key={key}>{key}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {datos.map((fila, i) => (
                                <tr key={i}>
                                    {Object.values(fila).map((val, j) => <td key={j}>{val}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
