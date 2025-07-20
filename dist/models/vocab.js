"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const types_1 = require("../utils/types");
const vocabSchema = new mongoose_1.Schema({
    word: { type: String, required: true },
    translation: { type: String, required: true },
    partOfSpeech: { type: String, required: true },
    gender: {
        type: String,
        enum: ["masculine", "feminine", "neutral"],
        default: "neutral",
    },
    plural: { type: String },
    exampleSentence: { type: String, required: true },
    exampleTranslation: { type: String, required: true },
    topic: {
        type: String,
        enum: Object.values(types_1.VocabTopic),
        required: true
    },
    level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true
    },
    isLearned: { type: Boolean, default: false }
}, {
    timestamps: true,
});
const Vocab = mongoose_1.models.Vocab || (0, mongoose_1.model)("Vocab", vocabSchema);
exports.default = Vocab;
