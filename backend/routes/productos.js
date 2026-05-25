import express from 'express';
import { Categoria, Producto, Proveedor } from '../models/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        const productos = await Producto.findAll({
            attributes: ['id_producto', 'nombre', 'precio', 'stock', 'id_categoria', 'id_proveedor'],
            include: [
                {
                    model: Categoria,
                    as: 'categoria',
                    attributes: ['nombre'],
                },
                {
                    model: Proveedor,
                    as: 'proveedor',
                    attributes: ['nombre'],
                },
            ],
            order: [['id_producto', 'ASC']],
        });

        const respuesta = productos.map(producto => ({
            id_producto: producto.id_producto,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            id_categoria: producto.id_categoria,
            id_proveedor: producto.id_proveedor,
            categoria: producto.categoria?.nombre,
            proveedor: producto.proveedor?.nombre,
        }));

        res.json(respuesta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', requireRole('rol_inventario'), async (req, res) => {
    try {
        const { nombre, precio, stock, id_categoria, id_proveedor } = req.body;
        const producto = await Producto.create({ nombre, precio, stock, id_categoria, id_proveedor });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/reponer', requireRole('rol_inventario'), async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        const result = await Producto.sequelize.query(
            'CALL sp_reponer_stock($1::INT, $2::INT, NULL::INT, NULL::TEXT)',
            {
                bind: [id, cantidad],
            }
        );

        const salida = result[0][0];
        res.json({
            message: salida.p_mensaje,
            stock: salida.p_stock_actual,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/precio', requireRole('rol_inventario'), async (req, res) => {
    try {
        const { id } = req.params;
        const { precio } = req.body;

        const result = await Producto.sequelize.query(
            'CALL sp_actualizar_precio_producto($1::INT, $2::DECIMAL, NULL::TEXT)',
            {
                bind: [id, precio],
            }
        );

        const salida = result[0][0];
        res.json({ message: salida.p_mensaje });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', requireRole('rol_inventario'), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, stock, id_categoria, id_proveedor } = req.body;

        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await producto.update({ nombre, precio, stock, id_categoria, id_proveedor });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', requireRole('rol_inventario'), async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await producto.destroy();
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
