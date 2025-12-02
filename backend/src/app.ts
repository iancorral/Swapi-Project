// 1. IMPORTACIÓN DIRECTA (Esto fuerza la carga inmediata)
import 'dotenv/config'; 

// 2. AHORA EL RESTO DE IMPORTS
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db'; 
import { router as authRouter } from './routes/auth';
import { router as postRouter } from './routes/post';
import { router as userStats } from "./routes/user";

// Ya no necesitas llamar a dotenv.config() aquí abajo, la línea 1 ya lo hizo.

// Database Connection
connectDB(); 

const app: Application = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// ADELANTE LA QUITAREMOS
const storagePath = path.join(process.cwd(), 'storage');
app.use('/storage', express.static(storagePath));

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use("/api/user", userStats);

// Test Route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ 
        message: 'Welcome to Swapi API! 🚀',
        status: 'Server is running',
        version: '1.0.0'
    });
});

// Start Server
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    console.log(`[swapi]: Development mode enabled`);
});