import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import { router } from './routes/laptops.js'; // MongoDB laptop routes - commented out
// import { router as employee } from './routes/employee.js'; // MongoDB employee routes - commented out
import { router as pgEmployees } from './routes/pgEmployees.js';
import { router as pgClients } from './routes/pgClients.js';
dotenv.config();
// import './db/index.js'; // MongoDB connection - uncomment if using MongoDB routes

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// routes - PostgreSQL only
// app.use('/api/v1', router); // MongoDB laptop routes - commented out
// app.use('/api/v2', employee); // MongoDB employee routes - commented out
app.use('/api', pgEmployees); // PostgreSQL employee routes
app.use('/api', pgClients); // PostgreSQL client routes

app.listen(PORT, () => console.log(`Server is Running....!`));

export { JWT_SECRET };
