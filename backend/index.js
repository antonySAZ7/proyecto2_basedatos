import express from 'express';
import cors from 'cors';
import session from 'express-session';

import auth from './routes/auth.js';
import productos from './routes/productos.js';
import ventas from './routes/ventas.js';
import reportes from './routes/reportes.js';
import clientes from './routes/clientes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'proyecto3-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
    },
}));

app.use('/auth', auth);
app.use('/productos', productos);
app.use('/ventas', ventas);
app.use('/reportes', reportes);
app.use('/clientes', clientes);

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});
