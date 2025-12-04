import { Router } from 'express';
import { checkJwt } from '../middlewares/session';
import { getDashboardStats } from '../controllers/analytics.controller';

const router = Router();

// Solo usuarios logueados pueden ver el dashboard (Seguridad básica)
router.get('/dashboard', checkJwt, getDashboardStats);

export { router };