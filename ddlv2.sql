

-- Antony Saz 24710
CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);





CREATE TABLE proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20)
);



CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE
);



CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);


CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    id_categoria INT NOT NULL,
    id_proveedor INT NOT NULL,

    CONSTRAINT fk_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria),

    CONSTRAINT fk_proveedor
        FOREIGN KEY (id_proveedor)
        REFERENCES proveedor(id_proveedor)
);



CREATE TABLE venta (
    id_venta SERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    id_cliente INT NOT NULL,
    id_empleado INT NOT NULL,

    CONSTRAINT fk_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente),

    CONSTRAINT fk_empleado
        FOREIGN KEY (id_empleado)
        REFERENCES empleado(id_empleado)
);



CREATE TABLE detalle_venta (
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_venta, id_producto),
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);
