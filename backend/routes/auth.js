import express from 'express';
import bcrypt from 'bcryptjs';
import { UsuarioApp } from '../models/index.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contrasena son obligatorios' });
        }

        const usuario = await UsuarioApp.findOne({ where: { username } });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }

        req.session.user = {
            id_usuario: usuario.id_usuario,
            username: usuario.username,
            rol: usuario.rol,
        };

        res.json({ user: req.session.user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            return res.status(500).json({ error: 'No se pudo cerrar sesion' });
        }

        res.clearCookie('connect.sid');
        res.json({ message: 'Sesion cerrada' });
    });
});

router.get('/me', (req, res) => {
    if (!req.session?.user) {
        return res.status(401).json({ error: 'No hay sesion activa' });
    }

    res.json({ user: req.session.user });
});

export default router;
