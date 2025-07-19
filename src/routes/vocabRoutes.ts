import { Router } from 'express';
import { 
  getAllVocab, 
  getVocabByTopic, 
  postVocab 
} from '../controllers/vocabController';

const router = Router();

router.get('/fetch-all', getAllVocab);
router.get('/fetch-by/:topic', getVocabByTopic);
router.post('/add', postVocab);

export default router;