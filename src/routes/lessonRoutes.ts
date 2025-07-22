import { Router } from "express";
import { 
  generateEasyLesson,
  generateHardLesson, 
} from "../controllers/lessonsController";

const router = Router();

router.get("/generate-easy", generateEasyLesson);
router.get("/generate-hard", generateHardLesson)

export default router;