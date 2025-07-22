"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userInfoSchema = new mongoose_1.Schema({
    xpEarned: {
        type: Number,
        required: true,
        default: 0,
    },
    vocabLearned: {
        type: Number,
        required: true,
        default: 0,
    },
    phrasesLearned: {
        type: Number,
        required: true,
        default: 0,
    },
    questionsAnswered: {
        type: Number,
        required: true,
        default: 0,
    },
    level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true,
        default: "beginner",
    },
    lastLessonDate: {
        type: Date,
        required: true,
        default: Date.now,
    }
}, {
    timestamps: true
});
const UserInfo = mongoose_1.models.UserInfo || (0, mongoose_1.model)("userinfo", userInfoSchema);
exports.default = UserInfo;
