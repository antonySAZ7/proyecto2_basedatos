# Proyecto 3 - Bases de Datos 1

Antony Saz 24710

Aplicacion web para gestionar inventario, clientes, ventas y reportes de una tienda. Este proyecto extiende el Proyecto 2 agregando seguridad por roles en PostgreSQL, autenticacion con sesion, uso de ORM y stored procedures para operaciones criticas.

## Requisitos

- Docker y Docker Compose
- Node.js opcional para desarrollo local

## Levantar el proyecto

Toda la infraestructura esta dockerizada. Desde la raiz del proyecto ejecuta:

```bash
docker compose up --build
```

Si necesitas reconstruir la base desde cero para que se ejecute nuevamente `init.sql`:

```bash
docker compose down -v
docker compose up --build
```

Servicios:

- PostgreSQL: puerto `5432`
- Backend Express: puerto `3000`
- Frontend React: puerto `3001`

Aplicacion:

```text
http://localhost:3001
```

## Credenciales de base de datos

Credenciales obligatorias para calificacion:

```env
DB_USER=proy3
DB_PASSWORD=secret
DB_NAME=tienda_db
DB_PORT=5432
```

## Usuarios de prueba

Todos los usuarios usan la contrasena:

```text
secret
```

| Usuario | Rol |
| --- | --- |
| `admin_de_prueba` | `rol_administrador` |
| `ventas_de_prueba` | `rol_vendedor` |
| `inventario_de_prueba` | `rol_inventario` |
| `reportes_de_prueba` | `rol_reportes` |
| `auditor_de_prueba` | `rol_auditor` |

## Roles y permisos

Los roles se crean en PostgreSQL con `CREATE ROLE` dentro de `init.sql`. Los permisos se asignan con `GRANT` y `REVOKE`.

| Rol | Permisos principales |
| --- | --- |
| `rol_administrador` | Lectura, insercion, actualizacion, eliminacion y ejecucion sobre todos los objetos principales. |
| `rol_vendedor` | Lectura de clientes/productos/empleados, gestion de clientes, creacion y cancelacion de ventas mediante stored procedures. |
| `rol_inventario` | Gestion de productos, categorias y proveedores; reposicion de stock y actualizacion de precios mediante stored procedures. |
| `rol_reportes` | Solo lectura de tablas y vista necesarias para reportes operativos. |
| `rol_auditor` | Solo lectura de reportes y usuarios del sistema sin exponer `password_hash`. |

## Vistas por rol

| Rol | Vistas disponibles |
| --- | --- |
| Administrador | Productos, clientes, reportes y ventas |
| Vendedor | Clientes y transacciones |
| Inventario | Productos |
| Reportes | Reportes SQL |
| Auditor | Reportes SQL y reporte de usuarios del sistema |

## ORM

El backend usa Sequelize como ORM. Los modelos estan definidos en:

```text
backend/models/index.js
```

El CRUD de clientes y productos usa Sequelize para operaciones como:

- `findAll`
- `findByPk`
- `create`
- `update`
- `destroy`

## Stored procedures

El archivo `init.sql` crea los siguientes stored procedures:

| Procedure | Endpoint backend | Proposito |
| --- | --- | --- |
| `sp_crear_venta` | `POST /ventas` | Crea una venta, inserta detalle, valida stock, descuenta inventario y maneja transaccion con `COMMIT` / `ROLLBACK`. |
| `sp_cancelar_venta` | `POST /ventas/:id/cancelar` | Cancela una venta y restaura stock. |
| `sp_reponer_stock` | `POST /productos/:id/reponer` | Aumenta el stock de un producto. |
| `sp_actualizar_precio_producto` | `PUT /productos/:id/precio` | Actualiza precio de producto con validacion. |
| `sp_crear_cliente_seguro` | `POST /clientes/seguro` | Crea cliente con manejo de excepciones por correo duplicado. |

## Reportes SQL

La aplicacion conserva los reportes del Proyecto 2:

- Ventas con `JOIN`
- Clientes frecuentes con subquery `IN`
- Productos vendidos con `EXISTS`
- Top productos con `GROUP BY` y `HAVING`
- Top clientes con `CTE`
- Vista `vista_ventas_detalle`
- Usuarios del sistema solo para auditor

## Pruebas recomendadas

1. Levantar desde cero:

```bash
docker compose down -v
docker compose up --build
```

2. Entrar a `http://localhost:3001`.
3. Probar login/logout con los 5 usuarios.
4. Verificar que cada rol solo vea sus vistas permitidas.
5. Con `inventario_de_prueba`, crear, editar y eliminar productos.
6. Con `ventas_de_prueba`, crear clientes y completar una venta.
7. Intentar una venta con stock insuficiente para validar el rollback.
8. Con `reportes_de_prueba`, revisar reportes.
9. Con `auditor_de_prueba`, revisar el reporte adicional de usuarios del sistema.

## Rama de entrega

El proyecto debe entregarse en la rama:

```text
proyecto-3
```
