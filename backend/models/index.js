//se utiliza sequelize como un orm para node y esto ayuda con las tablas usando modelos esto para evitar el sql repetitivo


import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),
        dialect: 'postgres',
        logging: false,
    }
);

export const Categoria = sequelize.define('Categoria', {
    id_categoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: 'categoria',
    timestamps: false,
});

export const Proveedor = sequelize.define('Proveedor', {
    id_proveedor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING(20),
    },
}, {
    tableName: 'proveedor',
    timestamps: false,
});

export const Cliente = sequelize.define('Cliente', {
    id_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    correo: {
        type: DataTypes.STRING(100),
        unique: true,
    },
}, {
    tableName: 'cliente',
    timestamps: false,
});

export const Empleado = sequelize.define('Empleado', {
    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: 'empleado',
    timestamps: false,
});

export const Producto = sequelize.define('Producto', {
    id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_proveedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'producto',
    timestamps: false,
});

export const Venta = sequelize.define('Venta', {
    id_venta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_empleado: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'venta',
    timestamps: false,
});

export const DetalleVenta = sequelize.define('DetalleVenta', {
    id_venta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    tableName: 'detalle_venta',
    timestamps: false,
});

export const UsuarioApp = sequelize.define('UsuarioApp', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    rol: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'usuario_app',
    timestamps: false,
});

Categoria.hasMany(Producto, { foreignKey: 'id_categoria', as: 'productos' });
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });

Proveedor.hasMany(Producto, { foreignKey: 'id_proveedor', as: 'productos' });
Producto.belongsTo(Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });

Cliente.hasMany(Venta, { foreignKey: 'id_cliente', as: 'ventas' });
Venta.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });

Empleado.hasMany(Venta, { foreignKey: 'id_empleado', as: 'ventas' });
Venta.belongsTo(Empleado, { foreignKey: 'id_empleado', as: 'empleado' });

Venta.hasMany(DetalleVenta, { foreignKey: 'id_venta', as: 'detalles' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'id_venta', as: 'venta' });

Producto.hasMany(DetalleVenta, { foreignKey: 'id_producto', as: 'detalles' });
DetalleVenta.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });

export async function probarConexionOrm() {
    await sequelize.authenticate();
    console.log('ORM conectado a PostgreSQL');
}

export default {
    sequelize,
    Categoria,
    Proveedor,
    Cliente,
    Empleado,
    Producto,
    Venta,
    DetalleVenta,
    UsuarioApp,
};
