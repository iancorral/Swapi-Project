import 'dotenv/config'; 

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db'; 
import { router as authRouter } from './routes/auth';
import { router as postRouter } from './routes/post';
import { router as userStats } from "./routes/user";
import { router as analyticsRouter } from './routes/analytics';

// Database Connection
connectDB(); 

const app: Application = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

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

app.use("/api/analytics", analyticsRouter);

// Start Server
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    console.log(`[swapi]: Development mode enabled`);
});