import { Router } from 'express';
import { 
  getAllVocab, 
  getRandomVocab,
  getTenRandomVocabByLevel, 
  getTwentyRandomVocabByLevel, 
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
router.get('/fetch/random', getRandomVocab);
router.get('/fetch/random10/level/:level', getTenRandomVocabByLevel);
router.get('/fetch/random20/level/:level', getTwentyRandomVocabByLevel);
router.post('/add', postVocab);

export default router;