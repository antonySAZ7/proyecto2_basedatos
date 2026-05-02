import React, { useState } from 'react';
import Productos from './components/Productos';
import Clientes from './components/Clientes';
import Reportes from './components/Reportes';
import Ventas from './components/Ventas';

function App() {
  const [vista, setVista] = useState('productos');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <h1>Sistema de Gestión de Tienda</h1>
        <nav style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setVista('productos')} style={{ padding: '10px', cursor: 'pointer' }}>Productos crud </button>
          <button onClick={() => setVista('clientes')} style={{ padding: '10px', cursor: 'pointer' }}>Clientes crud </button>
          <button onClick={() => setVista('reportes')} style={{ padding: '10px', cursor: 'pointer' }}>Reportes sql</button>
          <button onClick={() => setVista('ventas')} style={{ padding: '10px', cursor: 'pointer' }}>Transacciones</button>
        </nav>
      </header>

      <main>
        {vista === 'productos' && <Productos />}
        {vista === 'clientes' && <Clientes />}
        {vista === 'reportes' && <Reportes />}
        {vista === 'ventas' && <Ventas />}
      </main>
    </div>
  );
}

export default App;