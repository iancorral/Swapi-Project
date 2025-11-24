import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'token.01010101';

// Generar un token (cuando el usuario se loguea)
const generateToken = (id: string) => {
    const jwt = sign({ id }, JWT_SECRET, {
        expiresIn: '2h', // El token expira en 2 horas (seguridad)
    });
    return jwt;
};

// Verificar si el token es válido (para proteger rutas)
const verifyToken = (jwt: string) => {
    const isOk = verify(jwt, JWT_SECRET);
    return isOk;
};

export { generateToken, verifyToken };