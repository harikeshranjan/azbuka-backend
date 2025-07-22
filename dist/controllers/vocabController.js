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
exports.postVocab = exports.getRandomVocab = exports.getVocabByLevel = exports.getVocabByWordOrTranslation = exports.getVocabByTopic = exports.getAllVocab = exports.getVocabStatus = void 0;
const vocab_1 = __importDefault(require("../models/vocab"));
const types_1 = require("../utils/types");
// MARK: GET request to retrieve the status of the vocabularies
const getVocabStatus = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalCount = yield vocab_1.default.countDocuments();
        const learnedCount = yield vocab_1.default.countDocuments({ isLearned: true });
        const notLearnedCount = totalCount - learnedCount;
        const beginnerCount = yield vocab_1.default.countDocuments({ level: "beginner" });
        const intermediateCount = yield vocab_1.default.countDocuments({ level: "intermediate" });
        const advancedCount = yield vocab_1.default.countDocuments({ level: "advanced" });
        const eachTopicCount = yield vocab_1.default.aggregate([
            {
                $group: {
                    _id: "$topic",
                    count: { $sum: 1 }
                }
            }
        ]);
        const levelsCount = {
            beginner: beginnerCount,
            intermediate: intermediateCount,
            advanced: advancedCount,
        };
        const status = {
            totalCount,
            learnedCount,
            notLearnedCount,
            levelsCount,
            topics: eachTopicCount.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {})
        };
        res.status(200).json(status);
    }
    catch (error) {
        console.error("Error retrieving vocabulary status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getVocabStatus = getVocabStatus;
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
// MARK: GET request to fetch 10 random vocabulary entries by topic and level
const getRandomVocab = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { n, topic, level, gender, partOfSpeech, isLearned, } = req.query;
        const query = {};
        // Topic validation
        if (topic) {
            if (!Object.values(types_1.VocabTopic).includes(topic)) {
                return res.status(400).json({ message: "Invalid topic provided." });
            }
            query.topic = topic;
        }
        // Level validation
        if (level) {
            if (!["beginner", "intermediate", "advanced"].includes(level)) {
                return res.status(400).json({ message: "Invalid level provided." });
            }
            query.level = level;
        }
        if (gender)
            query.gender = gender;
        if (partOfSpeech)
            query.partOfSpeech = partOfSpeech;
        // Handle isLearned as boolean
        if (isLearned !== undefined) {
            query.isLearned = String(isLearned) === "true";
        }
        else {
            query.isLearned = false; // Default behavior
        }
        const size = n ? parseInt(n.toString(), 10) : 10;
        const vocabList = yield vocab_1.default.aggregate([
            { $match: query },
            { $sample: { size } }
        ]);
        if (vocabList.length === 0) {
            return res.status(404).json({
                message: "No vocabulary entries found matching your criteria."
            });
        }
        res.status(200).json(vocabList);
    }
    catch (error) {
        console.error("Error retrieving 10 random vocabulary entries:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRandomVocab = getRandomVocab;
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
