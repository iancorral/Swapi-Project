import { Router } from 'express';
import { registerCtrl, loginCtrl, verifyCodeCtrl } from '../controllers/auth.controller';

const router = Router();

// Definimos las rutas y qué función del controlador las atiende

// POST http://localhost:3000/auth/register
router.post('/register', registerCtrl);

// POST http://localhost:3000/auth/login
router.post('/login', loginCtrl);

// POST http://localhost:3000/auth/verify
router.post('/verify', verifyCodeCtrl);

export { router };