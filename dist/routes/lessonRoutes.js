"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lessonsController_1 = require("../controllers/lessonsController");
const router = (0, express_1.Router)();
router.get("/generate-easy", lessonsController_1.generateEasyLesson);
router.get("/generate-hard", lessonsController_1.generateHardLesson);
exports.default = router;
