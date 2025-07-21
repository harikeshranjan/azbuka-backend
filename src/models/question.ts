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
    default: undefined,
    validate: {
      validator: function (this: any, arr: String[]) {
        if (["multiple-choice", "true-false", "fill-in-the-blank"].includes(this.type)) {
          return Array.isArray(arr) && arr.length >= 2;
        }
        return true;
      },
      message: "At least two options are required for multiple-choice or true-false questions.",
    },
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
    default: 1,
  },
  type: {
    type: String,
    enum: ["multiple-choice", "fill-in-the-blank", "true-false", "written"],
    required: true,
  },
  sourceLang:{
    type: String,
    enum: ["en", "ru"],
    required: function(this: IQuestion) {
      return this.type === "written";
    }
  },
  targetLang:{
    type: String,
    enum: ["en", "ru"],
    required: function(this: IQuestion) {
      return this.type === "written";
    }
  },
  acceptableAnswers: {
    type: [String],
    default: [],
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