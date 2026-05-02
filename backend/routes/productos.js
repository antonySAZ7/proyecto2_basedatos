import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT p.id_producto, p.nombre, p.precio, p.stock,
             c.nombre AS categoria,
             pr.nombre AS proveedor
      FROM producto p
      JOIN categoria c ON p.id_categoria = c.id_categoria
      JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
    `);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nombre, precio, stock, id_categoria, id_proveedor } = req.body;
        const result = await pool.query(
            'INSERT INTO producto (nombre, precio, stock, id_categoria, id_proveedor) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, precio, stock, id_categoria, id_proveedor]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, stock, id_categoria, id_proveedor } = req.body;
        const result = await pool.query(
            'UPDATE producto SET nombre=$1, precio=$2, stock=$3, id_categoria=$4, id_proveedor=$5 WHERE id_producto=$6 RETURNING *',
            [nombre, precio, stock, id_categoria, id_proveedor, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM producto WHERE id_producto=$1', [id]);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;