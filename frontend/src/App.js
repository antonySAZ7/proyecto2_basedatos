import React, { useEffect, useState } from 'react';
import Productos from './components/Productos';
import Clientes from './components/Clientes';
import Reportes from './components/Reportes';
import Ventas from './components/Ventas';

const API_URL = 'http://localhost:3000';

const vistasPorRol = {
  rol_administrador: ['productos', 'clientes', 'reportes', 'ventas'],
  rol_vendedor: ['clientes', 'ventas'],
  rol_inventario: ['productos'],
  rol_reportes: ['reportes'],
  rol_auditor: ['reportes'],
};

const etiquetasRol = {
  rol_administrador: 'Administrador',
  rol_vendedor: 'Vendedor',
  rol_inventario: 'Inventario',
  rol_reportes: 'Reportes',
  rol_auditor: 'Auditor',
};

function App() {
  const [vista, setVista] = useState('productos');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const vistasPermitidas = user ? vistasPorRol[user.rol] || [] : [];

  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setUser(data.user);
          setVista((vistasPorRol[data.user.rol] || ['productos'])[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLoginChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(login),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo iniciar sesion');
      }

      setUser(data.user);
      setVista((vistasPorRol[data.user.rol] || ['productos'])[0]);
      setLogin({ username: '', password: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const cerrarSesion = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    setVista('productos');
  };

  if (loading) {
    return <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>Cargando...</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '420px', margin: '80px auto' }}>
        <h1>Sistema de Gestion de Tienda</h1>
        <h2>Iniciar sesion</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={iniciarSesion} style={{ display: 'grid', gap: '10px' }}>
          <input
            name="username"
            placeholder="Usuario"
            value={login.username}
            onChange={handleLoginChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contrasena"
            value={login.password}
            onChange={handleLoginChange}
            required
          />
          <button type="submit">Entrar</button>
        </form>
        <p style={{ marginTop: '20px' }}>
          Usuarios: admin_de_prueba, ventas_de_prueba, inventario_de_prueba, reportes_de_prueba, auditor_de_prueba.
          Contrasena: secret.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <h1>Sistema de Gestion de Tienda</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
          <span>
            Usuario: <strong>{user.username}</strong> | Rol: <strong>{etiquetasRol[user.rol] || user.rol}</strong>
          </span>
          <button onClick={cerrarSesion}>Cerrar sesion</button>
        </div>
        <nav style={{ display: 'flex', gap: '10px' }}>
          {vistasPermitidas.includes('productos') && (
            <button onClick={() => setVista('productos')} style={{ padding: '10px', cursor: 'pointer' }}>Productos crud</button>
          )}
          {vistasPermitidas.includes('clientes') && (
            <button onClick={() => setVista('clientes')} style={{ padding: '10px', cursor: 'pointer' }}>Clientes crud</button>
          )}
          {vistasPermitidas.includes('reportes') && (
            <button onClick={() => setVista('reportes')} style={{ padding: '10px', cursor: 'pointer' }}>Reportes sql</button>
          )}
          {vistasPermitidas.includes('ventas') && (
            <button onClick={() => setVista('ventas')} style={{ padding: '10px', cursor: 'pointer' }}>Transacciones</button>
          )}
        </nav>
      </header>

      <main>
        {vista === 'productos' && <Productos />}
        {vista === 'clientes' && <Clientes />}
        {vista === 'reportes' && <Reportes user={user} />}
        {vista === 'ventas' && <Ventas />}
      </main>
    </div>
  );
}

export default App;
