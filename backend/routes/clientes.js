import express from 'express';
import { Cliente } from '../models/index.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireRole('rol_vendedor', 'rol_reportes', 'rol_auditor'), async (req, res) => {
    try {
        const clientes = await Cliente.findAll({
            order: [['id_cliente', 'ASC']]
        });
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', requireRole('rol_vendedor'), async (req, res) => {
    try {
        const { nombre, correo } = req.body;
        const cliente = await Cliente.create({ nombre, correo });
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/seguro', requireRole('rol_vendedor'), async (req, res) => {
    try {
        const { nombre, correo } = req.body;

        const result = await Cliente.sequelize.query(
            'CALL sp_crear_cliente_seguro($1::TEXT, $2::TEXT, NULL::INT, NULL::TEXT)',
            {
                bind: [nombre, correo],
            }
        );

        const salida = result[0][0];

        if (!salida.p_id_cliente_creado) {
            return res.status(400).json({ error: salida.p_mensaje });
        }

        res.json({
            message: salida.p_mensaje,
            id_cliente: salida.p_id_cliente_creado,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', requireRole('rol_vendedor'), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, correo } = req.body;

        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        await cliente.update({ nombre, correo });
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', requireRole('rol_vendedor'), async (req, res) => {
    try {
        const { id } = req.params;

        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        await cliente.destroy();
        res.json({ message: 'Cliente eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
