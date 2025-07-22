import { Schema, models, model } from "mongoose";
import { IPhrase, VocabTopic } from "../utils/types";

const phraseSchema = new Schema<IPhrase>({
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
        enum: Object.values(VocabTopic),
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

const Phrase = models.Phrase || model<IPhrase>("Phrase", phraseSchema);

export default Phrase;