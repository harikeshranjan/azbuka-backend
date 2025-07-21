import { Router } from "express";
import { 
  generateLesson 
} from "../controllers/lessonsController";

const router = Router();

router.get("/generate", generateLesson);

export default router;