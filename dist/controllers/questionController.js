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
exports.getRandomQuestions = exports.getQuestionById = exports.getQuestions = exports.addQuestion = void 0;
const question_1 = __importDefault(require("../models/question"));
const types_1 = require("../utils/types");
// MARK: POST request to add a question
const addQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question, options, answer, explanation, topic, level, difficultyScore, type, sourceLang, targetLang, acceptableAnswers } = req.body;
    if (!question || !answer || !topic || !level || !type) {
        return res.status(400).json({ message: "Missing required fields." });
    }
    if (["multiple-choice", "true-false", "fill-in-the-blank"].includes(type)) {
        if (!options || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ message: "Options must have at least 2 items." });
        }
    }
    if (type === "written") {
        if (!sourceLang || !targetLang) {
            return res.status(400).json({ message: "Source and Target language are required for written questions." });
        }
    }
    const newQuestion = yield question_1.default.create({
        question,
        options,
        answer,
        explanation,
        topic,
        level,
        difficultyScore,
        type,
        sourceLang,
        targetLang,
        acceptableAnswers,
        isLearned: false,
    });
    res.status(201).json(newQuestion);
});
exports.addQuestion = addQuestion;
// MARK: GET request to retrieve questions by topic
const getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield question_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(questions);
    }
    catch (error) {
        console.error("Error retrieving questions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getQuestions = getQuestions;
// MARK: GET request to retrieve questions by id
const getQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const question = yield question_1.default.findById(id);
        if (!question) {
            return res.status(404).json({ message: "Question not found." });
        }
        res.status(200).json(question);
    }
    catch (error) {
        console.error("Error retrieving question:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getQuestionById = getQuestionById;
// MARK: GET request to retrieve random n questions by topic, level, and type
const getRandomQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topic, level, type, isLearned, partOfSpeech, minDifficulty, maxDifficulty, n, } = req.query;
        const limit = parseInt(n) || 10;
        // Validate question type
        if (type && !Object.values(types_1.QuestionType).includes(type)) {
            return res.status(400).json({ message: "Invalid question type provided." });
        }
        const match = {};
        if (topic)
            match.topic = topic;
        if (level)
            match.level = level;
        if (type)
            match.type = type;
        if (partOfSpeech)
            match.partOfSpeech = partOfSpeech;
        if (isLearned !== undefined)
            match.isLearned = isLearned === "true";
        if (minDifficulty || maxDifficulty) {
            match.difficultyScore = {};
            if (minDifficulty)
                match.difficultyScore.$gte = parseInt(minDifficulty);
            if (maxDifficulty)
                match.difficultyScore.$lte = parseInt(maxDifficulty);
        }
        const questions = yield question_1.default.aggregate([
            { $match: match },
            { $sample: { size: limit } },
        ]);
        res.status(200).json(questions);
    }
    catch (error) {
        console.error("Error retrieving random questions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRandomQuestions = getRandomQuestions;
