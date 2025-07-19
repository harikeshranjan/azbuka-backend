import express, { Express } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import vocabRoutes from './routes/vocabRoutes';

dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mongoose connection
connectDB();

// routes
app.use('/vocab', vocabRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to the Azbuka API');
});

export default app;