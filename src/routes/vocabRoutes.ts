import { Router } from 'express';
import { 
  getAllVocab, 
  getRandomVocab,
  getVocabByLevel, 
  getVocabByTopic, 
  getVocabByWordOrTranslation, 
  getVocabStatus, 
  postVocab 
} from '../controllers/vocabController';

const router = Router();

router.get('/status', getVocabStatus);
router.get('/fetch-all', getAllVocab);
router.get('/fetch-by/topic/:topic', getVocabByTopic)
router.get('/fetch-by/word/:searchTerm', getVocabByWordOrTranslation);
router.get('/fetch-by/level/:level', getVocabByLevel);
router.get('/fetch/random', getRandomVocab);
router.post('/add', postVocab);

export default router;