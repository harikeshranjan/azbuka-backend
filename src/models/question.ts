import { Schema, models, model } from "mongoose";
import { IQuestion, VocabTopic } from "../utils/types";

const questionSchema = new Schema<IQuestion>({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [(arr: string[]) => arr.length > 2, "At least three options are required."],
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
  explanation: {
    type: String,
    trim: true,
  },
  topic: {
    type: String,
    enum: Object.values(VocabTopic),
    required: true,
  },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  difficultyScore: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  type: {
    type: String,
    enum: ["multiple-choice", "fill-in-the-blank", "true-false"],
    required: true,
  },
  isLearned: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
})

const Question = models.Question || model<IQuestion>("Question", questionSchema);

export default Question;