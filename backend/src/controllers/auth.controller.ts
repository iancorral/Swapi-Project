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
        if (checkIs) return res.status(400).send('EL_CORREO_YA_EXISTE');

        // 2. Validar correo institucional (Filtro simple)
        if (!email.endsWith('@ulsachihuahua.edu.mx')) { // Ajusta el dominio según corresponda
             // Opcional: permitir otros dominios si es necesario, pero el reporte dice "exclusiva"
             // return res.status(400).send('SOLO_CORREOS_INSTITUCIONALES');
        }

        // 3. Encriptar contraseña
        const passwordHash = await encrypt(password);

        // 4. Generar código de verificación (6 dígitos)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // 5. Guardar usuario (pero isVerified: false)
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
            isVerified: false // Importante: empieza sin verificar
        });

        // 6. Enviar correo
        await sendVerificationCode(email, verificationCode);

        res.send({ message: 'Usuario creado. Revisa tu correo para el código de verificación.', user: newUser });

    } catch (e) {
        console.log(e); // Para ver el error en consola
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
        res.send({ token, user });

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
            res.send('VERIFICACION_EXITOSA');
        } else {
            res.status(400).send('CODIGO_INCORRECTO');
        }

    } catch (e) {
        res.status(500).send('ERROR_VERIFY_CODE');
    }
}

export { registerCtrl, loginCtrl, verifyCodeCtrl };