import express from 'express';
import cors from 'cors';

import productos from './routes/productos.js';
import ventas from './routes/ventas.js';
import reportes from './routes/reportes.js';
import clientes from './routes/clientes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/productos', productos);
app.use('/ventas', ventas);
app.use('/reportes', reportes);
app.use('/clientes', clientes);

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});
