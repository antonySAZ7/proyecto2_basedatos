import express from 'express';
import { pool } from '../db.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(requireRole('rol_reportes', 'rol_auditor'));

router.get('/usuarios', requireRole('rol_auditor'), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id_usuario, username, rol
            FROM usuario_app
            ORDER BY id_usuario
        `);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// jpin de detalle con producto
router.get('/detalle', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT dv.id_venta, p.nombre, dv.cantidad, dv.precio_unitario
      FROM detalle_venta dv
      JOIN producto p ON dv.id_producto = p.id_producto
    `);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/clientes-frecuentes', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT nombre
      FROM cliente
      WHERE id_cliente IN (
        SELECT id_cliente
        FROM venta
        WHERE total > 500
      )
    `);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/productos-vendidos', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT nombre
      FROM producto p
      WHERE EXISTS (
        SELECT 1
        FROM detalle_venta dv
        WHERE dv.id_producto = p.id_producto
      )
    `);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/top-productos', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT p.nombre, SUM(dv.cantidad) AS total_vendido
      FROM detalle_venta dv
      JOIN producto p ON dv.id_producto = p.id_producto
      GROUP BY p.nombre
      HAVING SUM(dv.cantidad) > 1
    `);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/top-clientes', async (req, res) => {
    try {
        const result = await pool.query(`
      WITH total_cliente AS (
        SELECT id_cliente, SUM(total) AS total_gastado
        FROM venta
        GROUP BY id_cliente
      )
      SELECT c.nombre, t.total_gastado
      FROM total_cliente t
      JOIN cliente c ON t.id_cliente = c.id_cliente
    `);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/vista', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM vista_ventas_detalle`);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
