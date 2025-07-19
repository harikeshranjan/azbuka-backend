import { Router } from 'express';
import { 
  getAllVocab, 
  getRandomVocab, 
  getTenRandomAdvancedVocab, 
  getTenRandomBeginnerVocab, 
  getTenRandomIntermediateVocab, 
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
router.get('/fetch/random10/beginner', getTenRandomBeginnerVocab);
router.get('/fetch/random10/intermediate', getTenRandomIntermediateVocab);
router.get('/fetch/random10/advanced', getTenRandomAdvancedVocab);
// router.get('/fetch/random20/beginner', getTenRandomBeginnerVocab);
// router.get('/fetch/random20/intermediate', getTenRandomBeginnerVocab);
// router.get('/fetch/random20/advanced', getTenRandomBeginnerVocab);
router.post('/add', postVocab);

export default router;