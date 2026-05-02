CREATE INDEX idx_producto_categoria
ON producto(id_categoria);

CREATE INDEX idx_venta_cliente
ON venta(id_cliente);


CREATE INDEX idx_detalle_producto
ON detalle_venta(id_producto);