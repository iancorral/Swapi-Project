import { Router } from 'express';
import { checkJwt } from '../middlewares/session';
import { getDashboardStats } from '../controllers/analytics.controller';

const router = Router();

router.get('/dashboard', checkJwt, getDashboardStats);

export { router };