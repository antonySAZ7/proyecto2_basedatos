import express from 'express';
import { Cliente, DetalleVenta, sequelize, Venta } from '../models/index.js';
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

        if (!nombre || !correo) {
            return res.status(400).json({ error: 'Nombre y correo son obligatorios' });
        }

        const cliente = await Cliente.create({ nombre, correo });
        res.json(cliente);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Ya existe un cliente con ese correo' });
        }

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

        if (!nombre || !correo) {
            return res.status(400).json({ error: 'Nombre y correo son obligatorios para editar el cliente' });
        }

        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        await cliente.update({ nombre, correo });
        res.json(cliente);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Ya existe otro cliente con ese correo' });
        }

        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', requireRole('rol_vendedor'), async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;

        const cliente = await Cliente.findByPk(id, { transaction });
        if (!cliente) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        const ventas = await Venta.findAll({
            attributes: ['id_venta'],
            where: { id_cliente: id },
            transaction,
        });
        const idsVentas = ventas.map(venta => venta.id_venta);

        if (idsVentas.length > 0) {
            await DetalleVenta.destroy({
                where: { id_venta: idsVentas },
                transaction,
            });

            await Venta.destroy({
                where: { id_cliente: id },
                transaction,
            });
        }

        await cliente.destroy({ transaction });
        await transaction.commit();

        res.json({
            message: idsVentas.length > 0
                ? 'Cliente eliminado junto con sus ventas relacionadas'
                : 'Cliente eliminado',
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: `No se pudo eliminar el cliente: ${error.message}` });
    }
});

export default router;
