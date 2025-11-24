import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db'; 

// Configuration
dotenv.config();

// Database Connection
connectDB(); 

const app: Application = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

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