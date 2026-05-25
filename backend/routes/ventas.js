import express from 'express';
import { pool } from '../db.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireRole('rol_vendedor', 'rol_reportes', 'rol_auditor'), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT v.id_venta, v.fecha, v.total,
                   c.nombre AS cliente,
                   e.nombre AS empleado
            FROM venta v
            JOIN cliente c ON v.id_cliente = c.id_cliente
            JOIN empleado e ON v.id_empleado = e.id_empleado
            ORDER BY v.id_venta DESC
        `);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', requireRole('rol_vendedor'), async (req, res) => {
    try {
        const { id_cliente, id_empleado, productos } = req.body;

        if (!id_cliente || !id_empleado || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ error: 'Debes enviar cliente, empleado y al menos un producto' });
        }

        const productosVenta = productos.map(producto => ({
            id_producto: producto.id_producto,
            cantidad: producto.cantidad,
        }));

        const result = await pool.query(
            `CALL sp_crear_venta(
                $1::INT,
                $2::INT,
                $3::JSONB,
                NULL::INT,
                NULL::DECIMAL,
                NULL::TEXT
            )`,
            [id_cliente, id_empleado, JSON.stringify(productosVenta)]
        );

        const salida = result.rows[0];

        if (!salida.p_id_venta) {
            return res.status(400).json({ error: salida.p_mensaje || 'No se pudo crear la venta' });
        }

        res.json({
            message: salida.p_mensaje,
            id_venta: salida.p_id_venta,
            total: salida.p_total,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/cancelar', requireRole('rol_vendedor'), async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'CALL sp_cancelar_venta($1::INT, NULL::TEXT)',
            [id]
        );

        const salida = result.rows[0];
        res.json({ message: salida.p_mensaje });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
