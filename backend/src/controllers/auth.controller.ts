import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import { encrypt, verify } from '../utils/password.handle';
import { generateToken } from '../utils/jwt.handle';
import { sendVerificationCode } from '../utils/mailer';

// REGISTRO
const registerCtrl = async (req: Request, res: Response) => {
    try {
        const { firstName, paternalSurname, maternalSurname, email, password, age, gender, phone } = req.body;

        const checkIs = await UserModel.findOne({ email });
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const passwordHash = await encrypt(password);

        if (checkIs) {
            // CASO A: Usuario ya verificado
            if (checkIs.isVerified) {
                return res.status(400).send({
                    success: false,
                    code: 'AUTH_EMAIL_EXISTS',
                    message: 'El correo ya existe'
                });
            } 
            
            // CASO B: Usuario pendiente (Reenviar código)
            await UserModel.updateOne({ email }, {
                firstName, paternalSurname, maternalSurname,
                password: passwordHash, age, gender, phone,
                verificationCode
            });

            await sendVerificationCode(email, verificationCode);

            return res.send({ 
                success: true,
                code: 'AUTH_REGISTER_RESEND',
                message: 'Código reenviado', 
                user: checkIs 
            });
        }

        // CASO C: Usuario Nuevo
        // Validar correo institucional (ACTIVADO)
        if (!email.endsWith('@ulsachihuahua.edu.mx')) { 
             return res.status(400).send({
                success: false,
                code: 'AUTH_INVALID_DOMAIN',
                message: 'Solo correos institucionales'
             });
        }

        const newUser = await UserModel.create({
            firstName, paternalSurname, maternalSurname, email,
            password: passwordHash, age, gender, phone,
            verificationCode, isVerified: false 
        });

        await sendVerificationCode(email, verificationCode);

        res.send({ 
            success: true,
            code: 'AUTH_REGISTER_SUCCESS',
            message: 'Usuario creado. Revisa tu correo.', 
            user: newUser 
        });

    } catch (e) {
        console.log(e);
        res.status(500).send({ success: false, code: 'AUTH_REGISTER_ERROR' });
    }
};

// LOGIN
const loginCtrl = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).send({ success: false, code: 'AUTH_USER_NOT_FOUND' });

        if (!user.isVerified) return res.status(401).send({ success: false, code: 'AUTH_NOT_VERIFIED' });

        const isCorrect = await verify(password, user.password);
        if (!isCorrect) return res.status(403).send({ success: false, code: 'AUTH_INCORRECT_PASSWORD' });

        const token = generateToken(user.id);
        
        res.send({
            success: true,
            code: 'AUTH_LOGIN_SUCCESS',
            message: "Bienvenido",
            token,
            user
        });

    } catch (e) {
        res.status(500).send({ success: false, code: 'AUTH_LOGIN_ERROR' });
    }
};

// VERIFICAR CÓDIGO
const verifyCodeCtrl = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) return res.status(404).send({ success: false, code: 'AUTH_USER_NOT_FOUND' });
        
        if (user.verificationCode === code) {
            await UserModel.updateOne({ email }, { isVerified: true, verificationCode: '' });
            res.json({ success: true, code: 'VERIFICACION_EXITOSA', message: 'Cuenta verificada' });
        } else {
            res.status(400).send({ success: false, code: 'AUTH_INCORRECT_CODE', message: 'Código incorrecto' });
        }

    } catch (e) {
        res.status(500).send({ success: false, code: 'AUTH_VERIFY_ERROR' });
    }
}

export { registerCtrl, loginCtrl, verifyCodeCtrl };