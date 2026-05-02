# Antony Saz 24710
# proyecto 2 de bases de datos


este proyeccto es una web para gestionar el invetario y vetas de una tienda

## Requisitos
- Docker y Docker Compose
- Node.js (opcional, para desarrollo)

## Instrucciones para levantar el proyecto

Toda la infraestructura esta dockerizada. El contenedor de la base de datos utiliza las credenciales requeridas (`proy2` / `secret`) especificadas en el archivo `.env`.
Ademas, la base de datos se inicializa automaticamente con el DDL, los indices, la Vista y los datos de prueba mediante el archivo `init.sql`.

Ejecuta el siguiente comando en la raiz del proyectos:

```bash
docker compose up --build
```


Esto levantara los siguientes servicios:
- **Base de Datos (PostgreSQL):** Puerto 5432
- **Backend (Node.js/Express):** Puerto 3000
- **Frontend (React):** Puerto 3001 

## Acceso a la aplicación
Una vez que los contenedores estén corriendo, abre tu navegador en:
**http://localhost:3001**

## Características Implementadas (Rúbrica)
- **Base de Datos:** Inicialización completa con llaves foraneas, primarias y not null. 25 registros por tabla, indices en 3 columnas.
- **Backend/SQL:** 
  - Consultas JOIN entre multiples tablas. producto y cliente
  - Subquery IN y EXISTS 
  - GROUP BY y HAVING (Top Productos).
  - CTE (Top Clientes).
  - VIEW (Detalle Ventas).
  - Transacciones Explícitas BEGIN, COMMIT, ROLLBACK en la creación de ventas.
- **Frontend:**
  - CRUD visible para 2 entidades productos y clientes.
  - Manejo visible de errores en UI.
  - Reportes de base de datos visibles.
  - **Avanzado:** Opcion de exportar los reportes a CSV.
