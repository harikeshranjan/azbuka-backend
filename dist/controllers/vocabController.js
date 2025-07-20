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
exports.postVocab = exports.getTwentyRandomVocabByLevel = exports.getTenRandomVocabByLevel = exports.getRandomVocab = exports.getVocabByLevel = exports.getVocabByWordOrTranslation = exports.getVocabByTopic = exports.getAllVocab = void 0;
const vocab_1 = __importDefault(require("../models/vocab"));
const types_1 = require("../utils/types");
// MARK: GET request to retrieve all vocabulary entries
const getAllVocab = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vocabList = yield vocab_1.default.find();
        res.status(200).json(vocabList);
    }
    catch (error) {
        console.error("Error retrieving vocabulary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllVocab = getAllVocab;
// MARK: GET request to retrieve vocabulary entries by topic
const getVocabByTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topic } = req.params;
        const { level, isLearned, gender, partOfSpeech } = req.query;
        // Validate topic
        if (!Object.values(types_1.VocabTopic).includes(topic)) {
            return res.status(400).json({ message: "Invalid topic provided." });
        }
        // Build dynamic query
        const query = {
            topic: topic,
        };
        if (level)
            query.level = level;
        if (isLearned !== undefined)
            query.isLearned = isLearned === 'true';
        if (gender)
            query.gender = gender;
        if (partOfSpeech)
            query.partOfSpeech = partOfSpeech;
        const vocab = yield vocab_1.default.find(query);
        if (vocab.length === 0) {
            return res.status(404).json({ message: "No vocabulary found for the specified topic." });
        }
        res.status(200).json({
            message: `Vocabulary entries for topic: ${topic}`,
            filters: { level, isLearned },
            vocab: vocab,
        });
    }
    catch (error) {
        console.error("Error retrieving vocabulary by topic:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getVocabByTopic = getVocabByTopic;
// MARK: GET request to fetch vocabulary either by word or translation
const getVocabByWordOrTranslation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm } = req.params;
        if (!searchTerm || typeof searchTerm !== "string") {
            return res.status(400).json({ message: "Invalid or missing search term." });
        }
        const term = searchTerm.trim();
        const regex = new RegExp(term, "i");
        const vocab = yield vocab_1.default.find({
            $or: [
                { word: regex },
                { translation: regex },
            ]
        });
        if (vocab.length === 0) {
            return res.status(404).json({ message: "No vocabulary found matching the search term." });
        }
        res.status(200).json(vocab);
    }
    catch (error) {
        console.error("Error retrieving vocabulary by word or translation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getVocabByWordOrTranslation = getVocabByWordOrTranslation;
// MARK: GET request to fetch vocabulary by level
const getVocabByLevel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { level } = req.params;
        // Validate level
        if (!["beginner", "intermediate", "advanced"].includes(level)) {
            return res.status(400).json({ message: "Invalid level provided." });
        }
        const vocab = yield vocab_1.default.find({ level }).sort({ createdAt: -1 });
        if (vocab.length === 0) {
            return res.status(404).json({ message: `No vocabulary found for level: ${level}` });
        }
        res.status(200).json(vocab);
    }
    catch (error) {
        console.error("Error retrieving vocabulary by level:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getVocabByLevel = getVocabByLevel;
// MARK: GET request to fetch a random vocabulary entry
const getRandomVocab = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield vocab_1.default.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomVocab = yield vocab_1.default.findOne().skip(randomIndex); // Skip to the random index
        if (!randomVocab) {
            return res.status(404).json({ message: "No vocabulary entries found." });
        }
        res.status(200).json(randomVocab);
    }
    catch (error) {
        console.error("Error retrieving random vocabulary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRandomVocab = getRandomVocab;
// MARK: GET request to fetch 10 random vocabulary by level
const getTenRandomVocabByLevel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { level } = req.params;
        // Validate level
        if (!["beginner", "intermediate", "advanced"].includes(level)) {
            return res.status(400).json({ message: "Invalid level provided." });
        }
        const randomVocab = yield vocab_1.default.aggregate([
            { $match: { level, isLearned: false } },
            { $sample: { size: 10 } }
        ]);
        if (randomVocab.length === 0) {
            return res.status(404).json({ message: `No unlearned vocabulary entries found for level: ${level}` });
        }
        res.status(200).json(randomVocab);
    }
    catch (error) {
        console.error("Error retrieving 10 random vocabulary by level:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getTenRandomVocabByLevel = getTenRandomVocabByLevel;
// // MARK: GET request to fetch 10 random vocabulary entries of beginner level
// export const getTenRandomBeginnerVocab = async (_req: Request, res: Response) => {
//   try {
//     const randomBeginnerVocab = await Vocab.aggregate([
//       { $match: { level: "beginner", isLearned: false } },
//       { $sample: { size: 10 } }
//     ])
//     if (randomBeginnerVocab.length === 0) {
//       return res.status(404).json({ message: "No unlearned beginner vocabulary entries found." });
//     }
//     res.status(200).json(randomBeginnerVocab);
//   } catch (error) {
//     console.error("Error retrieving random beginner vocabulary:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }
// // MARK: GET request to fetch 10 random vocabulary entries of intermediate level
// export const getTenRandomIntermediateVocab = async (_req: Request, res: Response) => {
//   try {
//     const randomIntermediateVocab = await Vocab.aggregate([
//       { $match: { level: "intermediate", isLearned: false } },
//       { $sample: { size: 10 } }
//     ])
//     if (randomIntermediateVocab.length === 0) {
//       return res.status(404).json({ message: "No unlearned intermediate vocabulary entries found." });
//     }
//     res.status(200).json(randomIntermediateVocab);
//   } catch (error) {
//     console.error("Error retrieving random intermediate vocabulary:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }
// // MARK: GET request to fetch 10 random vocabulary entries of advanced level
// export const getTenRandomAdvancedVocab = async (_req: Request, res: Response) => {
//   try {
//     const randomAdvancedVocab = await Vocab.aggregate([
//       { $match: { level: "advanced", isLearned: false } },
//       { $sample: { size: 10 } }
//     ])
//     if (randomAdvancedVocab.length === 0) {
//       return res.status(404).json({ message: "No unlearned advanced vocabulary entries found." });
//     }
//     res.status(200).json(randomAdvancedVocab);
//   } catch (error) {
//     console.error("Error retrieving random advanced vocabulary:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }
// MARK: GET request to fetch 20 random vocabulary entries by level
const getTwentyRandomVocabByLevel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { level } = req.params;
        // Validate level
        if (!["beginner", "intermediate", "advanced"].includes(level)) {
            return res.status(400).json({ message: "Invalid level provided." });
        }
        const randomVocab = yield vocab_1.default.aggregate([
            { $match: { level, isLearned: false } },
            { $sample: { size: 20 } }
        ]);
        if (randomVocab.length === 0) {
            return res.status(404).json({ message: `No unlearned vocabulary entries found for level: ${level}` });
        }
        res.status(200).json(randomVocab);
    }
    catch (error) {
        console.error("Error retrieving 20 random vocabulary by level:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getTwentyRandomVocabByLevel = getTwentyRandomVocabByLevel;
// MARK: POST request to create a new vocabulary entry
const postVocab = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { word, translation, partOfSpeech, gender, plural, exampleSentence, exampleTranslation, topic, level, isLearned } = req.body;
        // Basic validation for topic from request body
        if (!Object.values(types_1.VocabTopic).includes(topic)) {
            return res.status(400).json({ message: "Invalid topic provided in request body." });
        }
        // Validate gender if provided
        if (!["masculine", "feminine", "neutral"].includes(gender)) {
            return res.status(400).json({
                message: "Invalid gender provided. Allowed values are: masculine, feminine, neutral."
            });
        }
        const newVocab = yield vocab_1.default.create({ word, translation, partOfSpeech, gender, plural, exampleSentence, exampleTranslation, topic, level, isLearned });
        res.status(201).json(newVocab);
    }
    catch (error) {
        console.error("Error creating vocabulary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.postVocab = postVocab;
