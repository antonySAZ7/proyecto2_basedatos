import express from 'express';
import { pool } from './db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT v.id_venta,
                   v.fecha,
                   v.total,
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

router.post('/', async (req, res) => {
    const client = await pool.connect();

    try {
        const { id_cliente, id_empleado, productos } = req.body;

        if (!id_cliente || !id_empleado || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({
                error: 'debes enviar id_cliente, id_empleado y al menos un producto'
            });
        }

        await client.query('BEGIN');

        const venta = await client.query(
            `INSERT INTO venta (fecha, total, id_cliente, id_empleado)
             VALUES (NOW(), 0, $1, $2)
             RETURNING id_venta`,
            [id_cliente, id_empleado]
        );

        const idVenta = venta.rows[0].id_venta;
        let total = 0;

        for (const producto of productos) {
            await client.query(
                `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario)
                 VALUES ($1, $2, $3, $4)`,
                [idVenta, producto.id_producto, producto.cantidad, producto.precio]
            );

            total += producto.cantidad * producto.precio;
        }

        await client.query(
            `UPDATE venta
             SET total = $1
             WHERE id_venta = $2`,
            [total, idVenta]
        );

        await client.query('COMMIT');

        res.json({
            message: 'venta creada correctamente',
            id_venta: idVenta,
            total
        });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'error en la transaccion' });
    } finally {
        client.release();
    }
});

export default router;
