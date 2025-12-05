import { Router } from 'express';
import { registerCtrl, loginCtrl, verifyCodeCtrl } from '../controllers/auth.controller';

const router = Router();

router.post('/register', registerCtrl);

router.post('/login', loginCtrl);

router.post('/verify', verifyCodeCtrl);

export { router };