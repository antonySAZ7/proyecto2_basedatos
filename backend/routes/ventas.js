import express from 'express';
import { pool } from '../db.js';

const router = express.Router();


// join de ventas con clientes y lod empleados
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT v.id_venta, v.fecha, v.total,
             c.nombre AS cliente,
             e.nombre AS empleado
      FROM venta v
      JOIN cliente c ON v.id_cliente = c.id_cliente
      JOIN empleado e ON v.id_empleado = e.id_empleado
    `);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.post('/', async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { id_cliente, id_empleado, productos } = req.body;

        const ventaRes = await client.query(
            `INSERT INTO venta (fecha, total, id_cliente, id_empleado)
       VALUES (NOW(), 0, $1, $2)
       RETURNING id_venta`,
            [id_cliente, id_empleado]
        );

        const idVenta = ventaRes.rows[0].id_venta;
        let total = 0;

        for (let p of productos) {
            // verificar stock
            const stockRes = await client.query('SELECT stock FROM producto WHERE id_producto = $1', [p.id_producto]);
            if (stockRes.rows.length === 0) {
                throw new Error(`Producto ${p.id_producto} no encontrado`);
            }
            if (stockRes.rows[0].stock < p.cantidad) {
                throw new Error(`Stock insuficiente para el producto ${p.id_producto}. Quedan ${stockRes.rows[0].stock}.`);
            }

            // insertar detalle
            await client.query(
                `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario)
                 VALUES ($1, $2, $3, $4)`,
                [idVenta, p.id_producto, p.cantidad, p.precio]
            );

            // reducir stock
            await client.query(
                `UPDATE producto SET stock = stock - $1 WHERE id_producto = $2`,
                [p.cantidad, p.id_producto]
            );

            total += p.cantidad * p.precio;
        }

        await client.query(
            `UPDATE venta SET total = $1 WHERE id_venta = $2`,
            [total, idVenta]
        );

        await client.query('COMMIT');

        res.json({ message: 'Venta creada correctamente. Stock actualizado.' });

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Error en la transacción' });
    } finally {
        client.release();
    }
});

export default router;