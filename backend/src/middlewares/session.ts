import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt.handle';
import { JwtPayload } from 'jsonwebtoken';

interface RequestExt extends Request {
    user?: string | JwtPayload;
}

const checkJwt = (req: RequestExt, res: Response, next: NextFunction) => {
    try {
        const jwtNu = req.headers.authorization || '';
        
        // CORRECCIÓN AQUÍ: Separamos 'const' de 'jwt'
        const jwt = jwtNu.split(' ').pop(); 

        // Usamos la variable 'jwt' que acabamos de crear
        const isUser = verifyToken(`${jwt}`);

        if (!isUser) {
            res.status(401).send('NO_TIENES_UN_JWT_VALIDO');
        } else {
            req.user = isUser;
            next();
        }
    } catch (e) {
        res.status(400).send('SESION_NO_VALIDA');
    }
};

export { checkJwt };