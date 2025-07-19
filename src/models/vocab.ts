import {Schema, models, model} from "mongoose";
import {IVocab, VocabTopic} from "../utils/types";

const vocabSchema = new Schema<IVocab>({
  word: {type: String, required: true},
  translation: {type: String, required: true},
  partOfSpeech: {type: String, required: true},
  gender: {
    type: String,
    enum: ["masculine", "feminine", "neutral"],
    default: "neutral",
  },
  plural: {type: String},
  exampleSentence: {type: String, required: true},
  exampleTranslation: {type: String, required: true},
  topic: {
    type: String,
    enum: Object.values(VocabTopic),
    required: true
  },
  level: {
    type: String, 
    enum: ["beginner", "intermediate", "advanced"], 
    required: true
  },
  isLearned: {type: Boolean, default: false}
}, {
  timestamps: true,
})

const Vocab = models.Vocab || model<IVocab>("Vocab", vocabSchema);

export default Vocab;