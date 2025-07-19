import { Router } from 'express';
import { 
  getAllVocab, 
  getVocabByLevel, 
  getVocabByTopic, 
  getVocabByWordOrTranslation, 
  postVocab 
} from '../controllers/vocabController';

const router = Router();

router.get('/fetch-all', getAllVocab);
router.get('/fetch-by/topic/:topic', getVocabByTopic)
router.get('/fetch-by/word/:searchTerm', getVocabByWordOrTranslation);
router.get('/fetch-by/level/:level', getVocabByLevel);
router.post('/add', postVocab);

export default router;