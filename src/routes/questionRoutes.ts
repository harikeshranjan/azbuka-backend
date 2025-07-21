import { Router } from 'express';
import {
  addQuestion,
  getQuestionById,
  getQuestions,
  getRandomQuestions,
} from '../controllers/questionController';

const router = Router();

router.post('/add', addQuestion);
router.get('/fetch-all', getQuestions);
router.get('/fetch-by/id/:id', getQuestionById);
router.get('/fetch/random', getRandomQuestions);

export default router;