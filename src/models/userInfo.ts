import { Schema, models, model } from "mongoose";
import { IUserInfo } from "../utils/types";

const userInfoSchema = new Schema<IUserInfo>({
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

const UserInfo = models.UserInfo || model<IUserInfo>("userinfo", userInfoSchema);

export default UserInfo;