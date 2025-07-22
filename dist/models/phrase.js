"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const types_1 = require("../utils/types");
const phraseSchema = new mongoose_1.Schema({
    phrase: {
        type: String,
        required: true,
        trim: true,
    },
    translation: {
        type: String,
        required: true,
        trim: true,
    },
    exampleSentence: {
        type: String,
        required: true,
        trim: true,
    },
    exampleTranslation: {
        type: String,
        required: true,
        trim: true,
    },
    topic: {
        type: String,
        required: true,
        enum: Object.values(types_1.VocabTopic),
    },
    level: {
        type: String,
        required: true,
        enum: ["beginner", "intermediate", "advanced"],
    },
    isLearned: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const Phrase = mongoose_1.models.Phrase || (0, mongoose_1.model)("Phrase", phraseSchema);
exports.default = Phrase;
