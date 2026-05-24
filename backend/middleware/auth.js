export function requireAuth(req, res, next) {
    if (!req.session?.user) {
        return res.status(401).json({ error: 'Debes iniciar sesion' });
    }

    next();
}

export function requireRole(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.session?.user) {
            return res.status(401).json({ error: 'Debes iniciar sesion' });
        }

        if (req.session.user.rol === 'rol_administrador') {
            return next();
        }

        if (!rolesPermitidos.includes(req.session.user.rol)) {
            return res.status(403).json({ error: 'No tienes permiso para esta accion' });
        }

        next();
    };
}
