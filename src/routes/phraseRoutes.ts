import { Router } from "express";
import { 
  getAllPhrases, 
  getPhrasesByLevel, 
  getPhrasesByTopic, 
  getPhrasesByWordOrTranslation, 
  getPhraseStatus, 
  getRandomPhrase,
  postPhrase
} from "../controllers/phraseController";

const router = Router();

router.get('/status', getPhraseStatus);
router.get('/fetch-all', getAllPhrases);
router.get('/fetch-by/topic/:topic', getPhrasesByTopic);
router.get('/fetch-by/word/:searchTerm', getPhrasesByWordOrTranslation);
router.get('/fetch-by/level/:level', getPhrasesByLevel);
router.get('/fetch/random', getRandomPhrase);
router.post('/add', postPhrase);

export default router;