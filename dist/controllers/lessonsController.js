"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHardLesson = exports.generateEasyLesson = void 0;
const question_1 = __importDefault(require("../models/question"));
const generateEasyLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lessonNumber } = req.query;
        const level = Number(lessonNumber) || 1;
        // calculate the difficulty range based on the lesson number
        const difficultyLevel = Math.floor((level - 1) / 30);
        const minDifficulty = 1 + difficultyLevel * 2;
        const maxDifficulty = Math.min(minDifficulty + 2, 10);
        const matchFilter = {
            difficultyScore: {
                $gte: minDifficulty,
                $lte: maxDifficulty,
            }
        };
        const [FillInTheBlank, TrueFalse, MultipleChoice, Written] = yield Promise.all([
            question_1.default.aggregate([
                { $match: Object.assign({ type: "fill-in-the-blank" }, matchFilter) },
                { $sample: { size: 3 } },
            ]),
            question_1.default.aggregate([
                { $match: Object.assign({ type: "true-false" }, matchFilter) },
                { $sample: { size: 2 } },
            ]),
            question_1.default.aggregate([
                { $match: Object.assign({ type: "multiple-choice" }, matchFilter) },
                { $sample: { size: 3 } },
            ]),
            question_1.default.aggregate([
                { $match: Object.assign({ type: "written" }, matchFilter) },
                { $sample: { size: 2 } },
            ]),
        ]);
        const lesson = {
            lessonNumber: Number(lessonNumber),
            questions: [
                ...FillInTheBlank.map(q => (Object.assign(Object.assign({}, q), { type: "fill-in-the-blank" }))),
                ...TrueFalse.map(q => (Object.assign(Object.assign({}, q), { type: "true-false" }))),
                ...MultipleChoice.map(q => (Object.assign(Object.assign({}, q), { type: "multiple-choice" }))),
                ...Written.map(q => (Object.assign(Object.assign({}, q), { type: "written" }))),
            ],
            xpReward: 15,
            difficultyRange: `${minDifficulty}-${maxDifficulty}`,
        };
        res.status(200).json(lesson);
    }
    catch (error) {
        console.error("Error generating lesson:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.generateEasyLesson = generateEasyLesson;
const generateHardLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lessonNumber } = req.query;
        const level = Number(lessonNumber) || 1;
        // calculate the difficulty range based on the lesson number
        const difficultyLevel = Math.floor((level - 1) / 30);
        const minDifficulty = 3 + difficultyLevel * 2;
        const maxDifficulty = Math.min(minDifficulty + 2, 10);
        const matchFilter = {
            difficultyScore: {
                $gte: minDifficulty,
                $lte: maxDifficulty,
            }
        };
        const [FillInTheBlank, TrueFalse, MultipleChoice, Written] = yield Promise.all([
            question_1.default.aggregate([
                { $match: Object.assign({ type: "fill-in-the-blank" }, matchFilter) },
                { $sample: { size: 5 } },
            ]),
            question_1.default.aggregate([
                { $match: Object.assign({ type: "true-false" }, matchFilter) },
                { $sample: { size: 5 } },
            ]),
            question_1.default.aggregate([
                { $match: Object.assign({ type: "multiple-choice" }, matchFilter) },
                { $sample: { size: 5 } },
            ]),
            question_1.default.aggregate([
                { $match: Object.assign({ type: "written" }, matchFilter) },
                { $sample: { size: 5 } },
            ]),
        ]);
        const lesson = {
            lessonNumber: Number(lessonNumber),
            questions: [
                ...FillInTheBlank.map(q => (Object.assign(Object.assign({}, q), { type: "fill-in-the-blank" }))),
                ...TrueFalse.map(q => (Object.assign(Object.assign({}, q), { type: "true-false" }))),
                ...MultipleChoice.map(q => (Object.assign(Object.assign({}, q), { type: "multiple-choice" }))),
                ...Written.map(q => (Object.assign(Object.assign({}, q), { type: "written" }))),
            ],
            xpReward: 30,
            difficultyRange: `${minDifficulty}-${maxDifficulty}`,
        };
        res.status(200).json(lesson);
    }
    catch (error) {
        console.error("Error generating hard lesson:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.generateHardLesson = generateHardLesson;
