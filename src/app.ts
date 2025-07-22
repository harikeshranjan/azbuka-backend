import express, { Express } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

import vocabRoutes from './routes/vocabRoutes';
import phraseRoutes from './routes/phraseRoutes';
import questionRoutes from './routes/questionRoutes';
import lessonRoutes from './routes/lessonRoutes';

dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mongoose connection
connectDB();

// routes
app.use('/vocab', vocabRoutes)
app.use('/phrase', phraseRoutes);
app.use('/question', questionRoutes);
app.use('/lesson', lessonRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Azbuka API');
});

export default app;