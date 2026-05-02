

-- Antony Saz 24710


-- es es archivo para cuando se inicie el docker, el volumen del docker lea la bd de postgres y se cree todo.


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
CREATE INDEX idx_producto_categoria
ON producto(id_categoria);

CREATE INDEX idx_venta_cliente
ON venta(id_cliente);


CREATE INDEX idx_detalle_producto
ON detalle_venta(id_producto);
INSERT INTO categoria (nombre) VALUES
('Electronica'),('Ropa'),('Alimentos'),('Hogar'),('Juguetes'),
('Deportes'),('Belleza'),('Automotriz'),('Tecnologia'),('Libros'),
('Musica'),('Oficina'),('Mascotas'),('Salud'),('Bebidas'),
('Accesorios'),('Calzado'),('Videojuegos'),('Herramientas'),('Jardin'),
('Viajes'),('Cocina'),('Arte'),('Fotografia'),('Instrumentos');


INSERT INTO proveedor (nombre, telefono) VALUES
('TechCorp','11111111'),('ModaPlus','22222222'),('FoodSupply','33333333'),
('HomeStore','44444444'),('ToyWorld','55555555'),
('SportZone','66666666'),('BeautyLine','77777777'),('AutoParts','88888888'),
('GadgetPro','99999999'),('BookHouse','10101010'),
('MusicShop','11112222'),('OfficeMax','12121212'),('PetCare','13131313'),
('HealthPlus','14141414'),('DrinkCo','15151515'),
('AccesoriesGT','16161616'),('ShoesWorld','17171717'),
('GameCenter','18181818'),('ToolsPro','19191919'),('GardenLife','20202020'),
('TravelStore','21212121'),('KitchenPro','22223333'),
('ArtGallery','23232323'),('PhotoShop','24242424'),('InstrumentHub','25252525');



INSERT INTO cliente (nombre, correo) VALUES
('Juan Perez','juan@mail.com'),('Maria Lopez','maria@mail.com'),
('Carlos Ruiz','carlos@mail.com'),('Ana Torres','ana@mail.com'),
('Luis Gomez','luis@mail.com'),
('Pedro Martinez','pedro@mail.com'),('Sofia Reyes','sofia@mail.com'),
('Miguel Castro','miguel@mail.com'),('Laura Diaz','laura@mail.com'),
('Jose Morales','jose@mail.com'),
('Andrea Flores','andrea@mail.com'),('Fernando Ortiz','fernando@mail.com'),
('Patricia Ramos','patricia@mail.com'),('Diego Silva','diego@mail.com'),
('Elena Cruz','elena@mail.com'),
('Roberto Vega','roberto@mail.com'),('Daniela Soto','daniela@mail.com'),
('Ricardo Herrera','ricardo@mail.com'),('Valeria Luna','valeria@mail.com'),
('Jorge Castillo','jorge@mail.com'),
('Paola Mendez','paola@mail.com'),('Oscar Pineda','oscar@mail.com'),
('Gabriela Rivas','gaby@mail.com'),('Alberto Salazar','alberto@mail.com'),
('Monica Estrada','monica@mail.com');



INSERT INTO empleado (nombre) VALUES
('Empleado 1'),('Empleado 2'),('Empleado 3'),('Empleado 4'),('Empleado 5'),
('Empleado 6'),('Empleado 7'),('Empleado 8'),('Empleado 9'),('Empleado 10'),
('Empleado 11'),('Empleado 12'),('Empleado 13'),('Empleado 14'),('Empleado 15'),
('Empleado 16'),('Empleado 17'),('Empleado 18'),('Empleado 19'),('Empleado 20'),
('Empleado 21'),('Empleado 22'),('Empleado 23'),('Empleado 24'),('Empleado 25');


INSERT INTO producto (nombre, precio, stock, id_categoria, id_proveedor) VALUES
('Laptop',5000,10,1,1),
('Camisa',200,50,2,2),
('Pan',10,100,3,3),
('Silla',300,20,4,4),
('Muñeca',150,30,5,5),
('Balon',120,40,6,6),
('Perfume',250,15,7,7),
('Bateria',400,25,8,8),
('Tablet',2000,12,9,9),
('Libro A',80,60,10,10),
('Guitarra',1500,5,11,11),
('Escritorio',800,8,12,12),
('Comida perro',100,35,13,13),
('Vitaminas',90,20,14,14),
('Coca Cola',15,200,15,15),
('Reloj',300,10,16,16),
('Zapatos',400,18,17,17),
('PS5',6000,6,18,18),
('Taladro',700,14,19,19),
('Maceta',50,45,20,20),
('Maleta',900,9,21,21),
('Olla',250,11,22,22),
('Pintura',100,13,23,23),
('Camara',3500,4,24,24),
('Piano',10000,2,25,25);


INSERT INTO venta (fecha, total, id_cliente, id_empleado) VALUES
(NOW(),1000,1,1),(NOW(),500,2,2),(NOW(),300,3,3),(NOW(),200,4,4),(NOW(),700,5,5),
(NOW(),800,6,6),(NOW(),150,7,7),(NOW(),250,8,8),(NOW(),600,9,9),(NOW(),900,10,10),
(NOW(),400,11,11),(NOW(),100,12,12),(NOW(),200,13,13),(NOW(),300,14,14),(NOW(),450,15,15),
(NOW(),550,16,16),(NOW(),650,17,17),(NOW(),750,18,18),(NOW(),850,19,19),(NOW(),950,20,20),
(NOW(),150,21,21),(NOW(),250,22,22),(NOW(),350,23,23),(NOW(),450,24,24),(NOW(),550,25,25);



INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES
(1,1,1,5000),(2,2,2,200),(3,3,5,10),(4,4,1,300),(5,5,2,150),
(6,6,1,120),(7,7,1,250),(8,8,1,400),(9,9,1,2000),(10,10,2,80),
(11,11,1,1500),(12,12,1,800),(13,13,2,100),(14,14,1,90),(15,15,3,15),
(16,16,1,300),(17,17,1,400),(18,18,1,6000),(19,19,1,700),(20,20,2,50),
(21,21,1,900),(22,22,1,250),(23,23,1,100),(24,24,1,3500),(25,25,1,10000);

CREATE VIEW vista_ventas_detalle AS SELECT v.id_venta, v.fecha, v.total, c.nombre as cliente, p.nombre as producto, dv.cantidad, dv.precio_unitario FROM venta v JOIN cliente c ON v.id_cliente = c.id_cliente JOIN detalle_venta dv ON v.id_venta = dv.id_venta JOIN producto p ON dv.id_producto = p.id_producto;
