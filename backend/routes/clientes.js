import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cliente');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nombre, correo } = req.body;
        const result = await pool.query(
            'INSERT INTO cliente (nombre, correo) VALUES ($1, $2) RETURNING *',
            [nombre, correo]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, correo } = req.body;
        const result = await pool.query(
            'UPDATE cliente SET nombre=$1, correo=$2 WHERE id_cliente=$3 RETURNING *',
            [nombre, correo, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM cliente WHERE id_cliente=$1', [id]);
        res.json({ message: 'Cliente eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
