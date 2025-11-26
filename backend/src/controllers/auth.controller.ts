import { Request, Response } from 'express';
// import { registerNewUser, loginUser } from '../services/auth.service'; // Crearemos esto en un momento para ser ordenados
import UserModel from '../models/user.model';
import { encrypt, verify } from '../utils/password.handle';
import { generateToken } from '../utils/jwt.handle';
import { sendVerificationCode } from '../utils/mailer';

// REGISTRO
const registerCtrl = async (req: Request, res: Response) => {
    try {
        const { firstName, paternalSurname, maternalSurname, email, password, age, gender, phone } = req.body;

        // 1. Verificar si el usuario ya existe
        const checkIs = await UserModel.findOne({ email });

        // Generamos el código y encriptamos la contraseña desde antes para usarlos en ambos casos
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const passwordHash = await encrypt(password);

        if (checkIs) {
            // CASO A: El usuario existe Y YA ESTÁ VERIFICADO
            if (checkIs.isVerified) {
                return res.status(400).send({
                    success: false,
                    message: 'EL_CORREO_YA_EXISTE',
                    user: null
                });
            } 
            
            // CASO B: El usuario existe PERO NO ESTÁ VERIFICADO (Tu caso)
            // Solución: Actualizamos sus datos y le mandamos un código nuevo
            await UserModel.updateOne({ email }, {
                firstName,
                paternalSurname,
                maternalSurname,
                password: passwordHash, // Actualizamos por si se equivocó en la pass anterior
                age,
                gender,
                phone,
                verificationCode // Guardamos el nuevo código
            });

            // Reenviamos el correo
            await sendVerificationCode(email, verificationCode);

            return res.send({ 
                success: true,
                message: 'Usuario pendiente actualizado. Se ha reenviado el código.', 
                user: checkIs 
            });
        }

        // CASO C: El usuario NO existe (Usuario Nuevo)
        // 2. Validar correo institucional (si aplica)
        if (!email.endsWith('@ulsachihuahua.edu.mx')) { 
             // return res.status(400).send('SOLO_CORREOS_INSTITUCIONALES');
        }

        // 3. Crear el usuario nuevo
        const newUser = await UserModel.create({
            firstName,
            paternalSurname,
            maternalSurname,
            email,
            password: passwordHash,
            age,
            gender,
            phone,
            verificationCode,
            isVerified: false 
        });

        // 4. Enviar correo
        await sendVerificationCode(email, verificationCode);

        res.send({ 
            success: true,
            message: 'Usuario creado. Revisa tu correo para el código de verificación.', 
            user: newUser 
        });

    } catch (e) {
        console.log(e);
        res.status(500).send('ERROR_REGISTER_USER');
    }
};

// LOGIN
const loginCtrl = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).send('USUARIO_NO_ENCONTRADO');

        if (!user.isVerified) return res.status(401).send('USUARIO_NO_VERIFICADO');

        const passwordHash = user.password;
        const isCorrect = await verify(password, passwordHash);

        if (!isCorrect) return res.status(403).send('PASSWORD_INCORRECTA');

        const token = generateToken(user.id);
        
        // Enviamos el token y los datos del usuario al frontend/app
        res.send({
            success: true,         // Agregamos esto para ayudar al frontend
            message: "Bienvenido", // Agregamos esto para mostrar en un Toast
            token,
            user
        });

    } catch (e) {
        res.status(500).send('ERROR_LOGIN_USER');
    }
};

// VERIFICAR CÓDIGO
const verifyCodeCtrl = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) return res.status(404).send('USUARIO_NO_ENCONTRADO');
        
        if (user.verificationCode === code) {
            // Actualizamos el usuario a verificado
            await UserModel.updateOne({ email }, { isVerified: true, verificationCode: '' });
            res.json({ success: true, message: 'VERIFICACION_EXITOSA' });
        } else {
            res.status(400).send('CODIGO_INCORRECTO');
        }

    } catch (e) {
        res.status(500).send('ERROR_VERIFY_CODE');
    }
}

export { registerCtrl, loginCtrl, verifyCodeCtrl };